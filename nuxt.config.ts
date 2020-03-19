// @ts-nocheck

import { Configuration } from "@nuxt/types"
import { description, name } from "./podcastData"

const nuxtConfig: Configuration = {
  mode: "universal",
  head: {
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
  render: {
    // compressor: isProduction ? shrinkRay() : { threshold: 0 },
    http2: {
      pushAssets: (_req, _res, publicPath, preloadFiles) => preloadFiles
        .filter(f => f.asType === "script" && f.file === "runtime.js")
        .map(f => `<${publicPath}${f.file}>; rel=preload; as=${f.asType}`),
    },
  },
  modern: true,
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: [
    "~/assets/global.scss",
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: "~/plugins/themeSwitch.ts", mode: "client" },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    "@nuxt/typescript-build",
    "@nuxtjs/vuetify",
    "@nuxtjs/eslint-module",
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    "@nuxtjs/proxy",
    "@nuxtjs/axios",
    "@nuxtjs/dotenv",
    "nuxt-compress",
    "@nuxtjs/component-cache",
  ],
  "nuxt-compress": {
    gzip: {
      cache: true,
    },
    brotli: {
      threshold: 10240,
    },
  },
  axios: {
    proxy: true,

  },
  vuetify: {
    optionsPath: "~/vuetify.options.ts",
  },
  serverMiddleware: [
    {
      path: "/api/externalFeed",
      handler: "~/api/externalFeed.ts",
    },
  ],
  /*
   ** Build configuration
   */
  build: {
    optimizeCSS: true,
    // extractCSS: true,
    extend(config: any, ctx: any) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? "source-map" : "inline-source-map"
      }
    },
  },
}

export default nuxtConfig