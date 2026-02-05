import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white/80 p-10 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">Sidan hittades inte</h1>
      <p className="text-sm text-slate-600">
        Vi kunde inte hitta sidan. Prova en ny sökning eller gå tillbaka till startsidan.
      </p>
      <Link
        href="/"
        className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
      >
        Till startsidan
      </Link>
    </div>
  );
}
