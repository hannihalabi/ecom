import { CartPage } from "@/components/cart/CartPage";

export const metadata = {
  title: "Varukorg",
};

export default function Cart() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-slate-900">Din varukorg</h1>
      <CartPage />
    </div>
  );
}
