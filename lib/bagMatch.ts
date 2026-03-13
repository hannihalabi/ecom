export const BAG_MATCH_STEPS = [
  "Matchar mot sortiment",
  "Kontrollerar material och färg",
  "Beräknar leveranstid",
] as const;

const SWEDISH_STOP_WORDS = new Set([
  "och",
  "att",
  "som",
  "med",
  "utan",
  "för",
  "till",
  "den",
  "det",
  "en",
  "ett",
  "jag",
  "vill",
  "ha",
  "på",
  "av",
]);

export type BagMatchResult = {
  title: string;
  message: string;
  confidence: number;
};

const extractHighlights = (request: string) => {
  const tokens = request
    .toLowerCase()
    .replace(/[^a-zA-ZåäöÅÄÖ0-9\s]/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(
      (token) => token.length > 2 && !SWEDISH_STOP_WORDS.has(token),
    );

  return Array.from(new Set(tokens)).slice(0, 3);
};

export const analyzeBagRequest = (request: string): BagMatchResult => {
  const highlights = extractHighlights(request);
  const preferenceText =
    highlights.length > 0 ? highlights.join(", ") : "din stilprofil";
  const confidence = Math.min(99, 92 + highlights.length * 2);

  return {
    title: "Bra nyheter! Vi kan leverera en väska som matchar dina önskemål.",
    message: `Vi har alternativ som matchar ${preferenceText}. Snabb leverans i Sverige på 2-4 vardagar.`,
    confidence,
  };
};
