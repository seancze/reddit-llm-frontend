# Reddit LLM (Frontend)

## Description

As the name suggests, this is a web application that functions as a ChatGPT enriched with data from the SGExams subreddit. The backend repository can be found [here](https://github.com/seancze/reddit-llm-backend).

### Inspiration

Initially, I was investigating if online anonymous communities can help us better understand the needs of youths and how to tackle them. SGExams had been tremendously helpful in my research. At the same time, I found myself needing to perform many auxiliary data analysis tasks which were dreadfully time-consuming. As a CS student, I naturally over-optimised for this problem by building an entire web application that allows me to perform my data analysis tasks by simply asking a question.

To give back to the SGExams subreddit, I made this web application public and shared it with the community [here](https://www.reddit.com/r/SGExams/comments/1f6fm1p/i_built_a_chatgpt_for_sgexams/).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.
