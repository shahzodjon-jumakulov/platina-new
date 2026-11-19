/**
 * Turns a failed CMS fetch into the right HTTP status for the page.
 *
 *   - The CMS said 404 (or answered without the expected object) → 404.
 *   - Anything else — CMS 5xx, timeout, connection refused → 503 with
 *     Retry-After.
 *
 * Until this existed every backend 500 or timeout during a crawl was served
 * as a 404, i.e. "this article was deleted", and in October 2026 the backend
 * returned ~43k 500s. A 503 tells crawlers to come back later and keeps the
 * URL indexed.
 *
 * @param {object|null|undefined} error  `error.value` from useFetch/useMyFetch
 */
export const throwApiError = (error) => {
  const status = error?.statusCode ?? error?.status;

  if (!error || status === 404) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page not found",
      fatal: true,
    });
  }

  if (import.meta.server) {
    useRequestEvent()?.node.res.setHeader("Retry-After", "120");
  }
  throw createError({
    statusCode: 503,
    statusMessage: "Service Unavailable",
    fatal: true,
  });
};
