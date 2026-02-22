import type { Product } from "@/types";

export type ReviewSnippet = {
  id: string;
  author: string;
  context: string;
  text: string;
  rating: number;
};

const AUTHORS = [
  "Maja L.",
  "Erik S.",
  "Nora P.",
  "Ali H.",
  "Sara K.",
  "Johan B.",
  "Elin T.",
  "David R.",
  "Lina M.",
  "Oskar N.",
];

const CONTEXTS = [
  "Vardag och pendling",
  "Jobbresor och möten",
  "Helgutflykt i stan",
  "Middag och event",
  "Present till partner",
  "Weekendresa",
  "Kontorsdagar",
  "Resa med handbagage",
];

const OPENERS = [
  "Köpte den här och blev positivt överraskad direkt.",
  "Har nu använt den i några veckor och den känns riktigt genomtänkt.",
  "Beställde efter rekommendation och den motsvarade förväntningarna.",
  "Valde den här modellen efter att ha jämfört flera alternativ.",
  "Snabb leverans och produkten kändes rätt från första dagen.",
];

const DETAILS = [
  "Materialet känns stabilt och detaljerna håller hög nivå.",
  "Storleken fungerar bättre än väntat och allt jag behöver får plats.",
  "Den känns lätt att bära och smidig i vardagen.",
  "Finishen ser premium ut även vid daglig användning.",
  "Dragkedjor och remmar känns robusta och pålitliga.",
];

const RECOMMENDATIONS = [
  "Rekommenderar den gärna vidare.",
  "Har redan tipsat en vän om samma modell.",
  "Skulle absolut köpa igen.",
  "Prisvärd i förhållande till kvaliteten.",
  "Ett tryggt köp om man vill ha något hållbart.",
];

const hashValue = (input: string) =>
  input.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

export const getReviewCountPreview = (productId: string) => 8 + (hashValue(productId) % 22);

export const getReviewSnippets = (product: Product, total = 4): ReviewSnippet[] => {
  const seed = hashValue(product.slug);

  return Array.from({ length: total }, (_, index) => {
    const author = AUTHORS[(seed + index * 3) % AUTHORS.length];
    const context = CONTEXTS[(seed + index * 5) % CONTEXTS.length];
    const opener = OPENERS[(seed + index * 7) % OPENERS.length];
    const detail = DETAILS[(seed + index * 11) % DETAILS.length];
    const recommendation = RECOMMENDATIONS[(seed + index * 13) % RECOMMENDATIONS.length];
    const rating = Math.max(4, Math.min(5, Number((product.rating + [0.2, 0.1, 0, -0.1][index % 4]).toFixed(1))));

    return {
      id: `${product.id}-review-${index + 1}`,
      author,
      context,
      text: `${opener} Använder den för ${context.toLowerCase()} och den levererar varje gång. ${detail} ${recommendation}`,
      rating,
    };
  });
};
