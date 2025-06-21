import * as cheerio from "cheerio";

export const glimpse = async (url: string) => {
  const res = await fetch(url);
  const html = await res.text();

  const $ = cheerio.load(html);

  // target the reddit post tag
  const postEl = $("shreddit-post").first();

  const author = postEl.attr("author") || null;
  const score = postEl.attr("score") || null;
  const postTitle = postEl.attr("post-title") || null;
  const commentCount = postEl.attr("comment-count") || null;

  // get all text found within p tags inside the element with slot="text-body"
  const body =
    $('[slot="text-body"] p')
      .map((_, el) => $(el).text().trim())
      .get()
      .join("\n\n") || null;

  const title = postTitle;
  const scoreFormatted = score === "1" ? "1 vote" : `${score} votes`;
  const commentCountFormatted =
    commentCount === "1" ? "1 comment" : `${commentCount} comments`;
  const metadata =
    author && score != null && commentCount != null
      ? `Posted by ${author}, ${scoreFormatted} and ${commentCountFormatted}`
      : null;

  console.log({ url, title, body, metadata });

  return { title, body, metadata };
};
