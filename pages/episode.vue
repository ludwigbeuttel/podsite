<template>
  <v-row justify="center" align="center" class="fill-height">
    <v-col class="justify-self" align-self="center" style="max-width: 800px">
      <v-card outlined>
        <episode-details
          v-model="episode"
          :loading="$fetchState.pending"
        >
          <template v-slot:top>
            <v-btn icon large nuxt to="/" class="mr-1">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </template>
          <template>
            <v-card-actions>
              <v-btn
                outlined
                color="secondary"
                @click.stop="$accessor.activeEpisode.changeEpisode(episode)"
              >
                <v-icon>mdi-play</v-icon>
                &nbsp;abspielen
              </v-btn>
              <v-spacer />
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="secondary"
                    icon
                    :href="episode.enclosureData.url"
                    download
                    aria-label="Episode herunterladen"
                    @click.stop
                    v-on="on"
                  >
                    <v-icon>mdi-download</v-icon>
                  </v-btn>
                </template>
                <template>herunterladen</template>
              </v-tooltip>
            </v-card-actions>
          </template>
        </episode-details>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
/* eslint-disable dot-notation */

import { Component } from "nuxt-property-decorator"

import Episode from "@/classes/episode"
import PageMixin from "@/mixin"

// @ts-ignore
@Component({ scrollToTop: true, fetchOnServer: false })
export default class EpByGUID extends PageMixin {
  episode = new Episode()

  async fetch() {
    if (!this.$accessor.feed.rss) {
      await this.initFeed()
    }
    this.fetchFinished()
  }

  fetchFinished() {
    try {
      // @ts-ignore
      const guid = (this.$route.query.guid as string).replace(" ", "+")

      if (guid) {
        const data = this.$accessor.feed.rss!.item.find(ep => {
          if (ep.guid) {
            if (typeof ep.guid === "string") {
              return ep.guid === guid
            } else if (ep.guid!["_"] && typeof ep.guid!["_"] === "string") {
              return ep.guid!["_"] === guid
            } else {
              return false
            }
          } else {
            return false
          }
        })

        if (data) {
          this.episode = new Episode(data)
          console.info(this.episode)
        } else {
          // @ts-ignore
          return this.$nuxt.error({
            statusCode: 404,
            message: "Episode nicht gefunden",
          })
        }
      } else {
        // @ts-ignore
        return this.$nuxt.error({
          statusCode: 404,
          message: "Episode nicht gefunden",
        })
      }
    } catch {
      // @ts-ignore
      return this.$nuxt.error({
        statusCode: 404,
        message: "Episode nicht gefunden",
      })
    }
  }
}
</script>