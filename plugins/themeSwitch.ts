import { Framework as VuetifyFramework } from "vuetify"

import vuetifyConfig from "@/vuetify.options"

export default ({ $vuetify }: { $vuetify: VuetifyFramework }) => {
  setTheme(window.matchMedia("(prefers-color-scheme: dark)"))
  window.matchMedia("(prefers-color-scheme: dark)").addListener(setTheme)

  function setTheme(dark: MediaQueryListEvent | MediaQueryList) {
    $vuetify.theme.dark = dark.matches
    const lightHeaderColor = vuetifyConfig.theme.themes.light.primary
    const darkHeaderColor = vuetifyConfig.theme.themes.dark.primary
    document.body.style.background = dark.matches
      ? `linear-gradient(180deg, ${darkHeaderColor || lightHeaderColor || "#121212"} 0%, ${darkHeaderColor || lightHeaderColor || "#121212"} 50%, #121212 50%, #121212 100%)`
      : `linear-gradient(180deg, ${lightHeaderColor || darkHeaderColor || "#ffffff"} 0%, ${lightHeaderColor || darkHeaderColor || "#ffffff"} 50%, #ffffff 50%, #ffffff 100%)`
  }
}