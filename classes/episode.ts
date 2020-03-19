import { DateTime } from "luxon"

import { EpisodeData } from "@/types"

export default class Episode {
  private enclosure: { $: Enclosure } = {
    $: {
      url: "",
      type: "",
      length: "",
    },
  };

  title = "";
  private description = "";
  private "googleplay:description" = "";
  private "itunes:summary" = "";
  private "googleplay:explicit": "yes" | "no" = "no";
  private "itunes:explicit": "yes" | "no" = "no";
  guid = "";
  private "itunes:duration" = "";
  private pubDate = DateTime.local().toRFC2822();
  link = "";
  private "itunes:episode" = "";
  private "itunes:episodeType" = "";
  private "itunes:image" = {
    $: {
      href: "",
    },
  }

  private "content:encoded": string;

  set desc(newVal: string) {
    this.description = newVal
    this["googleplay:description"] = newVal
    this["itunes:summary"] = newVal
  }

  get desc() {
    return this.description
  }

  set content(newVal: string) {
    this["content:encoded"] = newVal
  }

  get content() {
    return this["content:encoded"]
  }

  get date() {
    return DateTime.fromRFC2822(this.pubDate)
  }

  set date(newVal: DateTime) {
    if (typeof newVal === "string") {
      this.pubDate = newVal
    } else {
      this.pubDate = newVal.toRFC2822()
    }
  }

  get enclosureData() {
    return this.enclosure.$
  }

  set enclosureData(newVal: Enclosure) {
    this.enclosure.$ = newVal
  }

  get duration() {
    return this["itunes:duration"]
  }

  set duration(newVal: string) {
    this["itunes:duration"] = newVal
  }

  get explicit() {
    return this["itunes:explicit"] === "yes" || this["googleplay:explicit"] === "yes"
  }

  set explicit(newVal: string | boolean) {
    this["itunes:explicit"] = (typeof newVal === "boolean" ? newVal : newVal === "yes") ? "yes" : "no"
    this["googleplay:explicit"] = (typeof newVal === "boolean" ? newVal : newVal === "yes") ? "yes" : "no"
  }

  get episodeNo() {
    return parseInt(this["itunes:episode"], 10) || 0
  }

  set episodeNo(newVal: string | number) {
    this["itunes:episode"] = newVal.toString()
  }

  get type() {
    return this["itunes:episodeType"]
  }

  set type(newVal: string) {
    this["itunes:episodeType"] = newVal
  }

  get image() {
    return this["itunes:image"] ? this["itunes:image"].$.href : ""
  }

  set image(newVal: string) {
    this["itunes:image"] = {
      $: { href: newVal },
    }
  }

  constructor(data?: EpisodeData) {
    function guid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        // eslint-disable-next-line one-var
        const r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    }

    if (data) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          // @ts-ignore
          this[key] = data[key]
        }
      }
    } else {
      this.guid = guid()
    }
  }
}

interface Enclosure {
  url: string;
  type: string;
  length: string;
}