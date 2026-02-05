export type AnalyticsEvent =
  | "view_item"
  | "add_to_cart"
  | "begin_checkout"
  | "purchase";

export const track = (eventName: AnalyticsEvent, payload?: Record<string, unknown>) => {
  if (typeof window === "undefined") {
    return;
  }

  // Placeholder hook for analytics providers.
  console.info("[track]", eventName, payload ?? {});
};
