"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export const TrackView = ({ productId }: { productId: string }) => {
  useEffect(() => {
    track("view_item", { productId });
  }, [productId]);

  return null;
};
