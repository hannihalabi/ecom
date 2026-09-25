import { CheckoutRedirectClient } from "@/components/checkout/CheckoutRedirectClient";
import { getWebsiteOfferById, type WebsiteOfferId } from "@/lib/websiteOffers";

export const metadata = {
  title: "Kassa",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams?: Promise<{
    offer?: string;
    promo?: string;
  }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const websiteOfferId = getWebsiteOfferById(params?.offer)?.id as
    | WebsiteOfferId
    | undefined;
  const websitePromotionCode = params?.promo?.trim() || undefined;

  return (
    <div className="mx-auto min-h-[calc(100svh-4rem)] max-w-3xl px-4 py-10 md:px-6">
      <CheckoutRedirectClient
        websiteOfferId={websiteOfferId}
        websitePromotionCode={websitePromotionCode}
      />
    </div>
  );
}
