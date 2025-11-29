"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { BrainIcon, ChevronDownIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { createContext, memo, useContext, useEffect, useState } from "react";
import { Response } from "./response";

type ReasoningContextValue = {
  isStreaming: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  duration: number;
  currentIteration?: number;
};

const ReasoningContext = createContext<ReasoningContextValue | null>(null);

const useReasoning = () => {
  const context = useContext(ReasoningContext);
  if (!context) {
    throw new Error("Reasoning components must be used within Reasoning");
  }
  return context;
};

export type ReasoningProps = ComponentProps<typeof Collapsible> & {
  isStreaming?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
  currentIteration?: number;
};

const AUTO_CLOSE_DELAY = 1000;

export const Reasoning = memo(
  ({
    className,
    isStreaming = false,
    open,
    defaultOpen = false,
    onOpenChange,
    duration: durationProp,
    currentIteration,
    children,
    ...props
  }: ReasoningProps) => {
    const [isOpen, setIsOpen] = useControllableState({
      prop: open,
      defaultProp: defaultOpen,
      onChange: onOpenChange,
    });
    const [duration, setDuration] = useControllableState({
      prop: durationProp,
      defaultProp: 0,
    });

    const [hasAutoOpenedRef, setHasAutoOpenedRef] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);

    // Track duration when streaming starts and ends
    useEffect(() => {
      if (isStreaming) {
        if (startTime === null) {
          setStartTime(Date.now());
        }
      } else if (startTime !== null) {
        // show up to 1/100 of a second
        setDuration(Number(((Date.now() - startTime) / 1000).toFixed(2)));
        setStartTime(null);
      }
    }, [isStreaming, startTime, setDuration]);

    // Auto-open when streaming starts (only once), but don't interfere with manual toggling
    useEffect(() => {
      if (isStreaming && !hasAutoOpenedRef) {
        setIsOpen(true);
        setHasAutoOpenedRef(true);
      }
      // Reset the flag when streaming ends so it can auto-open again next time
      if (!isStreaming && hasAutoOpenedRef) {
        setHasAutoOpenedRef(false);
      }
    }, [isStreaming, hasAutoOpenedRef, setIsOpen]);

    const handleOpenChange = (newOpen: boolean) => {
      setIsOpen(newOpen);
    };

    return (
      <ReasoningContext.Provider
        value={{ isStreaming, isOpen, setIsOpen, duration, currentIteration }}
      >
        <Collapsible
          className={cn("not-prose mb-4", className)}
          onOpenChange={handleOpenChange}
          open={isOpen}
          {...props}
        >
          {children}
        </Collapsible>
      </ReasoningContext.Provider>
    );
  }
);

export type ReasoningTriggerProps = ComponentProps<
  typeof CollapsibleTrigger
> & {
  title?: string;
};

export const ReasoningTrigger = memo(
  ({
    className,
    title = "Reasoning",
    children,
    ...props
  }: ReasoningTriggerProps) => {
    const { isStreaming, isOpen, duration, currentIteration } = useReasoning();

    console.log({ isStreaming, duration });
    return (
      <CollapsibleTrigger
        className={cn(
          "flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground transition-colors",
          className
        )}
        {...props}
      >
        {children ?? (
          <>
            <BrainIcon
              className={cn(
                "size-4",
                isStreaming && "animate-pulse text-blue-500"
              )}
            />
            {isStreaming ? (
              <div className="flex items-center gap-2">
                <p>Thinking...</p>
                {currentIteration && (
                  <span className="text-xs bg-blue-500/10 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                    Step {currentIteration}
                  </span>
                )}
                <span className="flex gap-1">
                  <span
                    className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </span>
              </div>
            ) : (
              <p>
                Thought for {duration} {duration === 1 ? "second" : "seconds"}
              </p>
            )}
            <ChevronDownIcon
              className={cn(
                "size-4 text-muted-foreground transition-transform ml-auto",
                isOpen ? "rotate-180" : "rotate-0"
              )}
            />
          </>
        )}
      </CollapsibleTrigger>
    );
  }
);

export type ReasoningContentProps = ComponentProps<
  typeof CollapsibleContent
> & {
  children: string;
};

export const ReasoningContent = memo(
  ({ className, children, ...props }: ReasoningContentProps) => (
    <CollapsibleContent
      className={cn(
        "mt-4 text-sm",
        "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-popover-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
        className
      )}
      {...props}
    >
      <Response className="grid gap-2">{children}</Response>
    </CollapsibleContent>
  )
);

Reasoning.displayName = "Reasoning";
ReasoningTrigger.displayName = "ReasoningTrigger";
ReasoningContent.displayName = "ReasoningContent";
