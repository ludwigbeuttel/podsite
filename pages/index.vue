<template>
  <div>
    <v-row justify="center">
      <v-col cols="12" xl="10">
        <v-card outlined>
          <v-card-text>
            <v-skeleton-loader
              :loading="$fetchState.pending"
              type="paragraph"
              transition="fade-transition"
            >
              <div
                class="text--primary body-1"
                style="white-space: pre-line"
                v-html="$accessor.feed.rss ? $accessor.feed.rss.description : ''"
              />
            </v-skeleton-loader>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="8" md="6" lg="4" class="mb-3">
        <v-text-field v-model="search" outlined label="Suche" prepend-inner-icon="mdi-magnify" clearable hide-details />
      </v-col>
    </v-row>
    <v-row justify="center">
      <template v-if="$fetchState.error">
        <div class="display-1">Fehler</div>
      </template>
      <template v-else-if="$fetchState.pending">
        <v-col cols="12" class="row py-0" style="justify-content: center">
          <v-row class="shrink" dense>
            <v-col v-for="n in 7" :key="'L1'+n" class="shrink">
              <v-skeleton-loader type="avatar" tile style="border-radius:3px; transform:scale(.7)" />
            </v-col>
          </v-row>
        </v-col>
        <v-row justify="center">
        <episode-skeleton v-for="n in visible" :key="'L2'+n" class="ma-6" />
        </v-row>
      </template>
      <template v-else>
        <template v-if="pages > 0">
          <v-col cols="12">
            <v-pagination ref="topPagination" v-model="page" total-visible="15" :length="pages" />
          </v-col>
        </template>
        <template v-if="displayItems.length > 0">
          <v-col cols="12" class="pa-0">
            <transition-group name="list-items" tag="div" class="row justify-center mx-0">
              <episode
                v-for="episode in displayItems"
                :key="episode.guid['_']"
                :value="episode"
                :show-image="showImages"
                class="ma-6"
              />
            </transition-group>
          </v-col>
        </template>
        <template v-else>
          <div class="display-1">keine Episoden gefunden</div>
        </template>
        <template v-if="pages > 0">
          <v-col cols="12">
            <v-pagination
              v-model="page"
              total-visible="15"
              :length="pages"
              @input="$vuetify.goTo($refs.topPagination, {offset:68})"
            />
          </v-col>
        </template>
      </template>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component } from "nuxt-property-decorator"

import { EpisodeData } from "@/types"
import Episode from "@/classes/episode"
import PageMixin from "@/mixin"

// @ts-ignore
@Component({ fetchOnServer: false })
export default class Index extends PageMixin {
  page = 1;
  visible = 8;

  min = 0;
  max = 8;
  search = ""

  get searchItems(): EpisodeData[] {
    let items = (this.$accessor.feed.rss || { item: [] }).item
    if (this.search) {
      items = items.filter(episode =>
        episode.title.toLocaleLowerCase().includes(this.search.toLocaleLowerCase()) ||
        (episode.description || "").toLocaleLowerCase().includes(this.search.toLocaleLowerCase()) ||
        (episode["itunes:summary"] || "").toLocaleLowerCase().includes(this.search.toLocaleLowerCase()),
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

    return this.searchItems.slice(this.min, this.max).map(episodeData => new Episode(episodeData))
  }

  get showImages() {
    return true
    // return [...new Set(this.displayItems.map((item: Episode) => item.image))].length > 1
  }

  get pages() {
    return parseInt((this.searchItems.length / this.visible).toFixed(0))
  }

  mounted() {
    const urlArray = document.location.href.split("/")
    if (urlArray[3]) {
      this.search = urlArray[urlArray.length - 1]
    }
  }

  async fetch() {
    if (!this.$accessor.feed.rss) {
      await this.initFeed()
    }
  }
}
</script>