<template>
  <v-row justify="center" align="center" class="fill-height">
    <v-col class="justify-self" align-self="center" style="max-width: 800px">
      <v-card outlined>
        <v-card-title class="headline">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn icon nuxt to="/" v-on="on">
                <v-icon>{{ icons.mdiArrowLeft }}</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('back') }}</span>
          </v-tooltip>
          &nbsp;{{ $t('about') }}
        </v-card-title>
        <v-card-text class="text-left text--primary">
          <!-- ADD LEGAL INFORMATION HERE -->
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component } from "nuxt-property-decorator"
import { mdiArrowLeft } from "@mdi/js"

// @ts-ignore
@Component({ scrollToTop: true })
export default class About extends Vue {
  icons = {
    mdiArrowLeft,
  }
}
</script>