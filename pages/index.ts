import { Component, Vue } from "nuxt-property-decorator"

import { EpisodeData } from "@/types"
import episode from "@/components/episode.vue"
import episodeEdit from "@/components/episodeEdit.vue"
import episodeSkeleton from "@/components/episodeSkeleton.vue"
import fab from "@/components/fab.vue"
import altDialog from "@/components/altDialog.vue"
import Episode from "~/classes/episode"

@Component(
  {
    components: { episode, episodeSkeleton, episodeEdit, fab, altDialog },
  },
)
export default class Index extends Vue {
  page = 1;
  visible = 8;

  min = 0;
  max = 8;
  search = ""

  editFeed = process.env.EDIT === "true"

  get searchItems() {
    let items = (this.rss.item || []) as EpisodeData[]
    if (this.search) {
      items = items.filter(episode =>
        episode.title.includes(this.search) ||
        (episode.description || "").includes(this.search) ||
        (episode["itunes:summary"] || "").includes(this.search),
      )
    }
    return items
  }

  get displayItems() {
    const page = this.page - 1

    this.min = (page * this.visible)
    this.max = (page * this.visible) + this.visible

    if (this.min !== 0) {
      this.min--
      this.max--
    }

    return this.searchItems.slice(this.min, this.max).map((episodeData: EpisodeData) => new Episode(episodeData))
  }

  get showImages() {
    return [...new Set(this.displayItems.map((item: Episode) => item.image))].length > 1
  }

  get pages() {
    return parseInt((this.searchItems.length / this.visible).toFixed(0))
  }

  get rss() {
    return this.$accessor.feed.rss || false
  }

  mounted() {
    const urlArray = document.location.href.split("/")
    if (urlArray[3]) {
      this.search = urlArray[urlArray.length - 1]
    }
    this.$accessor.feed.initFeed()
  }
}