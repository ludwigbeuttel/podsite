<template>
  <v-btn
    v-bind="$attrs"
    large
    :dark="dark"
    :color="color"
    :rounded="hasText"
    :fab="!hasText"
    :show-success="false"
    :style="custumPosition ? '' : computedStyle"
    v-on="$listeners"
  >
    <template v-if="icon">
      <v-icon :dark="dark">{{ icon }}</v-icon>
      <template v-if="hasText">&nbsp;</template>
    </template>
    <slot v-if="extended !== null && hasText" />
  </v-btn>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "nuxt-property-decorator"

@Component
export default class FAB extends Vue {
  @Prop({ default: "secondary" }) color!: string
  @Prop({ default: "" }) icon!: string
  @Prop({ default: true }) dark!: boolean
  @Prop({ default: false }) extended!: boolean
  @Prop({ default: false }) custumPosition!: boolean

  get computedStyle(): string {
    const style = "position:fixed; bottom:20px; z-index:2;"

    if (this.isXs && this.hasText) {
      return style + "left:50%; transform: translateX(-50%);"
    } else {
      return style + "right:20px"
    }
  }

  get text(): string | Vue.VNode[] {
    if (this.$slots.default) {
      if (this.isXs && !this.extended) {
        return ""
      } else {
        return this.$slots.default
      }
    } else {
      return ""
    }
  }

  get hasText(): boolean {
    return !!this.text
  }

  get hasIcon(): boolean {
    return !!this.$slots.icon
  }

  get isXs(): boolean {
    // @ts-ignore
    return !!this.$vuetify.breakpoint.xs
  }
}
</script>