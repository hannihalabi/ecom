"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PriceBlock } from "@/components/product/PriceBlock";
import { Badge } from "@/components/shared/Badge";
import { Rating } from "@/components/shared/Rating";
import { DealCountdown } from "@/components/product/DealCountdown";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { getReviewCountPreview } from "@/lib/reviews";
import type { Product } from "@/types";

const LOW_STOCK_BADGE_SLUG = "lv-speedy-trunk-20-i-monogram-canvas-brown";

export const ProductCard = ({ product }: { product: Product }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const imageCount = product.images.length;
  const reviewCountPreview = getReviewCountPreview(product.id);
  const showLowStockBadge =
    product.slug === LOW_STOCK_BADGE_SLUG && product.stock <= 10;

  const onPrevImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + imageCount) % imageCount);
  };

  const onNextImage = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % imageCount);
  };

  return (
    <div className="flex h-full flex-col justify-between overflow-hidden border border-[rgba(163,124,75,0.45)] bg-[linear-gradient(170deg,rgba(250,242,230,0.96),rgba(241,227,205,0.92))] p-3 shadow-[0_12px_24px_rgba(44,29,12,0.14)]">
      <div className="flex flex-col gap-3">
        <div className="relative overflow-hidden border border-[rgba(163,124,75,0.35)]">
          <Link href={`/p/${product.slug}`} aria-label={product.title}>
            <div className="relative aspect-square w-full overflow-hidden bg-[rgba(229,209,180,0.35)]">
              <Image
                src={product.images[activeImageIndex]}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          </Link>
          {imageCount > 1 && (
            <>
              <button
                type="button"
                onClick={onPrevImage}
                aria-label="Föregående bild"
                className="absolute left-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(227,198,155,0.55)] bg-[rgba(28,18,10,0.56)] text-xs font-medium text-[rgba(248,230,198,0.94)] backdrop-blur-sm"
              >
                ←
              </button>
              <button
                type="button"
                onClick={onNextImage}
                aria-label="Nästa bild"
                className="absolute right-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(227,198,155,0.55)] bg-[rgba(28,18,10,0.56)] text-xs font-medium text-[rgba(248,230,198,0.94)] backdrop-blur-sm"
              >
                →
              </button>
              <div className="absolute bottom-2 right-2 z-10 rounded-full border border-[rgba(210,169,116,0.6)] bg-[rgba(28,18,10,0.62)] px-2 py-0.5 text-[10px] font-medium text-[rgba(245,224,191,0.96)] backdrop-blur-sm">
                {activeImageIndex + 1}/{imageCount}
              </div>
            </>
          )}
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {product.badges?.map((badge) => (
              <Badge key={badge} label={badge} variant="dark" />
            ))}
            {showLowStockBadge && (
              <Badge label={`Endast ${product.stock} kvar`} variant="light" />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Link
            href={`/p/${product.slug}`}
            className="[font-family:var(--font-display)] min-h-[7rem] text-[1.35rem] leading-[1.05] text-[var(--lux-ink)] md:min-h-[4.8rem] md:text-[1.5rem]"
          >
            {product.title}
          </Link>
          <PriceBlock
            priceOriginal={product.priceOriginal}
            priceDiscounted={product.priceDiscounted}
            discountPercent={product.discountPercent}
          />
          <Rating
            rating={product.rating}
            count={reviewCountPreview}
            compact
            showCount
            countHref={`/p/${product.slug}#recensioner`}
          />
          {product.isFlashDeal && product.flashDealEndsAt && (
            <DealCountdown endsAt={product.flashDealEndsAt} />
          )}
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 border-t border-[rgba(163,124,75,0.35)] pt-3">
        <AddToCartButton productId={product.id} />
        <Link
          href={`/p/${product.slug}`}
          className="text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--lux-accent-strong)]"
        >
          Visa detaljer
        </Link>
      </div>
    </div>
  );
};
