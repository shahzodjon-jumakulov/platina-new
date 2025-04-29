export default () => {
  const { locale, t } = useI18n();

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

  const websiteSchema = computed(() => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Platina.uz",
    url: "https://platina.uz",
    inLanguage: schemaLanguage.value,
    publisher: {
      "@type": "Organization",
      name: "Platina.uz",
      logo: {
        "@type": "ImageObject",
        url: "https://platina.uz/favicon.svg",
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://platina.uz/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  }));

  const webpageSchema = computed(() => ({
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: "https://platina.uz",
    name: t("meta.title"),
    description: t("meta.desc"),
    inLanguage: schemaLanguage.value,
    isPartOf: {
      "@type": "WebSite",
      url: "https://platina.uz",
    },
  }));

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

  const generateBreadcrumbList = (category, article) => {
    const localePath = useLocalePath();
    const breadcrumbs = [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@id": "https://platina.uz" + localePath("/"),
          name: t("main_page"),
        },
      },
    ];

    if (category) {
      breadcrumbs.push({
        "@type": "ListItem",
        position: 2,
        item: {
          "@id":
            "https://platina.uz" + localePath("/category/" + category.slug),
          name: category.name,
        },
      });
    }

    if (article) {
      breadcrumbs.push({
        "@type": "ListItem",
        position: 3,
        item: {
          "@id":
            "https://platina.uz" +
            localePath(useNewsUrl(article.publish, article.slug)),
          name: article.title,
        },
      });
    }

    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs,
    };
  };

  return {
    schemaLanguage,
    schemaPublisher,
    websiteSchema,
    webpageSchema,
    generateNewsArticle,
    generateItemList,
    generateBreadcrumbList,
  };
};
