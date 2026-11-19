/**
 * The canonical path of an article: /YYYY/MM/DD/slug, month and day always
 * zero-padded.
 *
 * `publish` is a naive Tashkent wall-clock timestamp ("2023-03-13T09:05:00").
 * The date is sliced out of the string rather than read through `new Date()`,
 * which would depend on the timezone of whatever runs it (UTC server vs. the
 * reader's browser) and could move an article published near midnight to the
 * neighbouring day. server/utils/feed.ts (sitemaps) does the same.
 *
 * Old sites linked unpadded dates (/2023/3/13/slug); the article page answers
 * those with a 301 to this form.
 */
export const useNewsUrl = (publish, slug, locale) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(publish ?? "").trim());
  if (!match) {
    throw new Error("Invalid publish date");
  }

  if (typeof slug !== "string" || slug.trim() === "") {
    throw new Error("Invalid slug");
  }

  const [, year, month, day] = match;
  const path = `/${year}/${month}/${day}/${slug}`;

  if (!locale) return path;

  const lang = locale === "uz" ? "" : `/${locale}`;
  const host = "https://platina.uz" + lang;

  return host + path;
};
