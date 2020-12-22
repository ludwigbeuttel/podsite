import "@mdi/font/css/materialdesignicons.css"

export default {
  customVariables: ["~/assets/variables.scss"],
  icons: {
    iconfont: ["mdiSvg", "mdi"],
  },
  theme: {
    dark: false,
    themes: {
      dark: {
        primary: "#2e7d32",
        secondary: "#0091ea",
      },
      light: {
        primary: "#2e7d32",
        secondary: "#0091ea",
      },
    },
  },
  defaultAssets: {
    font: { family: "Roboto" },
    icons: false,
  },
}