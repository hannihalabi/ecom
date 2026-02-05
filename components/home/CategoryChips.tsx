import Link from "next/link";

export const CategoryChips = ({ categories }: { categories: string[] }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Link
          key={category}
          href={`/search?q=${encodeURIComponent(category)}`}
          className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600"
        >
          {category}
        </Link>
      ))}
    </div>
  );
};
