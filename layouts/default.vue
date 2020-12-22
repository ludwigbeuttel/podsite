<template>
  <v-app>
    <v-app-bar ref="appBar" fixed shrink-on-scroll flat color="primary">
      <v-img
        class="my-n1"
        :aspect-ratio="1"
        contain
        position="center left"
        height="inherit"
        :src="headerImage"
        @load="onImageChange"
      />

      <v-spacer />

      <v-tooltip v-for="(media, i) in socialMedia" :key="i" bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon dark :href="media.url" target="_blank" rel="noopener noreferrer" :aria-label="media.name" v-on="on">
            <v-icon>mdi-{{ media.icon }}</v-icon>
          </v-btn>
        </template>
        <template>{{ media.name }}</template>
      </v-tooltip>
    </v-app-bar>
    <v-main style="margin-top:128px">
      <v-container>
        <v-row align="center" justify="center">
          <v-col class="text-center">
            <v-scroll-x-transition leave-absolute>
              <nuxt />
            </v-scroll-x-transition>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer color="primary">
          <v-btn small to="/aboutDemo" text dark>{{ $t('about') }}</v-btn>
    </v-footer>

    <alt-dialog v-if="$accessor.feed.rss" no-fullscreen max-width="400">
      <template v-slot:activator="{ on }">
        <fab
          :style="$accessor.activeEpisode.episode && $accessor.activeEpisode.episode.title ? 'margin-bottom: 64px' : ''"
          style="transition-property: box-shadow, transform, opacity, -webkit-transform, margin;"
          extended="true"
          icon="mdi-plus"
          color="secondary"
          v-on="on"
        >{{ $t('subscribe') }}</fab>
      </template>
      <template v-slot:default="{ close }">
        <v-card outlined>
          <v-card-title
            class="text--truncate"
            style="word-break: break-word;"
          >{{ $t('subscribeText') }} {{ $accessor.feed.rss.title }}</v-card-title>
          <v-card-text class="text--primary">
            <v-btn
              v-for="service in services"
              :key="service.url"
              class="my-1"
              block
              depressed
              color="primary"
              :href="service.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              <v-icon v-if="service.icon" class="mr-1">mdi-{{ service.icon }}</v-icon>
              {{ service.name }}
            </v-btn>
            <v-btn
              class="my-1"
              block
              depressed
              color="primary"
              :href="rssFeedLocation"
              target="_blank"
            >
              <v-icon class="mr-1">mdi-rss</v-icon>RSS
            </v-btn>
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

    <v-slide-y-reverse-transition mode="out-in">
      <v-footer
        v-if="$accessor.activeEpisode.episode && $accessor.activeEpisode.episode.title"
        :key="$accessor.activeEpisode.episode.title"
        padless
        fixed
      >
        <player ref="player" />
      </v-footer>
    </v-slide-y-reverse-transition>
  </v-app>
</template>

<script lang="ts" src="./default.ts"/>
