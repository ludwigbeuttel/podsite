import Axios from "axios"
import xml2js from "xml2js"
import { mutationTree, actionTree } from "nuxt-typed-vuex"

export const state = () => ({
  rss: null as any | null,
  status: { isLoading: false, isSuccess: false, isError: false },
})

export const mutations = mutationTree(state, {
  set(state, data: any) {
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
    set({ commit }: any) {
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

        commit("statusLoading")
        const parser = new xml2js.Parser()
        Axios.get(process.env.NODE_ENV === "development" ? "/api/externalFeed" : process.env.FEEDLOCATION!)
          .then(res => parser.parseStringPromise(res.data))
          .then(res => commit("set", reduce(res.rss.channel[0])))
          .then(() => commit("statusSuccess"))
          .then(() => resolve())
          .catch(e => {
            commit("statusError")
            reject(new Error(e))
          })
      })
    },

    initFeed({ state, dispatch }: any) {
      return new Promise((resolve, reject) => {
        if (state.status.isSuccess) {
          resolve()
        } else if (state.status.isLoading) {
          setInterval(() => {
            if (state.status.isSuccess) {
              resolve()
            } else if (state.status.isSuccess) {
              reject(new Error("error"))
            }
          }, 100)
        } else {
          dispatch("set")
            .then(() => resolve())
            .catch(() => reject(new Error("error")))
        }
      })
    },
  })