import Axios from "axios"
import xml2js from "xml2js"
import { mutationTree, actionTree } from "nuxt-typed-vuex"

export const state = () => ({
  rss: null as any | null,
  status: { isLoading: false, isSuccess: false, isError: false },
})

export const mutations = mutationTree(state, {
  setFeed(state, data: any) {
    state.rss = data
  },
  statusLoading(state) {
    state.status.isSuccess = false
    state.status.isError = false
    state.status.isLoading = true
  },
  statusSuccess(state) {
    state.status.isLoading = false
    state.status.isError = false
    state.status.isSuccess = true
  },
  statusError(state) {
    state.status.isLoading = false
    state.status.isSuccess = false
    state.status.isError = true
  },
})

export const actions = actionTree(
  { state },
  {
    set(): Promise<void> {
      return new Promise((resolve, reject) => {
        function reduce(obj: any) {
          if (Array.isArray(obj) && obj.length === 1) {
            if (obj.length === 1) {
              obj = obj[0]
            } else {
              obj.forEach((element, key) => obj[key] = reduce(element))
            }
          }

          if (typeof obj === "object") {
            for (const key in obj) {
              if (obj.hasOwnProperty(key)) {
                const element = obj[key]
                obj[key] = reduce(element)
              }
            }
          }

          return obj
        }

        this.app.$accessor.feed.statusLoading()

        const parser = new xml2js.Parser()
        Axios.get(process.env.NODE_ENV === "development" ? "/api/externalFeed" : process.env.FEEDLOCATION!)
          .then(res => parser.parseStringPromise(res.data))
          .then(res => this.app.$accessor.feed.setFeed(reduce(res.rss.channel[0])))
          .then(() => this.app.$accessor.feed.statusSuccess())
          .then(() => resolve())
          .catch(e => {
            this.app.$accessor.feed.statusError()
            reject(new Error(e))
          })
      })
    },

    initFeed() {
      return new Promise((resolve, reject) => {
        if (this.app.$accessor.feed.status.isSuccess) {
          resolve()
        } else if (!this.app.$accessor.feed.status.isLoading) {
          this.app.$accessor.feed.set()
            .then(() => resolve())
            .catch(() => reject(new Error("error")))
        }
      })
    },
  })