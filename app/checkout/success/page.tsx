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
  return (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-10 md:px-6">
      <CheckoutSuccessClient sessionId={params?.session_id} />
    </div>
  );
}
