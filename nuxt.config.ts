// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@nuxtjs/i18n",
    "nuxt-schema-org",
    "@vueuse/nuxt",
    "@nuxt/scripts",
    "nuxt-gtag",
  ],

  gtag: {
    id: "G-07JCNRX4ZR",
  },
  
  css: ["~/assets/css/main.scss"],

  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL || "https://cp.platina.uz",
    },
  },

  experimental: {
    viewTransition: true,
  },

  schemaOrg: {
    defaults: false,
  },

  app: {
    head: {
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "manifest", href: "/manifest.webmanifest" },
      ],
    },
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
      alwaysRedirect: true,
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
