"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PriceBlock } from "@/components/product/PriceBlock";
import { Badge } from "@/components/shared/Badge";
import { Rating } from "@/components/shared/Rating";
import { DealCountdown } from "@/components/product/DealCountdown";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import type { Product } from "@/types";

export const ProductCard = ({ product }: { product: Product }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const imageCount = product.images.length;

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
    <div className="flex h-full flex-col justify-between border border-slate-200 bg-white/90 p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Link href={`/p/${product.slug}`} aria-label={product.title}>
            <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
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
                className="absolute left-1.5 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/35 text-[11px] font-medium text-white backdrop-blur-sm transition hover:bg-slate-900/55"
              >
                ←
              </button>
              <button
                type="button"
                onClick={onNextImage}
                aria-label="Nästa bild"
                className="absolute right-1.5 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/35 text-[11px] font-medium text-white backdrop-blur-sm transition hover:bg-slate-900/55"
              >
                →
              </button>
              <div className="absolute bottom-1.5 right-1.5 z-10 rounded-full bg-slate-900/45 px-1.5 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
                {activeImageIndex + 1}/{imageCount}
              </div>
            </>
          )}
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {product.badges?.map((badge) => (
              <Badge key={badge} label={badge} variant="dark" />
            ))}
            {product.stock <= 10 && (
              <Badge label={`Endast ${product.stock} kvar`} variant="light" />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Link href={`/p/${product.slug}`} className="text-sm font-semibold">
            {product.title}
          </Link>
          <PriceBlock
            priceOriginal={product.priceOriginal}
            priceDiscounted={product.priceDiscounted}
            discountPercent={product.discountPercent}
          />
          <Rating rating={product.rating} count={product.reviewCount} compact />
          {product.isFlashDeal && product.flashDealEndsAt && (
            <DealCountdown endsAt={product.flashDealEndsAt} />
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        <AddToCartButton productId={product.id} />
        <Link
          href={`/p/${product.slug}`}
          className="text-center text-xs font-semibold text-rose-600"
        >
          Läs mer
        </Link>
      </div>
    </div>
  );
};
