import Image from "next/image";

type ProductGalleryProps = {
  title: string;
  images: string[];
};

export const ProductGallery = ({ title, images }: ProductGalleryProps) => {
  const [primary, ...rest] = images;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100">
        <Image
          src={primary}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
      {rest.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {rest.map((image) => (
            <div
              key={image}
              className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100"
            >
              <Image
                src={image}
                alt={`${title} förhandsvisning`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
