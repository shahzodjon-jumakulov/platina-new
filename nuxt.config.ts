// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxtjs/i18n",
    "nuxt-schema-org",
    "@vueuse/nuxt",
  ],
  css: ["~/assets/css/main.scss"],

  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL || "https://cp.platina.uz",
    },
  },

  experimental: {
    viewTransition: true,
  },

  i18n: {
    vueI18n: "~/i18n.config.ts",
    locales: ["uz", "o'z"],
    defaultLocale: "uz",
    strategy: "prefix_and_default",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      fallbackLocale: "uz",
      alwaysRedirect: true, // redirects to locale version
      redirectOn: "root",
    },
    bundle: {
      optimizeTranslationDirective: false,
    },
    lazy: true,

  },
  
  colorMode: {
    classSuffix: "",
    preference: "system",
    fallback: "light",
  },

  icon: {
    customCollections: [
      {
        prefix: "i",
        dir: "./assets/icons/collection",
      },
    ],
  },
});
