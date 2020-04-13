import { mutationTree } from "nuxt-typed-vuex"
import { rss } from "~/types"

export const state = () => ({
  rss: null as rss | null,
})

export const mutations = mutationTree(state, {
  setFeed(state, data: any) {
    state.rss = data
  },
})