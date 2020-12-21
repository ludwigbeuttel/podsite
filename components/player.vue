<template>
  <v-toolbar class="primary mx-0 player" min-height="64px" dark :short="false">
    <v-row style="flex-wrap:unset" dense>
      <v-col class="shrink">
        <v-btn icon @click="playPause()">
          <v-icon v-if="playing" x-large>mdi-pause</v-icon>
          <v-icon v-else x-large>mdi-play</v-icon>
        </v-btn>
      </v-col>
      <v-col v-if="!breakpoint.xs && episode.image" class="shrink">
        <alt-dialog
          no-fullscreen
          max-width="800"
          transition="scale-transition"
          origin="bottom left"
          scrollable
        >
          <template v-slot:activator="{ on }">
            <v-img
              v-ripple
              style="border-radius:3px; cursor:pointer;"
              width="50"
              height="50"
              :aspect-ratio="1"
              :src="episode.image"
              v-on="on"
            />
          </template>
          <template v-slot:default="{ close }">
            <v-card>
              <v-card-text class="pa-0">
                <v-img :aspect-ratio="1" :src="episode.image" @click="close" />
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="secondary" outlined @click="close">
                  {{ $t('close') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </alt-dialog>
      </v-col>
      <v-col class="py-0" align-self="center">
        <div style="position:relative">
          <div
            class="text-center text-truncate"
            style="position: absolute; left:50%; top:6px; transform:translateX(-50%); max-width:45vw;"
          >
            <span class="font-weight-medium">{{ episode.title }}</span>
            <span
              v-if="!$vuetify.breakpoint.smAndDown && episode.date"
            >vom {{ episode.date.toLocaleString() }}</span>
          </div>
        </div>
        <v-slider
          v-model="progressVal"
          class="mt-6"
          min="0"
          :max="audio ? audio._duration : 1"
          hide-details
          @change="progress = $event"
        />
      </v-col>
      <v-col v-if="!$vuetify.breakpoint.smAndDown" align-self="center" style="max-width:150px">
        <v-slider v-model="volume" min="0" max="100" hide-details>
          <template v-slot:prepend>
            <v-icon v-if="volume === 0">mdi-volume-mute</v-icon>
            <v-icon v-else-if="volume > 50">mdi-volume-high</v-icon>
            <v-icon v-else>mdi-volume-medium</v-icon>
          </template>
        </v-slider>
      </v-col>
      <v-col class="shrink">
        <v-menu top nudge-top="55" :close-on-content-click="false" max-width="400">
          <template v-slot:activator="{ on: menu }">
            <v-tooltip top>
              <template v-slot:activator="{ on: tooltip }">
                <v-btn aria-label="Detials öffnen" icon v-on="{ ...tooltip, ...menu }">
                  <v-icon>{{ icons.mdiClipboardText }}</v-icon>
                </v-btn>
              </template>
              <template>{{ $t('player.details') }}</template>
            </v-tooltip>
          </template>
          <v-card outlined>
            <episode-details v-model="episode" />
          </v-card>
        </v-menu>
      </v-col>
      <v-col class="shrink">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              :href="episode.enclosureData.url"
              download
              :aria-label="$t('downloadEpisode')"
              @click.stop
              v-on="on"
            >
              <v-icon>{{ icons.mdiDownload }}</v-icon>
            </v-btn>
          </template>
          <template>{{ $t('download') }}</template>
        </v-tooltip>
      </v-col>
    </v-row>
  </v-toolbar>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator"
import { Howl, Howler } from "howler"
import { mdiClipboardText, mdiDownload } from '@mdi/js'

import Episode from "@/classes/episode"

@Component
export default class Player extends Vue {
  episode = new Episode()
  icons = {
    mdiClipboardText,
    mdiDownload,
  }

  audio: null | Howl = null
  progressVal = 0
  set progress(newVal: number) {
    if (this.playTimer) {
      clearInterval(this.playTimer)
    }

    if (this.audio) {
      this.audio!.seek(newVal)
    }
    this.progressVal = newVal
  }

  get progress() {
    return this.progressVal
  }

  get breakpoint() {
    return this.$vuetify.breakpoint
  }

  playing = true
  volumeVal = 100

  set volume(newVal: number) {
    Howler.volume(newVal / 100)
    this.volumeVal = newVal
  }

  get volume() {
    return this.volumeVal
  }

  playPause() {
    if (this.playing) {
      this.audio!.pause()
    } else {
      this.audio!.play()
    }
  }

  playTimer: any = null

  playEpisode() {
    this.audio = new Howl({
      src: [this.episode.enclosureData.url],
      autoplay: true,
      html5: true,
      volume: this.volumeVal / 100,
      onend: () => {
        this.playing = false
        clearInterval(this.playTimer)
        this.$accessor.activeEpisode.changeEpisode(null)
      },
      onpause: () => {
        this.playing = false
        clearInterval(this.playTimer)
      },
      onplay: () => {
        this.playing = true

        this.playTimer = setInterval(() => {
          this.progressVal++
        }, 1000)
      },
      onseek: () => {
        if (!this.audio || !this.playing) {
          this.audio!.play()
          this.playing = true
        }

        this.playTimer = setInterval(() => {
          this.progressVal++
        }, 1000)
      },
    })
  }

  mounted() {
    console.log(this.$accessor.activeEpisode.episode)
    this.episode = this.$accessor.activeEpisode.episode!
    this.playEpisode()
  }

  beforeDestroy() {
    this.audio!.unload()
  }
}
</script>

<style lang="scss">
.player .v-toolbar__content {
  height: unset;
}
</style>