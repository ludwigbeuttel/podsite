// @ts-nocheck

import { Configuration } from "@nuxt/types"
import { description, name } from "./podcastData"

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
    "@nuxtjs/axios",
    "@nuxtjs/dotenv",
  ],
  ignore: ["**/*.template.*"],
  vuetify: {
    optionsPath: "~/vuetify.options.ts",
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