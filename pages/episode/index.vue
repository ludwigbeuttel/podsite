<template>
  <v-row justify="center" align="center" class="fill-height">
    <v-col class="justify-self" align-self="center" style="max-width:800px">
      <v-card>
        <episodeDetails v-model="episode" :loading="state.isLoading">
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
                <v-icon>mdi-play</v-icon>&nbsp;abspielen
              </v-btn>
              <v-spacer />
              <template v-if="editFeed">
                <altDialog no-fullscreen max-width="500">
                  <template v-slot:activator="{ on: dialog }">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn icon color="secondary" @click.stop v-on="{ ...tooltip, ...dialog }">
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </template>
                      <template>löschen</template>
                    </v-tooltip>
                  </template>
                  <template v-slot:default="{ close }">
                    <v-card>
                      <v-card-title>{{ episode.title }} löschen</v-card-title>
                      <v-card-text>
                        Sind Sie sich sicher dass Sie die Episode löschen möchen?
                        <v-checkbox color="secondary" label="Audiodatei ebenfalls löschen" />
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer />
                        <v-btn color="secondary" text @click="close">abbrechen</v-btn>
                        <v-btn color="secondary" outlined @click="close">löschen</v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </altDialog>
                <altDialog
                  scrollable
                  max-width="500"
                  transition="scale-transition"
                  origin="bottom right"
                >
                  <template v-slot:activator="{ on: dialog }">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on: tooltip }">
                        <v-btn icon color="secondary" @click.stop v-on="{ ...tooltip, ...dialog }">
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                      </template>
                      <template>bearbeiten</template>
                    </v-tooltip>
                  </template>
                  <template v-slot:default="{ close }">
                    <v-card>
                      <v-card-title :class="{'pa-0': $vuetify.breakpoint.xs}">
                        <template v-if="$vuetify.breakpoint.xs">
                          <v-toolbar color="primary" dark>
                            <v-btn icon @click="close">
                              <v-icon>mdi-close</v-icon>
                            </v-btn>
                            <v-toolbar-title>{{ episode.title }} bearbeiten</v-toolbar-title>
                            <v-spacer />
                            <v-btn depressed color="secondary" @click="close">Speichern</v-btn>
                          </v-toolbar>
                        </template>
                        <template v-else>{{ episode.title }} bearbeiten</template>
                      </v-card-title>
                      <v-divider v-if="!$vuetify.breakpoint.xs" />
                      <v-card-text class="pa-0">
                        <episodeEdit v-model="episode" />
                      </v-card-text>
                      <v-divider />
                      <v-card-actions v-if="!$vuetify.breakpoint.xs">
                        <v-spacer />
                        <v-btn color="secondary" text @click="close">abbrechen</v-btn>
                        <v-btn color="secondary" outlined @click="close">speichern</v-btn>
                      </v-card-actions>
                    </v-card>
                  </template>
                </altDialog>
              </template>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="secondary"
                    icon
                    :href="episode.enclosureData.url"
                    download
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
        </episodeDetails>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator"

import State from "@/classes/state"
import Episode from "@/classes/episode"
import { EpisodeData } from "@/types"
import episodeDetails from "@/components/episodeDetails.vue"
import altDialog from "@/components/altDialog.vue"
import episodeEdit from "@/components/episodeEdit.vue"

@Component({
  components: { episodeDetails, altDialog, episodeEdit },
})
export default class EpByGUID extends Vue {
  episode = new Episode()
  guid = ""
  state = new State()

  editFeed = process.env.EDIT === "true"

  created() {
    this.state.loading()
  }

  mounted() {
    this.guid = (this.$route.query.guid as string).replace(" ", "+")
    this.onStateChange()
  }

  async onStateChange() {
    try {
      await this.$accessor.feed.initFeed()

      if (!this.guid) {
        return this.$nuxt.error({
          statusCode: 404,
          message: "Episode nicht gefunden",
        })
      } else {
        const data = this.$accessor.feed.rss.item.find((ep: EpisodeData) => {
          if (ep.guid) {
            if (typeof ep.guid === "string") {
              return ep.guid === this.guid
            } else if (ep.guid!._ && typeof ep.guid!._ === "string") {
              return ep.guid!._ === this.guid
            } else {
              return false
            }
          } else {
            return false
          }
        })

        if (data) {
          this.episode = new Episode(data)
          this.state.success()
        } else {
          return this.$nuxt.error({
            statusCode: 404,
            message: "Episode nicht gefunden",
          })
        }
      }
    } catch {
      return this.$nuxt.error({
        statusCode: 404,
        message: "Episode nicht gefunden",
      })
    }
  }

  get status() {
    return this.$accessor.state.feed.status || false
  }
}
</script>