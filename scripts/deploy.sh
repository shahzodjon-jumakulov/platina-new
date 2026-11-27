#!/usr/bin/env bash
# Deploy the frontend on the VPS so that old /_nuxt/ URLs keep working.
#
#   cd /var/www/platina/pltn-front/platinauz-front
#   git pull                         # or check out the commit to deploy
#   scripts/deploy.sh                # build, swap, pm2 reload, check
#   scripts/deploy.sh rollback [.output.bak-<sha>]   # default: newest backup
#   scripts/deploy.sh check          # just the HTTP checks
#
# deploy:
#  1. Copies the live build's own /_nuxt/ files to .data/old-assets/ (their
#     30 days start now) and deletes files there that have not been live for
#     KEEP_ASSETS_DAYS days. modules/keep-old-assets.ts puts what is left
#     into every new build, so Googlebot and open tabs that still ask for an
#     earlier build's JS/CSS/images get them instead of a 404.
#  2. npm ci, then builds into .output.next/. The live .output/ is not
#     touched, so a failed build changes nothing.
#  3. .output -> .output.bak-<sha of that build>, .output.next -> .output.
#     Keeps the newest KEEP_BACKUPS backups (after step 5).
#  4. pm2 reload platinauz. A plain reload: never --update-env, and never a
#     reload to change HOST/PORT (backend ISSUES.md, 2026-11-19 outage).
#  5. Checks that pm2 restarted every instance, and that on 127.0.0.1:3003 a
#     new asset and a kept one answer 200 and a made-up one 404.
#
# rollback: copies the current build's /_nuxt/ files to .data/old-assets/,
# then steps 3-5 with an existing backup instead of a new build. The current
# build becomes a backup itself (roll forward with another rollback). The
# older build only serves the assets that existed when it was built, so the
# rolled-back build's own files 404 until the next deploy.
#
# Environment (all optional):
#   SKIP_NPM_CI=1      use node_modules as they are
#   SKIP_RELOAD=1      no pm2 and no checks (local testing)
#   KEEP_ASSETS_DAYS   default 30
#   KEEP_BACKUPS       .output.bak-* directories to keep, default 5; "all" keeps all
#   LIVE_SHA           name for the backup of a live build that has no
#                      .output/build-sha (built before this script)
#   PM2_APP            default platinauz
#   CHECK_URL          default http://127.0.0.1:3003
set -euo pipefail
cd "$(dirname "$0")/.."

APP=${PM2_APP:-platinauz}
OLD=.data/old-assets # default of OLD_ASSETS_DIR in modules/keep-old-assets.ts
NEXT=.output.next
KEEP_DAYS=${KEEP_ASSETS_DAYS:-30}
KEEP_BACKUPS=${KEEP_BACKUPS:-5}
BASE=${CHECK_URL:-http://127.0.0.1:3003}
LOCK=.data/deploy.lock
SWAPPED=
RELOADED=

say() { printf '\n== %s\n' "$*"; }
die() { printf 'deploy.sh: %s\n' "$*" >&2; exit 1; }

# Copy the own /_nuxt/ files of build dir $1 to $OLD. cp gives them a new
# mtime: the 30 days count from the moment a file stops being live.
retire() {
  local build=$1 assets=$1/public/_nuxt n=0 f
  [ -d "$assets" ] || return 0
  while IFS= read -r f; do
    [ -n "$f" ] && [ "$f" != builds/latest.json ] && [ -f "$assets/$f" ] || continue
    mkdir -p "$OLD/$(dirname "$f")"
    cp "$assets/$f" "$OLD/$f"
    n=$((n + 1))
  done < <(
    if [ -f "$build/build-assets.txt" ]; then
      cat "$build/build-assets.txt"
    else # built before modules/keep-old-assets.ts: every file is its own
      (cd "$assets" && find . -type f | sed 's|^\./||')
    fi
  )
  echo "$build: $n files copied to $OLD"
}

prune_old_assets() {
  [ -d "$OLD" ] || return 0
  local n
  n=$(find "$OLD" -type f -mtime +"$KEEP_DAYS" -print -delete | wc -l)
  find "$OLD" -mindepth 1 -type d -empty -delete
  echo "deleted $((n)) files not live for $KEEP_DAYS days; $(find "$OLD" -type f | wc -l | tr -d ' ') kept"
}

prune_backups() {
  [ "$KEEP_BACKUPS" = all ] && return 0
  local b
  { ls -1dt .output.bak-*/ 2>/dev/null || true; } | tail -n +"$((KEEP_BACKUPS + 1))" | while IFS= read -r b; do
    echo "removing old backup ${b%/}"
    rm -rf "${b%/}"
  done
}

# Move .output aside as a backup and $1 into its place.
swap_in() {
  local new=$1 sha bak
  if [ -d .output ]; then
    sha=$(cat .output/build-sha 2>/dev/null || echo "${LIVE_SHA:-unknown-$(date +%Y%m%d-%H%M)}")
    bak=.output.bak-$sha
    [ ! -e "$bak" ] || bak=$bak-$(date +%Y%m%d-%H%M%S)
    mv .output "$bak"
    touch "$bak" # backups are pruned by this mtime
    echo "live build -> $bak"
  fi
  mv "$new" .output
  SWAPPED=1
  echo "$new -> .output"
}

pm2_preflight() {
  [ "${SKIP_RELOAD:-}" = 1 ] && return 0
  command -v pm2 >/dev/null || die "pm2 not found (SKIP_RELOAD=1 for a local test)"
  local path
  path=$(pm2 jlist | node -e '
    let s = ""; process.stdin.on("data", (d) => (s += d)).on("end", () => {
      let app;
      try { app = JSON.parse(s).find((a) => a.name === process.argv[1]); } catch {}
      console.log(app ? app.pm2_env.pm_exec_path : "");
    });' "$APP")
  [ -n "$path" ] || die "no pm2 app named $APP in 'pm2 jlist'"
  case "$path" in
    "$(pwd)/.output/server/index.mjs" | "$(pwd -P)/.output/server/index.mjs") ;;
    *) die "pm2 app $APP runs $path, not this directory's .output" ;;
  esac
}

