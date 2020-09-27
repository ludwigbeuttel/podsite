<template>
  <v-card width="400" style="height:fit-content" flat outlined>
    <v-skeleton-loader height="400" style="transform: scaleY(2) translateY(25%)" tile type="image" />
    <v-skeleton-loader type="list-item-three-line, list-item-two-line, list-item-two-line" />
    <v-card-actions style="margin-top:64px">
      <v-skeleton-loader type="button" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator"

@Component
export default class EpisodeSkeleton extends Vue {}
</script>