import { mutationTree } from "nuxt-typed-vuex"

import { EpisodeData } from "@/types"

export const state = () => ({
  episode: null as EpisodeData | null,
})

export const mutations = mutationTree(state, {
  changeEpisode(state, data: EpisodeData | null) {
    state.episode = data
  },
})