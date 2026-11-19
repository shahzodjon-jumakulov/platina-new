<script setup>
definePageMeta({
  layout: false,
});

const config = useRuntimeConfig();
const route = useRoute();
const langs = { uz: "uz-cyril", "o'z": "uz" };
const cookieLang = useCookie("i18n_redirected").value;
const lang = langs[cookieLang] || "uz-cyril";

// This route is a root-level catch-all: every unmatched single-segment path
// lands here. Short links pasted with a stray trailing "\" or "/" (seen in
// Search Console as /867d63\) are cleaned up rather than rejected.
const short = String(route.params.short ?? "")
  .trim()
  .replace(/[\\/\s]+$/, "");

// Short slugs are hex ids or legacy WordPress post ids; anything else cannot
// be one, so it is a 404 without asking the CMS.
if (!/^[0-9A-Za-z_-]{1,32}$/.test(short)) {
  throwApiError(null);
}

const { data, error } = await useFetch(
  `${lang}/api/news/short_slug/${short}/`,
  {
    baseURL: config.public.baseURL,
    timeout: 10000,
    ...(import.meta.server && { retry: 0 }),
  }
);

// 404 only for "no such short link"; a CMS outage is a 503.
if (error.value || !data.value?.slug) {
  throwApiError(error.value);
}

// Permanent redirect to the article's absolute canonical URL. Crawlers and
// first-time visitors have no locale cookie and get the default (Cyrillic)
// URL with a cacheable 301. A reader who has picked a script gets their
// variant with a 302 — a 301 is cached by the browser forever and would pin
// them to whichever script they had on first click.
const path =
  (cookieLang === "o'z" ? "/o'z" : "") +
  useNewsUrl(data.value.publish, encodeURIComponent(data.value.slug));

if (import.meta.server) {
  useRequestEvent()?.node.res.setHeader("Vary", "Cookie");
  await navigateTo("https://platina.uz" + path, {
    redirectCode: cookieLang ? 302 : 301,
    external: true,
  });
} else {
  // In-app navigation (also keeps dev/staging on their own host).
  await navigateTo(path, { replace: true });
}
</script>

<template>
  <h1>Redirecting...</h1>
</template>
