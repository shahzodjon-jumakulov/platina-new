/**
 * Keep serving the /_nuxt/* files of earlier builds.
 *
 * Every build gets new hashed file names, and `nuxt build` replaces .output,
 * so each deploy used to delete the previous build's JS/CSS/images while
 * Googlebot (which renders pages it fetched days ago) and open browser tabs
 * still asked for them: hundreds of 404s a day in Search Console.
 *
 * scripts/deploy.sh copies the outgoing build's /_nuxt files into
 * .data/old-assets/ and deletes them there 30 days after they were last live.
 * This module copies that directory into the new build's public/_nuxt/.
 *
 * It has to happen DURING the build: Nitro serves public files from a
 * manifest that it generates while bundling the server, so a file copied into
 * .output/public afterwards is not served (/_nuxt/* answers 404). The
 * `nitro:build:public-assets` hook runs after Nitro has copied this build's
 * assets and before it generates that manifest. Files of this build always
 * win on a name clash.
 *
 * Build-time environment (both optional):
 *   OLD_ASSETS_DIR    files to add, default ./.data/old-assets
 *   NITRO_OUTPUT_DIR  build output, default ./.output. scripts/deploy.sh
 *                     builds into ./.output.next so the live build stays
 *                     intact until the new one is complete.
 *
 * It also writes <output>/build-assets.txt, the list of this build's own
 * /_nuxt files, so the next deploy knows which files were live (and restarts
 * their 30 days) and which were only carried over.
 *
 * Nuxt registers modules/*.ts automatically; it is not listed in nuxt.config.
 */
import { existsSync } from "node:fs";
import { cp, mkdir, readdir, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { defineNuxtModule, useLogger } from "@nuxt/kit";

/** Never carried over: it tells open tabs which build is current. */
const NEVER_KEEP = new Set(["builds/latest.json"]);

async function listFiles(dir: string): Promise<string[]> {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  return entries
    .filter((e) => e.isFile())
    .map((e) => relative(dir, join(e.parentPath, e.name)).split("\\").join("/"))
    .sort();
}

export default defineNuxtModule({
  meta: { name: "keep-old-assets" },
  setup(_options, nuxt) {
    if (nuxt.options.dev) return;
    const logger = useLogger("keep-old-assets");

    if (process.env.NITRO_OUTPUT_DIR) {
      nuxt.options.nitro.output = {
        ...nuxt.options.nitro.output,
        dir: resolve(nuxt.options.rootDir, process.env.NITRO_OUTPUT_DIR),
      };
    }

    const oldDir = resolve(
      nuxt.options.rootDir,
      process.env.OLD_ASSETS_DIR || ".data/old-assets"
    );

    nuxt.hook("nitro:build:public-assets", async (nitro) => {
      const assetsDir = join(
        nitro.options.output.publicDir,
        nuxt.options.app.buildAssetsDir
      );

      const own = await listFiles(assetsDir);
      await writeFile(
        join(nitro.options.output.dir, "build-assets.txt"),
        own.map((f) => f + "\n").join("")
      );

      let added = 0;
      for (const file of await listFiles(oldDir)) {
        if (NEVER_KEEP.has(file)) continue;
        const dst = join(assetsDir, file);
        if (existsSync(dst)) continue; // this build's file wins
        await mkdir(dirname(dst), { recursive: true });
        await cp(join(oldDir, file), dst, { preserveTimestamps: true });
        added++;
      }
      logger.info(
        `${own.length} files of this build, ${added} kept from earlier builds (${relative(nuxt.options.rootDir, oldDir)})`
      );
    });
  },
});
