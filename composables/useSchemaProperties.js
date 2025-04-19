export default () => {
  const { locale } = useI18n();

  const schemaLanguage = computed(() => {
    const map = {
      "o'z": "uz-Latn",
      uz: "uz-Cyrl",
    };

    return map[locale.value] || "uz-Latn";
  });

  const schemaPublisher = {
    "@type": "Organization",
    name: "Platina.uz",
    logo: {
      "@type": "ImageObject",
      url: "https://platina.uz/favicon.svg",
    },
  };

  const generateNewsArticle = (article) => {
    return {
      "@type": "NewsArticle",
      "@id": useNewsUrl(article.publish, article.slug, locale.value),
      headline: article.title,
      datePublished: article.publish,
      publisher: schemaPublisher,
      image: article.image_large,
      description: htmlToText(article.short_content),
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": useNewsUrl(article.publish, article.slug, locale.value),
      },
      inLanguage: schemaLanguage.value,
      keywords: article.tags.join(", "),
      genre: article.category.name,
      isAccessibleForFree: true,
    };
  };

  const generateItemList = (newsItems, name) => {
    return {
      "@type": "ItemList",
      name: name,
      numberOfItems: 7,
      itemListElement: newsItems.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: generateNewsArticle(article, index),
      })),
    };
  };

  return {
    schemaLanguage,
    schemaPublisher,
    generateNewsArticle,
    generateItemList,
  };
};
