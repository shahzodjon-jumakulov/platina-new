export const useNewsUrl = (publish, slug, locale) => {
  // Check if publish is a valid date
  if (!publish || isNaN(Date.parse(publish))) {
    throw new Error("Invalid publish date");
  }

  // Check if slug is a valid string
  if (typeof slug !== "string" || slug.trim() === "") {
    throw new Error("Invalid slug");
  }

  // Format the publish date and slug
  const date = new Date(publish);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const path = `/${year}/${month}/${day}/${slug}`;

  if (!locale) return path;

  const lang = locale === "uz" ? "" : `/${locale}`;
  const host = "https://platina.uz" + lang;

  return host + path;
};
