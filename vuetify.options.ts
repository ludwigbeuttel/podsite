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
        primary: "#0000a8",
        secondary: "#ff005a",
      },
      light: {
        primary: "#0000a8",
        secondary: "#ff005a",
      },
    },
  },
  defaultAssets: {
    font: { family: "Roboto" },
    icons: false,
  },
}