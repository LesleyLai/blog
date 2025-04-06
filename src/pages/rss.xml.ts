import type { APIContext } from "astro";

import { getRSSFeed } from "@utils/rss";

export function GET(context: APIContext) {
  return getRSSFeed(context, "en");
}
