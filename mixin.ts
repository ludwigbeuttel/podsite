import { Component, Vue } from "nuxt-property-decorator"
import xml2js from "xml2js"

// @ts-ignore
@Component({ fetchOnServer: false })
export default class Mixin extends Vue {
  async initFeed() {
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
    const parser = new xml2js.Parser()

    try {
      const res = await this.$axios.$get(process.env.NODE_ENV === "development" ? "/api/externalFeed" : process.env.FEEDLOCATION!)
      let data = reduce(await parser.parseStringPromise(res))
      data = data.rss.channel
      this.$accessor.feed.setFeed(data)
    } catch (e) {
      throw new Error(e)
    }
  }
}