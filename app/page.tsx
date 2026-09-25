import { HeroSearch } from "@/components/home/HeroSearch";
import { products } from "@/data/products";

export default function Home() {
  return <HeroSearch products={products} />;
}