reload_and_check() {
  if [ "${SKIP_RELOAD:-}" = 1 ]; then
    say "SKIP_RELOAD=1: pm2 not reloaded"
    return 0
  fi
  local since
  since=$(date +%s)
  say "pm2 reload $APP"
  pm2 reload "$APP"
  RELOADED=1
  # Old processes would serve the old build from the new directory (their
  # asset list is compiled in), so check that every instance was restarted.
  pm2 jlist | node -e '
    let s = ""; process.stdin.on("data", (d) => (s += d)).on("end", () => {
      const [name, since] = process.argv.slice(1);
      let apps = [];
      try { apps = JSON.parse(s).filter((a) => a.name === name); } catch {}
      const fresh = apps.filter((a) => a.pm2_env.status === "online" && a.pm2_env.pm_uptime >= since * 1000);
      console.log(`  ${fresh.length} of ${apps.length} instances online and restarted`);
      process.exit(apps.length && fresh.length === apps.length ? 0 : 1);
    });' "$APP" "$since" \
    || die "pm2 did not restart every instance (pm2 ls). Roll back with: scripts/deploy.sh rollback"
  sleep 2
  check
}

expect() { # expect <status> <path>
  local got
  got=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$BASE$2" || true)
  printf '  %s %s (want %s)\n' "$got" "$2" "$1"
  [ "$got" = "$1" ]
}

check() {
  say "checks on $BASE"
  local own kept ok=1
  own=$(grep -m1 '\.js$' .output/build-assets.txt 2>/dev/null || true)
  kept=$(cd .output/public/_nuxt && find . -type f -name '*.js' | sed 's|^\./||' \
    | grep -vxF -f ../../build-assets.txt 2>/dev/null | head -n1 || true)
  [ -z "$own" ] || expect 200 "/_nuxt/$own" || ok=
  [ -z "$kept" ] || expect 200 "/_nuxt/$kept" || ok=
  expect 404 "/_nuxt/deploy-check-$$.js" || ok=
  [ -n "$ok" ] || die "checks failed. Roll back with: scripts/deploy.sh rollback"
  echo "  ok"
}

on_exit() {
  local status=$?
  rm -rf "$LOCK"
  [ "$status" = 0 ] && return
  if [ -z "$SWAPPED" ]; then
    echo "deploy.sh: stopped before the swap; the live build is unchanged" >&2
  elif [ -z "$RELOADED" ] && [ "${SKIP_RELOAD:-}" != 1 ]; then
    echo "deploy.sh: .output is the new build but pm2 was NOT reloaded:" \
      "run 'pm2 reload $APP' or 'scripts/deploy.sh rollback'" >&2
  fi
}

cmd=${1:-deploy}
case "$cmd" in
  check)
    check
    exit
    ;;
  deploy | rollback) ;;
  *) die "usage: scripts/deploy.sh [deploy | rollback [.output.bak-<sha>] | check]" ;;
esac

mkdir -p .data
mkdir "$LOCK" 2>/dev/null || die "another deploy is running (or remove a stale $LOCK)"
trap on_exit EXIT
pm2_preflight

if [ "$cmd" = rollback ]; then
  target=${2:-$(ls -1dt .output.bak-*/ 2>/dev/null | head -n1 || true)}
  target=${target%/}
  [ -n "$target" ] && [ -f "$target/server/index.mjs" ] || die "no backup build to roll back to"
  say "keep the current build's assets"
  retire .output
  say "roll back to $target"
  swap_in "$target"
  reload_and_check
  exit
fi

say "keep the live build's assets for $KEEP_DAYS days"
if [ ! -d "$OLD" ]; then
  # First run: the builds kept for rollback were live recently too.
  for b in .output.bak-*/; do [ -d "$b" ] && retire "${b%/}"; done
fi
retire .output
prune_old_assets

say "build into $NEXT"
sha=$(git rev-parse --short HEAD)
git diff --quiet HEAD -- || sha=$sha-dirty
rm -rf "$NEXT"
[ "${SKIP_NPM_CI:-}" = 1 ] || npm ci
NITRO_OUTPUT_DIR=$NEXT npm run build
[ -f "$NEXT/server/index.mjs" ] && [ -s "$NEXT/build-assets.txt" ] \
  || die "$NEXT is incomplete (is modules/keep-old-assets.ts there?)"
echo "$sha" > "$NEXT/build-sha"

say "swap"
swap_in "$NEXT"
reload_and_check
prune_backups || echo "deploy.sh: could not remove old backups (deploy is done)" >&2
say "deployed $sha"
