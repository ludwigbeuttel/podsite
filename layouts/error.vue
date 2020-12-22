<template>
  <v-row justify="center" align="center" no-gutters style="height: calc(100vh - 256px)">
    <v-col align-self="center" class="shrink">
      <v-alert type="error" width="400" class="text-left">
        <h3 class="headline">Ein Fehler ist aufgetreten</h3>
        <div v-if="message">{{ message }}</div>
        <div>Fehler-Code: {{ statusCode }}</div>
        {{ $router.referer }}
        <v-row class="mt-4" no-gutters>
          <v-spacer />
          <v-btn
            outlined
            nuxt
            :class="{'mt-1':$vuetify.breakpoint.xs}"
            :block="$vuetify.breakpoint.xs"
            to="/"
          >
            <v-icon>{{ icons.mdiHome }}</v-icon>&nbsp;
            Startseite
          </v-btn>
        </v-row>
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
import { mdiHome } from "@mdi/js"

export default {
  name: "NuxtError",
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data () {
    return {
      icons: { mdiHome },
    }
  },
  computed: {
    statusCode() {
      return (this.error && this.error.statusCode) || 500
    },
    message() {
      return this.error.message || "<%= messages.client_error %>"
    },
  },
  head() {
    return {
      title: this.message,
    }
  },
}
</script>