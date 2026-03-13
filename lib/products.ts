import { products } from "@/data/products";
import { Product } from "@/types";

const normalizeSearchValue = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

export const getAllProducts = () => products;

export const getProductBySlug = (slug: string) =>
  products.find((product) => product.slug === slug);

export const getCategories = () =>
  Array.from(new Set(products.map((product) => product.category))).sort();

export const getFlashDeals = () => products.filter((product) => product.isFlashDeal);

export const getTrending = () =>
  [...products]
    .sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount)
    .slice(0, 8);

export const getUnderPrice = (price: number) =>
  products.filter((product) => product.priceDiscounted <= price).slice(0, 8);

export const getForYou = () =>
  [...products].sort(() => 0.5 - Math.random()).slice(0, 8);

export const getRelatedProducts = (product: Product, limit = 6) => {
  const withScores = products
    .filter((item) => item.id !== product.id)
    .map((item) => {
      const sameCategory = item.category === product.category ? 2 : 0;
      const tagOverlap = item.tags.filter((tag) => product.tags.includes(tag)).length;
      return { item, score: sameCategory + tagOverlap };
    })
    .sort((a, b) => b.score - a.score);

  return withScores.slice(0, limit).map((entry) => entry.item);
};

export const getPaginated = (page: number, perPage: number) => {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const items = products.slice(start, end);
  const totalPages = Math.max(1, Math.ceil(products.length / perPage));
  return { items, totalPages };
};

export const searchCatalogProducts = (query: string, limit = 6) => {
  const normalizedQuery = normalizeSearchValue(query);
  if (!normalizedQuery) return [];

  const queryTerms = normalizedQuery.split(" ").filter(Boolean);

  return [...products]
    .map((product) => {
      const title = normalizeSearchValue(product.title);
      const tags = product.tags.map(normalizeSearchValue);
      const category = normalizeSearchValue(product.category);

      let score = 0;

      if (title.includes(normalizedQuery)) score += 12;
      if (category.includes(normalizedQuery)) score += 5;

      score += queryTerms.reduce((sum, term) => {
        let termScore = 0;
        if (title.includes(term)) termScore += 4;
        if (category.includes(term)) termScore += 2;
        if (tags.some((tag) => tag.includes(term))) termScore += 2;
        return sum + termScore;
      }, 0);

      return { product, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.product.reviewCount - a.product.reviewCount;
    })
    .slice(0, limit)
    .map(({ product }) => product);
};
