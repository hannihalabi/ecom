export const WEBSITE_OFFERS = [
  {
    id: "offer-2599",
    price: 2599,
    title: "Handgjord vaska",
    description: "Prisniva 2599 kr",
  },
  {
    id: "offer-2899",
    price: 2899,
    title: "Handgjord vaska",
    description: "Prisniva 2899 kr",
  },
  {
    id: "offer-3499",
    price: 3499,
    title: "Handgjord vaska",
    description: "Prisniva 3499 kr",
  },
] as const;

export type WebsiteOfferId = (typeof WEBSITE_OFFERS)[number]["id"];

export const getWebsiteOfferById = (offerId?: string | null) =>
  WEBSITE_OFFERS.find((offer) => offer.id === offerId);
