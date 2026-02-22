import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { TrackView } from "@/components/product/TrackView";
import { Badge } from "@/components/shared/Badge";
import { Rating } from "@/components/shared/Rating";
import { ProductGrid } from "@/components/product/ProductGrid";
import { products } from "@/data/products";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { getReviewCountPreview, getReviewSnippets } from "@/lib/reviews";

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return { title: "Produkten hittades inte" };
  }

  return {
    title: product.title,
    description: product.description.short,
    openGraph: {
      title: product.title,
      description: product.description.short,
      images: product.images.map((image) => ({ url: image })),
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product, 6);
  const reviewCountPreview = getReviewCountPreview(product.id);
  const reviewSnippets = getReviewSnippets(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images,
    description: product.description.short,
    sku: product.id,
    offers: {
      "@type": "Offer",
      priceCurrency: "SEK",
      price: product.priceDiscounted,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  return (
    <div className="flex flex-col gap-10">
      <TrackView productId={product.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <ProductGallery title={product.title} images={product.images} />
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              {product.badges?.map((badge) => (
                <Badge key={badge} label={badge} variant="dark" />
              ))}
              {product.stock <= 10 && (
                <Badge label={`Endast ${product.stock} kvar`} variant="light" />
              )}
            </div>
            <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
              {product.title}
            </h1>
            <p className="text-sm text-slate-600">{product.description.short}</p>
            <Rating
              rating={product.rating}
              count={reviewCountPreview}
              countHref="#recensioner"
            />
          </div>

          <ProductPurchasePanel product={product} />

          <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-600">
            <h3 className="font-semibold text-slate-900">Därför gillar kunder den</h3>
            <ul className="mt-2 space-y-2">
              <li>Snabb hantering med spårbara leveransuppdateringar.</li>
              <li>30 dagars retur för oanvända produkter.</li>
              <li>Tydlig prissättning med riktiga rabatter.</li>
            </ul>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Detaljer</h2>
        <div className="mt-3 space-y-4 text-sm text-slate-600">
          <p>{product.description.long}</p>
          <details className="rounded-xl border border-slate-200 bg-white px-4 py-3">
            <summary className="cursor-pointer text-sm font-semibold text-slate-800">
              Läs mer
            </summary>
            <p className="mt-2 text-sm text-slate-600">
              Beräknad leverans: {product.shipping.etaDaysMin}-
              {product.shipping.etaDaysMax} dagar. Returer accepteras inom 30 dagar
              efter leverans.
            </p>
          </details>
        </div>
      </section>

      <section
        id="recensioner"
        className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm scroll-mt-24"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Recensioner</h2>
          <span className="text-xs text-slate-600">
            {reviewCountPreview} verifierade omdömen
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-600">
          Korta kommentarer från kunder som köpt och rekommenderat produkten i olika
          sammanhang.
        </p>
        <div className="mt-4 space-y-3">
          {reviewSnippets.map((review) => (
            <article
              key={review.id}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">{review.author}</p>
                <span className="text-xs text-emerald-700">Verifierat köp</span>
              </div>
              <p className="mt-1 text-xs uppercase tracking-[0.08em] text-slate-500">
                {review.context}
              </p>
              <p className="mt-2 text-sm text-slate-700">{review.text}</p>
              <p className="mt-2 text-xs font-semibold text-amber-700">
                {"★".repeat(Math.round(review.rating))}
                <span className="text-slate-400">
                  {"☆".repeat(Math.max(0, 5 - Math.round(review.rating)))}
                </span>{" "}
                {review.rating.toFixed(1)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-slate-900">Du kanske också gillar</h2>
        <ProductGrid products={related} />
      </section>
    </div>
  );
}
