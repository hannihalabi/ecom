export const formatMoney = (value: number, currency = "SEK") =>
  new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);

export const formatPercent = (value: number) => `${Math.round(value)}%`;

export const formatRating = (rating: number) => rating.toFixed(1);
