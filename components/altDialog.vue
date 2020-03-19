<template>
  <v-dialog v-model="opened" v-bind="$attrs" scrollable :fullscreen="isFullscreen">
    <template v-slot:activator="{ on }">
      <slot name="activator" :on="on" />
    </template>

    <slot ref="card" :close="close" />
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "nuxt-property-decorator"

@Component({ inheritAttrs: false })
export default class AltDialog extends Vue {
  @Prop({ default: false }) fullscreen!: boolean;
  @Prop({ default: false }) noFullscreen!: boolean;
  @Prop({ default: null }) value!: boolean;

  // wird verwendt falls keine value
  altOpened = false;

  get opened() {
    return this.value === null ? this.altOpened : this.value
  }

  set opened(newVal: boolean) {
    if (this.value === null) {
      this.altOpened = newVal
    }
    this.$emit("input", newVal)
  }

  get isFullscreen() {
    // @ts-ignore
    return (this.$vuetify.breakpoint.xs || this.fullscreen) && this.noFullscreen !== ""
  }

  close() {
    this.opened = false
  }
}
</script>