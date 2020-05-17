<template>
  <v-hover v-slot:default="{ hover }">
    <v-card width="400" style="height:fit-content" outlined @click="detailsOpen = true">
      <template v-if="value.image && showImage">
        <v-img width="400" :aspect-ratio="1" :src="value.image" style="z-index:2">
          <v-col
            class="imageTransforms primary fill-height"
            :class="hover ? 'transparent' : 'funky'"
          />
          <v-card-title
            v-resize="setTitleHeight"
            class="imageTransforms topTitle"
            style="position: absolute; bottom: 0; max-width: inherit; word-break: break-word;"
            :class="hover ? 'active' : 'inactive titlePadding'"
            :style="hover ? `transform: translateY(${titleHeight}px);` : ''"
          >
            <span
              class="imageTransforms secondary white--text headline font-weight-medium"
            >{{ value.title }}</span>
          </v-card-title>
        </v-img>

        <v-card-title
          ref="title"
          class="imageTransforms bottomTitle"
          style="word-break: break-word;"
          :class="hover ? 'active' : 'inactive titlePadding'"
          :style="hover ? '' : `margin-top: -${titleHeight}px`"
        >
          <span class="headline imageTransforms font-weight-medium">{{ value.title }}</span>
        </v-card-title>
      </template>
      <template v-else>
        <v-card-title
          class="headline font-weight-medium"
          style="text-align: left; word-break: break-word;"
        >{{ value.title }}</v-card-title>
      </template>

      <v-list-item
        class="imageTransforms"
        two-line
        :class="value.image && showImage ? hover ? 'mt-n3' : 'mt-1' : ''"
      >
        <v-list-item-content>
          <v-list-item-subtitle>Beschreibung</v-list-item-subtitle>
          <v-list-item-title style="white-space: pre-line;" v-html="value.description" />
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="text-left" two-line>
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

      <v-card-actions
        class="imageTransforms"
        :style="value.image && showImage ? hover ? '' : `margin-top: ${titleHeight - 16}px` : ''"
      >
        <v-btn
          outlined
          color="secondary"
          @click.stop="$accessor.activeEpisode.changeEpisode(value)"
        >
          <v-icon>mdi-play</v-icon>&nbsp;abspielen
        </v-btn>
        <v-spacer />
        <slot />
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              color="secondary"
              :href="value.enclosureData.url"
              download
              aria-label="Episode herunterladen"
              icon
              @click.stop
              v-on="on"
            >
              <v-icon>mdi-download</v-icon>
            </v-btn>
          </template>
          <template>herunterladen</template>
        </v-tooltip>
      </v-card-actions>

      <altDialog v-model="detailsOpen" no-fullscreen scrollable max-width="800">
        <template v-slot:default="{ close }">
          <v-card width="800" outlined>
            <v-card-text class="pa-0 text--primary">
              <episodeDetails v-model="value" :show-image="showImage" />
            </v-card-text>

            <v-card-actions>
              <v-btn color="secondary" text nuxt :to="`/episode?guid=${value.guid._}`">
                <v-icon>mdi-open-in-new</v-icon>&nbsp;Episode öffnen
              </v-btn>
              <v-spacer />
              <v-btn outlined color="secondary" @click="close">schließen</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </altDialog>
    </v-card>
  </v-hover>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "nuxt-property-decorator"

import Episode from "@/classes/episode"
import altDialog from "@/components/altDialog.vue"
import episodeDetails from "@/components/episodeDetails.vue"

@Component({ components: { altDialog, episodeDetails } })
export default class Ep extends Vue {
  @Prop() value!: Episode
  @Prop({ default: true }) showImage!: boolean
  titleHeight = 64
  detailsOpen = false

  mounted() {
    this.setTitleHeight()
  }

  setTitleHeight() {
    // @ts-ignore
    this.titleHeight = this.$refs.title ? this.$refs.title.offsetHeight : 64
  }
}
</script>

<style lang="scss">
.funky {
  opacity: 0.3;
}

.transparent {
  opacity: 0;
}

.titlePadding {
  padding: 12px 8px;
  span {
    padding: 4px 8px;
  }
}

.topTitle {
  &.active {
    transform: translateY(64px);
  }
}

.bottomTitle {
  &.inactive {
    margin-top: -64px;
  }
}

.imageTransforms {
  text-align: left;
  word-break: normal;
  transition: all 280ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>