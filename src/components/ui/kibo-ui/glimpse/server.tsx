import Snoowrap from "snoowrap";

const reddit = new Snoowrap({
  userAgent: process.env.REDDIT_SCRIPT_USER_AGENT!,
  clientId: process.env.REDDIT_SCRIPT_CLIENT_ID!,
  clientSecret: process.env.REDDIT_SCRIPT_CLIENT_SECRET!,
  username: process.env.REDDIT_SCRIPT_USER_AGENT!,
  password: process.env.REDDIT_SCRIPT_PASSWORD!,
});

export const glimpse = async (url: string) => {
  // extract the submission ID from URLs like https://reddit.com/r/sub/comments/abcdef/title
  const match = url.match(/comments\/([A-Za-z0-9_]+)/);
  if (!match) {
    throw new Error(`Could not parse submission ID from URL: ${url}`);
  }
  const id = match[1];
  console.log(`[INFO] Fetching Reddit submission with ID: ${id}`);
  const submission = await (reddit.getSubmission(id) as Promise<any>);

  const title = await submission.title;
  // for text posts this is the body; for link posts you might want submission.url instead
  const body = (await submission.selftext) || null;

  const votes = await submission.score;
  const voteLabel = votes === 1 ? "1 vote" : `${votes} votes`;

  const comments = await submission.num_comments;
  const commentLabel = comments === 1 ? "1 comment" : `${comments} comments`;

  const author = (await submission.author?.name) || "[deleted]";
  const metadata = `Posted by ${author}, ${voteLabel} and ${commentLabel}`;

  console.log({ url, title, body, metadata });
  return { title, body, metadata };
};
