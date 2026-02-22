import { CheckoutSuccessClient } from "@/components/checkout/CheckoutSuccessClient";

export const metadata = {
  title: "Betalning slutförd",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams?: Promise<{ session_id?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  return <CheckoutSuccessClient sessionId={params?.session_id} />;
}
