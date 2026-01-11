"use client";

import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

export type MarqueeProps = HTMLAttributes<HTMLDivElement>;

export const Marquee = ({ className, ...props }: MarqueeProps) => (
  <div
    className={cn("relative w-full overflow-hidden", className)}
    {...props}
  />
);

export interface MarqueeContentProps extends HTMLAttributes<HTMLDivElement> {
  loop?: boolean;
  pauseOnHover?: boolean;
  speed?: number;
}

export const MarqueeContent = ({
  loop = true,
  pauseOnHover = true,
  speed = 1,
  className,
  children,
  ...props
}: MarqueeContentProps) => {
  const [emblaRef] = useEmblaCarousel({ loop: loop, dragFree: true }, [
    AutoScroll({
      playOnInit: true,
      speed,
      stopOnMouseEnter: pauseOnHover,
      stopOnInteraction: false,
    }),
  ]);

  return (
    <div
      ref={emblaRef}
      className={cn(
        "overflow-hidden cursor-grab active:cursor-grabbing",
        className
      )}
      {...props}
    >
      <div className="flex touch-pan-y">{children}</div>
    </div>
  );
};

export type MarqueeFadeProps = HTMLAttributes<HTMLDivElement> & {
  side: "left" | "right";
};

export const MarqueeFade = ({
  className,
  side,
  ...props
}: MarqueeFadeProps) => (
  <div
    className={cn(
      "absolute top-0 bottom-0 z-10 h-full w-24 from-background to-transparent pointer-events-none",
      side === "left" ? "left-0 bg-gradient-to-r" : "right-0 bg-gradient-to-l",
      className
    )}
    {...props}
  />
);

export type MarqueeItemProps = HTMLAttributes<HTMLDivElement>;

export const MarqueeItem = ({ className, ...props }: MarqueeItemProps) => (
  <div
    className={cn("mx-2 flex-shrink-0 object-contain", className)}
    {...props}
  />
);
