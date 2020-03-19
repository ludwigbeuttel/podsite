export interface EpisodeData {
  enclosure: {
    $: {
      url: string;
      type: string;
      // filesize
      length: string;
    }
  };
  title: string;
  description?: string;
  "googleplay:description"?: string;
  "itunes:summary"?: string;
  "googleplay:explicit"?: "yes" | "no";
  "itunes:explicit"?: "yes" | "no";
  guid?: string | { "_": string };
  "itunes:duration"?: string;
  pubDate?: string;
  link?: string;
  "itunes:episode"?: string;
  "itunes:episodeType"?: string;
  "itunes:image"?: {
    $: {
      href: string;
    }
  }
  "content:encoded": string;
}

export interface Social {
  name: string;
  url: string;
  icon: string;
}

export interface Platform {
  name: string;
  url: string;
  icon: string;
}