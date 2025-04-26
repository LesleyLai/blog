import type { APIContext } from "astro";

import { getRSSFeed } from "@utils/rss";

export async function GET(context: APIContext) {
  return await getRSSFeed(context, "en");
}
