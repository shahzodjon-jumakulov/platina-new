<script setup>
const route = useRoute();
const localePath = useLocalePath();
const { locale, t } = useI18n();
const { slug } = route.params;
const selectedNews = useSelectedNews();

const { data, error } = await useMyFetch(
  `/news/${encodeURIComponent(slug)}/`,
  {
    default: () => selectedNews.value || {},
    key: `news-${locale.value}-${slug}`,
  }
);

// 404 only when the CMS said "no such article"; an outage is a 503 (see
// composables/throwApiError.js). Old numeric WordPress URLs are redirected
// before this page runs (server/middleware/legacy-urls.ts).
if (error.value || !data.value?.id) {
  throwApiError(error.value);
}

// One URL per article: /YYYY/MM/DD/slug with the date taken from the article
// itself and zero-padded. Older sites linked /2023/3/13/slug, and any date
// prefix used to render the article with a self-referencing canonical, so
// Google indexed duplicates and picked the unpadded ones as canonical.
// Anything that differs (unpadded or wrong date, trailing slash, encoding)
// gets a real HTTP 301 from SSR. The query string is kept (utm_* etc.).
const canonicalPath = useNewsUrl(data.value.publish, data.value.slug);
const canonicalLocalPath = localePath(canonicalPath);
const normalise = (path) => {
  try {
    return decodeURI(path);
  } catch {
    return path;
  }
};
const redirecting = normalise(route.path) !== normalise(canonicalLocalPath);
if (redirecting) {
  await navigateTo(
    { path: canonicalLocalPath, query: route.query },
    { redirectCode: 301, replace: true }
  );
}

// The article photo is the LCP element on phones (SectionDetail renders it
// with fetchpriority="high"). The <img> sits after ~120 KB of inline CSS and
// the header markup; preloading it from the top of <head> (tagPriority 21:
// right after the cp.platina.uz preconnect, before the inline styles) starts
// the download with the first packet. Video articles show the YouTube
// placeholder instead, so there is nothing to preload.
if (!redirecting && data.value.image_large && !data.value.youtube_link) {
  useHead({
    link: [
      {
        rel: "preload",
        as: "image",
        href: data.value.image_large,
        fetchpriority: "high",
        tagPriority: 21,
      },
    ],
  });
}

// The CMS is adding `image_original` (full resolution) to the detail
// response; until it ships, image_large (820×546) is the best there is.
const shareImage = data.value.image_original || data.value.image_large;

useSeoMeta({
  title: data.value.title || t("meta.title"),
  description: htmlToText(data.value.short_content) || t("meta.desc"),
  ogTitle: data.value.title || t("meta.title"),
  ogDescription: htmlToText(data.value.short_content) || t("meta.desc"),
  twitterTitle: data.value.title || t("meta.title"),
  twitterDescription: htmlToText(data.value.short_content) || t("meta.desc"),
  author: "Platina.uz",
  ogType: "article",
  // From the article data, never the raw request path.
  ogUrl: "https://platina.uz" + encodeURI(canonicalLocalPath),
  // The CMS sends naive Tashkent time; without the offset the value is
  // ambiguous (and read as UTC by most consumers — 5 hours off).
  articlePublishedTime: toTashkentIso(data.value.publish),
  articleModifiedTime: toTashkentIso(data.value.modified || data.value.updated),
  articleTag: (data.value.tags || []).join(", "),
  articleSection: data.value.category?.name,
  creator: "Platina.uz",
  twitterCard: "summary_large_image",
  ogImage: shareImage,
  twitterImage: shareImage,
});

// Canonical + hreflang from the article's own canonical path. app.vue emits a
// route-based set for every page; these replace it (unhead de-duplicates
// rel=canonical and rel=alternate+hreflang, the page's entries win), so the
// canonical is right even if the redirect above were ever skipped.
const { relAlternate } = useRelAlternate(canonicalPath);
useHead({ link: relAlternate });

const { generateNewsArticle, generateBreadcrumbList } = useSchemaProperties();
const breadcrumbList = generateBreadcrumbList(data.value.category, data.value);
const schemaNodes = generateNewsArticle(data.value);
useSchemaOrg([schemaNodes, breadcrumbList]);

// Rendered on the server: this is the only thing linking one article to
// another, and with `server: false` an article page shipped zero outbound
// article links, making every story a crawl dead end.
// (Skipped when this request is only a redirect.)
const { data: similarData } = redirecting
  ? { data: ref({ similar: [] }) }
  : await useMyFetch(`/news/similar/${data.value.id}`, {
      params: { limit: 4 },
      key: `similar-${locale.value}-${data.value.id}`,
      default: () => ({ similar: [] }),
    });
const similar = computed(() => (similarData.value?.similar || []).slice(0, 4));
</script>

<template>
  <UContainer class="flex flex-col gap-4 md:gap-8 max-sm:pb-5 sm:py-8">
    <div class="flex flex-col items-center gap-5 self-center">
      <SectionDetail :data="data" />

      <SectionDetailSimilar :news="similar" />
    </div>
    <GroupBusiness />
  </UContainer>
</template>
