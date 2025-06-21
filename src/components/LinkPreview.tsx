"use client";

import { useState, useCallback } from "react";
import { FaSpinner } from "react-icons/fa";
import {
  Glimpse,
  GlimpseTrigger,
  GlimpseContent,
  GlimpseImage,
  GlimpseTitle,
  GlimpseDescription,
} from "@/components/ui/kibo-ui/glimpse";

interface LinkPreviewProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export function LinkPreview({ href, className, children }: LinkPreviewProps) {
  const [meta, setMeta] = useState<{
    title?: string;
    body?: string;
    metadata?: string;
    image?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const loadMeta = useCallback(() => {
    if (hasFetched) return;
    setHasFetched(true);
    setLoading(true);

    fetch(`/api/preview?url=${encodeURIComponent(href)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setMeta(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [href, hasFetched]);

  return (
    <Glimpse openDelay={0} closeDelay={0}>
      <GlimpseTrigger asChild>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          onMouseEnter={loadMeta}
        >
          {children}
        </a>
      </GlimpseTrigger>

      <GlimpseContent className="w-80">
        {loading && (
          <div className="flex justify-center items-center p-4">
            <FaSpinner className="animate-spin text-xl" />
          </div>
        )}

        {/* finished loading and data is available */}
        {!loading && meta?.metadata && (
          <>
            {meta.image && <GlimpseImage src={meta.image} alt={meta.title} />}
            {meta.title && <GlimpseTitle>{meta.title}</GlimpseTitle>}
            {meta.body && (
              <GlimpseDescription className="line-clamp-5 overflow-auto">
                {meta.body}
              </GlimpseDescription>
            )}
            <GlimpseDescription className="text-xs font-light">
              {meta.metadata}
            </GlimpseDescription>
          </>
        )}

        {/* finished loading but data is not available */}
        {!loading && !meta && hasFetched && (
          <div className="p-4 text-sm text-gray-600">Preview not available</div>
        )}
      </GlimpseContent>
    </Glimpse>
  );
}
