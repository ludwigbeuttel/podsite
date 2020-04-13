export interface EpisodeData {
  enclosure: {
    $: {
      url: string
      type: string
      // filesize
      length: string
    }
  }
  title: string
  description?: string
  "googleplay:description"?: string
  "itunes:summary"?: string
  "googleplay:explicit"?: "yes" | "no"
  "itunes:explicit"?: "yes" | "no"
  guid?: string | { "_": string }
  "itunes:duration"?: string
  pubDate?: string
  link?: string
  "itunes:episode"?: string
  "itunes:episodeType"?: string
  "itunes:image"?: {
    $: {
      href: string
    }
  }
  "content:encoded": string
}

export interface Social {
  name: string
  url: string
  icon: string
}

export interface Platform {
  name: string
  url: string
  icon: string
}

export interface rss {
  title: string
  link: string
  description: string
  lastBuildDate: string
  image: {
    url: "",
    title: "",
    link: ""
  }
  language: string
  "itunes:author": string
  "itunes:type": string
  "itunes:summary": string
  "itunes:category": {
    "$": {
      "text": string
    }
  },
  "itunes:owner": {
    "itunes:name": string
    "itunes:email": string
  },
  "itunes:image": {
    "$": {
      "href": string
    }
  },
  "itunes:subtitle": string
  "itunes:block": string
  "itunes:explicit": string
  item: EpisodeData[]
}