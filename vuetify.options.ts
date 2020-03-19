import colors from "vuetify/es5/util/colors"

export default {
  customVariables: ["~/assets/variables.scss"],
  theme: {
    dark: false,
    themes: {
      dark: {
        primary: "#0000a8",
        accent: "#ff005a",
        secondary: colors.amber.darken3,
        info: colors.teal.lighten1,
        warning: colors.amber.base,
        error: colors.deepOrange.accent4,
        success: colors.green.accent3,
      },
      light: {
        primary: "#0000a8",
        accent: "#ff005a",
        secondary: colors.amber.darken3,
        info: colors.teal.lighten1,
        warning: colors.amber.base,
        error: colors.deepOrange.accent4,
        success: colors.green.accent3,
      },
    },
  },
}