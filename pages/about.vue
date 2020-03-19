<template>
  <v-row justify="center" align="center" class="fill-height">
    <v-col class="justify-self" align-self="center" style="max-width:800px">
      <v-card>
        <v-card-title>
          <v-btn icon nuxt to="/">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>&nbsp;Impressum
        </v-card-title>
        <v-card-text style="">
          <!-- ADD LEGAL INFORMATION HERE -->
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator"

@Component
export default class Impressum extends Vue {}
</script>