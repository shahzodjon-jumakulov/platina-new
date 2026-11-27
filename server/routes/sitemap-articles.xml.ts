/**
 * One chunk of the article archive: ARTICLES_PER_CHUNK articles, oldest first,
 * each emitted once per script variant.
 *
 * The chunk number is a query parameter rather than a path segment because
 * Nitro does not match route params that sit mid-segment
 * (`sitemap-articles-[n].xml`). Google accepts sitemap URLs with query strings.
 *
 * Fetching and caching live in server/utils/archive.ts; this handler only
 * picks the right cache (frozen vs. live chunk) and renders XML.
 */
export default defineEventHandler(async (event) => {
  const raw = String(getQuery(event).p ?? "0");
  const n = Number(raw);

  if (!/^\d{1,4}$/.test(raw) || !Number.isInteger(n)) {
    throw createError({ statusCode: 404, statusMessage: "Not Found" });
  }

  let meta: ArchiveMeta;
  try {
    meta = await getArchiveMeta();
  } catch {
    return sendUnavailable(event);
  }

  const chunks = chunkCount(meta.count);
  if (n >= chunks) {
    throw createError({ statusCode: 404, statusMessage: "Not Found" });
  }

  let chunk: ChunkData;
  try {
    // Oldest-first: every chunk but the last is byte-stable as the newsroom
    // publishes, so it is cached for a day (the last one ≤ 10 min). Only
    // complete chunks exist in the cache; without one this is a 503.
    chunk = await getChunk(n, meta);
  } catch {
    return sendUnavailable(event);
  }

  return sendXml(
    event,
    urlsetDocument(chunk.rows.map(urlEntries).join("")),
    isLiveChunk(n, meta) ? 600 : 3600
  );
});
