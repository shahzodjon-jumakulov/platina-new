export default function extractYouTubeId(url, onlyId = false) {
  if (!url) return null;

  // Normalize
  const cleanUrl = decodeURIComponent(url.trim());

  // Ensure it's actually a YouTube link before fallbacks
  const isYouTube = /(youtu\.be|youtube\.com)/.test(cleanUrl);

  // 1. Short youtu.be links
  let match = cleanUrl.match(/youtu\.be\/([^?&#]+)/);
  if (match) return format(match[1], onlyId);

  // 2. Watch URLs (?v=VIDEOID)
  match = cleanUrl.match(/[?&]v=([^?&#]+)/);
  if (match) return format(match[1], onlyId);

  // 3. /embed/, /v/, /shorts/, /live/, /e/
  match = cleanUrl.match(/\/(embed|v|e|shorts|live)\/([^?&#]+)/);
  if (match) return format(match[2], onlyId);

  // 4. Attribution links (u=/watch?v=ID)
  match = cleanUrl.match(/u=\/watch\?v=([^?&#]+)/);
  if (match) return format(match[1], onlyId);

  // 5. Fallback only if it's a youtube domain
  if (isYouTube) {
    match = cleanUrl.match(/([A-Za-z0-9_-]{11})/);
    if (match) return format(match[1], onlyId);
  }

  return null;
}

function format(id, onlyId) {
  return onlyId
    ? id
    : `https://youtube.com/embed/${id}?rel=0&modestbranding=1`;
}
