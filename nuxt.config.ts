// @ts-nocheck

import { Configuration } from "@nuxt/types"
import { description, name } from "./podcastDataDemo"

const nuxtConfig: Configuration = {
  ssr: true,
  target: "static",
  head: {
    htmlAttrs: {
      lang: "de",
    },
    lang: "de",
    title: name,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: description || "",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
  modern: true,
  components: true,
  loading: { color: "#fff" },
  css: [
    "~/assets/global.scss",
  ],
  plugins: [
    { src: "~/plugins/themeSwitch.ts", mode: "client" },
    // { src: "~/plugins/forceDevtools.ts", mode: "all" },
  ],
  buildModules: [
    "nuxt-typed-vuex",
    "@nuxt/typescript-build",
    "@nuxtjs/vuetify",
    "@nuxtjs/eslint-module",
  ],
  modules: [
    "nuxt-i18n",
    "@nuxtjs/axios",
    "@nuxtjs/dotenv",
  ],
  i18n: {
    locales: [
      { code: "en", file: "en.json" },
      { code: "de", file: "de.json" },
    ],
    detectBrowserLanguage: {
      alwaysRedirect: true,
      fallbackLocale: "en",
      useCookie: false
    },
    lazy: true,
    langDir: "locales/",
    defaultLocale: "en",
    strategy: "no_prefix",
    vueI18n: {
      fallbackLocale: 'en',
    },
  },
  ignore: ["**/*.template.*"],
  vuetify: {
    optionsPath: "~/vuetifyDemo.options.ts",
  },
  serverMiddleware: [
    {
      path: "/api/externalFeed",
      handler: "~/api/externalFeed.ts",
    },
  ],
  build: {
    transpile: [
      /typed-vuex/,
    ],
  },
}

export default nuxtConfig