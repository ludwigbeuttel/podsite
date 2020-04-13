<template>
  <div>
    <v-row justify="center">
      <v-col cols="12" xl="10">
        <v-card>
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
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-text-field v-model="search" label="Suche" clearable solo />
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
        <episodeSkeleton v-for="n in visible" :key="'L2'+n" class="ma-8" />
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
              >
                <template v-if="editFeed">
                  <altDialog no-fullscreen max-width="500">
                    <template v-slot:activator="{ on: dialog }">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
                          <v-btn
                            icon
                            color="secondary"
                            @click.stop
                            v-on="{ ...tooltip, ...dialog }"
                          >
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
                          <v-btn
                            icon
                            color="secondary"
                            @click.stop
                            v-on="{ ...tooltip, ...dialog }"
                          >
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
                          <episodeEdit :value="episode" />
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
              </episode>
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
              @input="$vuetify.goTo($refs.topPagination,{offset:68})"
            />
          </v-col>
        </template>
      </template>
    </v-row>

    <altDialog
      v-if="editFeed"
      scrollable
      max-width="500"
      transition="scale-transition"
      origin="bottom right"
    >
      <template v-slot:activator="{ on }">
        <fab
          :style="$accessor.activeEpisode.episode.title ? 'margin-bottom: 128px' : 'margin-bottom: 64px'"
          style="transition-property: box-shadow, transform, opacity, -webkit-transform, margin;"
          extended="true"
          icon="mdi-plus"
          color="secondary"
          v-on="on"
        >Episode hinzufügen</fab>
      </template>
      <template v-slot:default="{ close }">
        <v-card>
          <v-card-title :class="{'pa-0': $vuetify.breakpoint.xs}">
            <template v-if="$vuetify.breakpoint.xs">
              <v-toolbar color="primary" dark>
                <v-btn icon @click="close">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Neue Episode</v-toolbar-title>
                <v-spacer />
                <v-btn depressed color="secondary" @click="close">Speichern</v-btn>
              </v-toolbar>
            </template>
            <template v-else>Neue Episode</template>
          </v-card-title>
          <v-divider v-if="!$vuetify.breakpoint.xs" />
          <v-card-text class="pa-0">
            <episodeEdit />
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
  </div>
</template>

<script lang="ts" src="./index.ts"/>