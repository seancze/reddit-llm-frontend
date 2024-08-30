"use client";

import { useEffect } from "react";
import Hotjar from "@hotjar/browser";

export const HotjarInitialiser = () => {
  useEffect(() => {
    const siteId = 5116997;
    const hotjarVersion = 6;

    if (process.env.NODE_ENV === "production") {
      Hotjar.init(siteId, hotjarVersion);
    }
  }, []);

  return null;
};
