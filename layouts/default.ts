import { Vue, Component, Watch } from "nuxt-property-decorator"
import Vibrant from "node-vibrant"
import { Palette } from "node-vibrant/lib/color"

import { services, socialMedia } from "@/podcastData"
import { Platform, Social } from "@/types"

@Component
export default class DefaultLayout extends Vue {
  get headerImage() {
    if (this.$accessor.feed.rss) {
      if (this.$accessor.feed.rss.image) {
        return this.$accessor.feed.rss.image.url
      }
      if (this.$accessor.feed.rss["itunes:image"]) {
        // eslint-disable-next-line dot-notation
        return this.$accessor.feed.rss["itunes:image"]["$"].href
      } else {
        return ""
      }
    } else {
      return ""
    }
  }

  palette: null | Palette = null;

  @Watch("headerImage") async onImageChange() {
    if (process.env.NODE_ENV !== "development") {
      const palette = await Vibrant.from(this.headerImage).getSwatches()

      this.palette = palette

      if (palette.DarkVibrant) {
        this.$vuetify.theme.themes.light.primary = palette.DarkVibrant.hex
        this.$vuetify.theme.themes.dark.primary = palette.DarkVibrant.hex
      }

      if (palette.Vibrant) {
        this.$vuetify.theme.themes.light.secondary = palette.Vibrant.hex
        this.$vuetify.theme.themes.dark.secondary = palette.Vibrant.hex
      }
    }
  }

  socialMedia: Social[] = socialMedia

  services: Platform[] = services

  rssFeedLocation = process.env.FEEDLOCATION!
}
