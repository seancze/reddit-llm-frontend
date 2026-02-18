import { useState, useCallback, useRef } from "react";
import { Message } from "@/types/message";

interface StreamEvent {
  type: "route" | "content" | "thinking" | "complete" | "error";
  data: any;
}

interface ThinkingData {
  iteration: number;
  tool: string;
  collection?: string;
  pipeline?: any[];
  args?: any;
}

interface StreamingQueryResult {
  response: string;
  queryId: string;
  chatId: string;
  userVote: -1 | 0 | 1;
  route?: string;
}

interface UseStreamingQueryOptions {
  onChunk?: (chunk: string) => void;
  onRoute?: (route: string) => void;
  onStreamStart?: () => void;
  onThinking?: (thinking: ThinkingData) => void;
  onComplete?: (metadata: any) => void;
  onError?: (error: string) => void;
}

export function useStreamingQuery(options: UseStreamingQueryOptions = {}) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const streamQuery = useCallback(
    async (
      messages: Message[],
      jwt: string,
      chatId?: string
    ): Promise<StreamingQueryResult> => {
      // Abort any ongoing request
      abortControllerRef.current?.abort();

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsStreaming(true);
      setStreamedContent("");
      setError(null);

      let fullResponse = "";
      let metadata: any = null;
      let route: string | undefined;
      let hasStarted = false;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}queries/stream`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${jwt}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: messages,
              chat_id: chatId,
            }),
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No response body");
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const event: StreamEvent = JSON.parse(line.slice(6));

                switch (event.type) {
                  case "route":
                    route = event.data;
                    options.onRoute?.(event.data);
                    break;

                  case "thinking":
                    options.onThinking?.(event.data);
                    break;

                  case "content":
                    if (!hasStarted) {
                      hasStarted = true;
                      options.onStreamStart?.();
                    }
                    fullResponse += event.data;
                    setStreamedContent((prev) => prev + event.data);
                    options.onChunk?.(event.data);
                    break;

                  case "complete":
                    metadata = event.data;
                    options.onComplete?.(event.data);
                    break;

                  case "error":
                    const errorMsg = event.data;
                    setError(errorMsg);
                    options.onError?.(errorMsg);
                    throw new Error(errorMsg);
                }
              } catch (parseError) {
                console.error("Failed to parse SSE event:", line, parseError);
              }
            }
          }
        }

        if (!metadata) {
          throw new Error("No completion metadata received");
        }

        return {
          response: fullResponse,
          queryId: metadata.query_id,
          chatId: metadata.chat_id,
          userVote: metadata.user_vote,
          route,
        };
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("Streaming request was cancelled");
          throw err;
        }
        const errorMessage = err.message || "Streaming failed";
        setError(errorMessage);
        throw err;
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [options]
  );

  const cancelStream = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  return {
    streamQuery,
    cancelStream,
    isStreaming,
    streamedContent,
    error,
  };
}
