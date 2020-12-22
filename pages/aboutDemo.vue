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
            <span>{{ $t("back") }}</span>
          </v-tooltip>
          &nbsp;{{ $t("about") }}
        </v-card-title>
        <v-card-text class="text-left text--primary">
          <p>Created by Ludwig Beuttel</p>
          <p>
            visit https://github.com/ludwigbeuttel/podsite
            <v-btn
              icon
              color="secondary"
              small
              href="https://github.com/ludwigbeuttel/podsite"
            >
              <v-icon small>mdi-open-in-new</v-icon>
            </v-btn>
            for further information
          </p>
          <p>
            email me at ludwig.beuttel@gmail.com
            <v-btn
              icon
              color="secondary"
              small
              href="mailto://ludwig.beuttel@gmail.com"
            >
              <v-icon small>mdi-email</v-icon>
            </v-btn>
          </p>
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
export default class AboutDemo extends Vue {
  icons = {
    mdiArrowLeft,
  }
}
</script>