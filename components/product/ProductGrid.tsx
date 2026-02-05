import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types";

export const ProductGrid = ({ products }: { products: Product[] }) => {
  return (
    <div className="grid grid-cols-2 gap-0 md:grid-cols-4 md:gap-3 -mx-4 md:mx-0">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
