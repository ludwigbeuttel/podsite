import { getAccessorType } from "nuxt-typed-vuex"

import * as feed from "./feed"
import * as activeEpisode from "./activeEpisode"

export const accessorType = getAccessorType({
  modules: {
    feed,
    activeEpisode,
  },
})