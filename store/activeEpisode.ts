import { mutationTree } from "nuxt-typed-vuex"

import Episode from "~/classes/episode"

export const state = () => ({
  episode: null as Episode | null,
})

export const mutations = mutationTree(state, {
  changeEpisode(state, data: Episode | null) {
    state.episode = data
  },
})