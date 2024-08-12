import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const openai = createOpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });

  const { textStream } = await streamText({
    // '!' is used to force unwrap the value; we can do this because we know the value is set
    model: openai(process.env.NEXT_PUBLIC_OPENAI_MODEL!),
    prompt: prompt,
  });

  const stream = new ReadableStream({
    async start(controller) {
      for await (const textPart of textStream) {
        controller.enqueue(textPart);
      }
      controller.close();
    },
  });

  return new NextResponse(stream);
}
