<template>
  <div>
    <v-fade-transition>
      <v-hover v-if="episode.image" v-slot:default="{ }">
        <v-img :aspect-ratio="1" width="inherit" :src="episode.image" />
      </v-hover>
      <v-sheet
        v-else
        ref="imgPlaceholder"
        v-resize="setImgPlaceholderHeight"
        :height="imgPlaceholderHeight"
        tile
        color="grey lighten-3"
      >
        <v-row class="fill-height ma-0" justify="center" align="center">
          <v-col align-self="center">
            <v-file-input
              class="ma-4"
              outlined
              label="Episodenbild"
              messages="optional"
              prepend-icon="mdi-file-image"
            />
          </v-col>
        </v-row>
      </v-sheet>
    </v-fade-transition>

    <v-expand-transition>
      <v-list-item v-if="episode.image" two-line class="mt-3">
        <v-list-item-content>
          <v-text-field
            v-model="episode.image"
            readonly
            outlined
            label="Episodenbild"
            messages="optional"
            prepend-icon="mdi-file-image"
            append-icon="mdi-close"
            @click:append="episode.image = ''"
          />
        </v-list-item-content>
      </v-list-item>
    </v-expand-transition>

    <v-list-item two-line>
      <v-list-item-content>
        <v-text-field
          v-model="episode.title"
          outlined
          messages="Pflichtfeld"
          label="Titel"
          prepend-icon="mdi-format-title"
        />
      </v-list-item-content>
    </v-list-item>

    <v-list-item>
      <v-list-item-content>
        <v-textarea
          v-model="episode.desc"
          messages="empfohlen, einzelner Satz der die Folge kurz beschreibt"
          label="Beschreibung"
          outlined
          prepend-icon="mdi-text"
          no-resize
        />
      </v-list-item-content>
    </v-list-item>

    <v-list-item>
      <v-list-item-content style="white-space: pre-line">
        <no-ssr placeholder="Shownotes-Editor lädt...">
          <tipTapEditor
            v-model="episode.content"
            messages="empfohlen, komplexe Shownotes mit Formatierung, Links etc."
            prepend-icon="mdi-note-text"
            label="Shownotes"
          />
        </no-ssr>
      </v-list-item-content>
    </v-list-item>

    <v-list-item class="text-left">
      <v-list-item-content>
        <v-menu
          v-model="dateMenu"
          :disabled="released"
          :close-on-content-click="false"
          transition="slide-y-transition"
          nudge-bottom="45"
          min-width="290px"
          hide-details
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="dateTime"
              :disabled="released"
              outlined
              prepend-icon="mdi-calendar"
              readonly
              label="Veröffentlichungsdatum"
              :messages="released ? 'nicht bearbeitbar, da bereits veröffentlicht' : 'Pflichtfeld'"
              append-icon="mdi-backup-restore"
              @click:append="resetDateTime()"
              v-on="on"
            />
          </template>
          <v-card>
            <v-date-picker
              v-model="date"
              class="pb-3 elevation-0"
              locale="de-DE"
              first-day-of-week="1"
              no-title
              scrollable
            />
            <v-time-picker v-model="time" class="elevation-0" no-title format="24hr" scrollable />
            <v-card-actions>
              <v-spacer />
              <v-btn outlined @click="dateMenu = false">schliessen</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-list-item-content>
    </v-list-item>

    <v-list-item two-line>
      <v-list-item-content>
        <v-text-field
          v-if="episode.enclosureData.url"
          v-model="episode.enclosureData.url"
          readonly
          outlined
          messages="Pflichtfeld"
          label="Audiodatei"
          prepend-icon="mdi-file-music"
          append-icon="mdi-close"
          @click:append="episode.enclosureData = {url: '', type: '', length: ''}"
        />
        <v-file-input
          v-else
          outlined
          messages="Pflichtfeld"
          label="Audiodatei"
          prepend-icon="mdi-file-music"
        />
      </v-list-item-content>
    </v-list-item>

    <v-list-item two-line>
      <v-list-item-content>
        <v-text-field
          v-model="episode.episodeNo"
          type="number"
          outlined
          messages="Optional"
          label="Folgennummer"
          prepend-icon="mdi-numeric"
        />
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "nuxt-property-decorator"
import { DateTime } from "luxon"

import { EpisodeData } from "@/types"
import Episode from "@/classes/episode"
import tipTapEditor from "@/components/editor.vue"

@Component({ components: { tipTapEditor } })
export default class EpEdit extends Vue {
  @Prop() value!: EpisodeData
  episode = new Episode()
  imgPlaceholderHeight = 400

  created() {
    if (this.value) {
      this.episode = new Episode(this.value)
    }
  }

  resetDateTime() {
    this.episode.date = DateTime.local()
  }

  released = false

  mounted() {
    this.setImgPlaceholderHeight()

    if (this.value) {
      this.episode = new Episode(this.value)
      this.released = DateTime.local() > this.episode.date
    }

    if (!this.episode.episodeNo) {
      this.episode.episodeNo = this.$accessor.feed.rss.item.length
        ? parseInt(this.$accessor.feed.rss.item[0]["itunes:episode"], 10) + 1
        : 1
    }
  }

  setImgPlaceholderHeight() {
    if (this.$refs.imgPlaceholder) {
      // @ts-ignore
      this.imgPlaceholderHeight = this.$refs.imgPlaceholder.$el.offsetWidth
    } else {
      this.imgPlaceholderHeight = 400
    }
  }

  get date() {
    return this.episode.date.toISODate()
  }

  set date(newVal: string) {
    const dateVals = newVal.split("-")
    this.episode.date = this.episode.date.set({
      year: parseInt(dateVals[0], 10),
      month: parseInt(dateVals[1], 10),
      day: parseInt(dateVals[2], 10),
    })
  }

  get time() {
    return this.episode.date.hour + ":" + this.episode.date.minute
  }

  set time(newVal: string) {
    const dateVals = newVal.split(":")
    this.episode.date = this.episode.date.set({
      hour: parseInt(dateVals[0], 10),
      minute: parseInt(dateVals[1], 10),
    })
  }

  dateMenu = false
  time2 = null

  get dateTime() {
    function normalize(no: number): string {
      if (no < 9) {
        return "0" + no.toString()
      } else {
        return no.toString()
      }
    }

    return (
      this.episode.date.toLocaleString() +
      " " +
      normalize(this.episode.date.hour) +
      ":" +
      normalize(this.episode.date.minute)
    )
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

.imageTransforms {
  text-align: left;
  word-break: normal;
  transition: all 280ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>