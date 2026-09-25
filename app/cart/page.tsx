import { CartPage } from "@/components/cart/CartPage";

export const metadata = {
  title: "Varukorg",
};

export default function Cart() {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-10 md:px-6">
      <h1 className="text-2xl font-semibold text-slate-900">Din varukorg</h1>
      <CartPage />
    </div>
  );
}
