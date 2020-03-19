import Axios from "axios"
import { config } from "dotenv"

config()

export default async (_req: any, res: any, _next: () => void) => {
  const feed = await Axios.get(process.env.FEEDLOCATION!)
  res.end(feed.data)
}