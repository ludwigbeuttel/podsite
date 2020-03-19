import { Vue, Component, Watch } from "nuxt-property-decorator"
import Vibrant from "node-vibrant"
import { Palette } from "node-vibrant/lib/color"

import nuxtConfig from "@/nuxt.config"
import player from "@/components/player.vue"
import fab from "@/components/fab.vue"
import altDialog from "@/components/altDialog.vue"
import { services, socialMedia } from "@/podcastData"
import { Platform, Social } from "@/types"

@Component({
  components: { player, fab, altDialog },
})
export default class DefaultLayout extends Vue {
  created() {
    this.$accessor.feed.initFeed()
    this.onImageChange()
  }

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
    const palette = await Vibrant.from(`${nuxtConfig.router!.base!}/favicon.png`).getSwatches()

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

  socialMedia: Social[] = socialMedia

  services: Platform[] = services

  rssFeedLocation = process.env.FEEDLOCATION!
}
