<template>
  <v-fade-transition>
    <div v-if="loading">
      <v-skeleton-loader class="my-4" tile type="list-item-avatar" />
      <v-skeleton-loader class="mt-4" type="list-item-three-line" />
      <v-skeleton-loader class="mt-n5" type="list-item-three-line" />
      <v-skeleton-loader type="list-item-two-line, list-item-two-line" />
    </div>
    <div v-else>
      <v-card-title
        class="headline font-weight-medium"
        style="text-align: left; word-break: break-word;"
      >
        <v-row class="mx-0" style="flex-wrap: nowrap">
          <slot name="top" />
          <v-avatar v-if="value.image && showImage" class="mr-4" tile>
            <v-img :src="value.image" />
          </v-avatar>
          <div style="align-self: center">{{ value.title }}</div>
        </v-row>
      </v-card-title>

      <v-list-item class="mt-1 text-left" style="min-height: unset">
        <v-list-item-content>
          <v-list-item-subtitle>Shownotes</v-list-item-subtitle>
          <v-list-item-title class="content" style="white-space: normal; max-height: calc(100vh - 330px); overflow-y: auto;" v-html="value.content" />
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="text-left">
        <v-list-item-content>
          <v-list-item-subtitle>Veröffentlichungsdatum</v-list-item-subtitle>
          <v-list-item-title>{{ value.date.toLocaleString() }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="text-left pb-1" two-line>
        <v-list-item-content>
          <v-list-item-subtitle>Dauer</v-list-item-subtitle>
          <v-list-item-title>{{ value.duration }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <slot />
    </div>
  </v-fade-transition>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "nuxt-property-decorator"

import Episode from "@/classes/episode"

@Component
export default class EpisodeDetails extends Vue {
  @Prop() value!: Episode
  @Prop({ default: true }) showImage!: boolean
  @Prop({ default: false }) loading!: boolean
}
</script>

<style lang="scss">
.content {
  p {
    margin-bottom: unset !important;
  }
}
</style>