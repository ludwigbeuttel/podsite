import { Component, Vue } from "nuxt-property-decorator"

import { EpisodeData } from "@/types"
import State from "@/classes/state"
import episode from "@/components/episode.vue"
import episodeEdit from "@/components/episodeEdit.vue"
import episodeSkeleton from "@/components/episodeSkeleton.vue"
import fab from "@/components/fab.vue"
import altDialog from "@/components/altDialog.vue"

@Component({ components: { episode, episodeSkeleton, episodeEdit, fab, altDialog } })
export default class Index extends Vue {
  page = 1;
  visible = 8;

  min = 0;
  max = 8;
  state = new State();

  editFeed = process.env.EDIT === "true"

  get displayItems() {
    const page = this.page - 1

    this.min = page + (page * this.visible)
    this.max = page + (page * this.visible) + this.visible

    if (this.min !== 0) {
      this.min--
      this.max--
    }

    return this.rss.item.slice(this.min, this.max)
  }

  get showImages() {
    return [...new Set(this.displayItems.map((item: EpisodeData) => item["itunes:image"]!.$.href))].length > 1
  }

  get pages() {
    return parseInt((this.rss.item.length / this.visible).toFixed(0))
  }

  get rss() {
    return this.$accessor.feed.rss || false
  }

  created() {
    this.state.loading()
  }

  mounted() {
    this.$accessor.feed.initFeed()
      .then(() => this.state.success())
      .catch(() => this.state.error())
  }
}