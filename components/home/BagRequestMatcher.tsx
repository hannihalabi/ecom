"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductGrid";
import { BAG_MATCH_STEPS, analyzeBagRequest } from "@/lib/bagMatch";
import type { Product } from "@/types";

const ANALYSIS_DURATION_MS = 3000;

type Phase = "idle" | "loading" | "done";

type BagRequestMatcherProps = {
  suggestedProducts: Product[];
};

export const BagRequestMatcher = ({
  suggestedProducts,
}: BagRequestMatcherProps) => {
  const [requestValue, setRequestValue] = useState("");
  const [submittedRequest, setSubmittedRequest] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (phase !== "loading") {
      return;
    }

    const startedAt = Date.now();

    const progressTimer = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const ratio = Math.min(1, elapsed / ANALYSIS_DURATION_MS);
      const nextProgress = Math.min(99, Math.round(ratio * 100));
      const nextStep = Math.min(
        BAG_MATCH_STEPS.length - 1,
        Math.floor(ratio * BAG_MATCH_STEPS.length),
      );

      setProgress(nextProgress);
      setActiveStepIndex(nextStep);
    }, 70);

    const completeTimer = window.setTimeout(() => {
      setProgress(100);
      setActiveStepIndex(BAG_MATCH_STEPS.length - 1);
      setPhase("done");
    }, ANALYSIS_DURATION_MS);

    return () => {
      window.clearInterval(progressTimer);
      window.clearTimeout(completeTimer);
    };
  }, [phase]);

  const result = useMemo(() => {
    if (phase !== "done") {
      return null;
    }

    return analyzeBagRequest(submittedRequest);
  }, [phase, submittedRequest]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedRequest = requestValue.trim();
    if (trimmedRequest.length < 6) {
      setErrorMessage("Beskriv gärna väskan med minst 6 tecken.");
      return;
    }

    setErrorMessage(null);
    setSubmittedRequest(trimmedRequest);
    setPhase("loading");
    setProgress(0);
    setActiveStepIndex(0);
  };

  return (
    <section
      id="onskemal"
      className="lux-panel animate-rise px-4 py-6 md:px-8 md:py-8"
    >
      <div className="flex flex-col gap-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--lux-accent-strong)]">
            Önskemålstjänst
          </p>
          <h2 className="lux-title text-2xl leading-tight md:text-3xl">
            Beskriv din drömväska så matchar vi direkt
          </h2>
          <p className="lux-subtitle text-sm md:text-base">
            Skriv stil, färg, storlek eller användningsområde. Vi analyserar och
            visar väskor som passar.
          </p>
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <label htmlFor="bag-request" className="sr-only">
            Beskriv din drömväska
          </label>
          <textarea
            id="bag-request"
            rows={3}
            value={requestValue}
            onChange={(event) => setRequestValue(event.target.value)}
            placeholder="Exempel: En svart axelväska i mediumstorlek för jobb och resa"
            className="w-full rounded-2xl border border-[rgba(163,124,75,0.48)] bg-[rgba(252,245,236,0.92)] px-4 py-3 text-sm text-[var(--lux-ink)] outline-none transition focus:border-[var(--lux-accent-strong)] focus:ring-2 focus:ring-[rgba(166,123,78,0.2)]"
          />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={phase === "loading"}
              className="rounded-full border border-[rgba(163,124,75,0.5)] bg-[var(--lux-dark)] px-5 py-2.5 text-sm font-semibold text-[rgba(251,239,221,0.96)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {phase === "loading" ? "Analyserar..." : "Analysera önskemål"}
            </button>
            {errorMessage && (
              <p className="text-sm text-[var(--lux-accent-strong)]">{errorMessage}</p>
            )}
          </div>
        </form>

        {phase === "loading" && (
          <div className="rounded-2xl border border-[rgba(163,124,75,0.42)] bg-[rgba(248,238,223,0.76)] p-4">
            <div
              className="h-2 overflow-hidden rounded-full bg-[rgba(163,124,75,0.24)]"
              role="progressbar"
              aria-label="Analysstatus"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--lux-accent),var(--lux-gold))] transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-sm font-medium text-[var(--lux-muted)]">
              {progress}% klart
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              {BAG_MATCH_STEPS.map((step, index) => {
                const isActive = index <= activeStepIndex;
                return (
                  <li
                    key={step}
                    className={isActive ? "text-[var(--lux-ink)]" : "text-[var(--lux-muted)]"}
                  >
                    {isActive ? "●" : "○"} {step}...
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {phase === "done" && result && (
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-[rgba(163,124,75,0.5)] bg-[linear-gradient(160deg,rgba(248,238,223,0.9),rgba(240,223,195,0.82))] p-4 md:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--lux-accent-strong)]">
                Resultat klart
              </p>
              <h3 className="mt-1 text-xl [font-family:var(--font-display)] text-[var(--lux-ink)] md:text-2xl">
                {result.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--lux-muted)] md:text-base">
                {result.message}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full border border-[rgba(163,124,75,0.48)] bg-[rgba(255,249,240,0.65)] px-3 py-1.5 font-medium text-[var(--lux-ink)]">
                  Matchningsgrad: {result.confidence}%
                </span>
                <span className="rounded-full border border-[rgba(163,124,75,0.48)] bg-[rgba(255,249,240,0.65)] px-3 py-1.5 font-medium text-[var(--lux-ink)]">
                  Leverans: 2-4 vardagar
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href="/search"
                  className="rounded-full border border-[rgba(163,124,75,0.5)] bg-[var(--lux-dark)] px-4 py-2 text-sm font-semibold text-[rgba(251,239,221,0.96)]"
                >
                  Se fler rekommendationer
                </Link>
                <Link
                  href="/cart"
                  className="rounded-full border border-[rgba(163,124,75,0.5)] bg-[rgba(255,249,240,0.85)] px-4 py-2 text-sm font-semibold text-[var(--lux-accent-strong)]"
                >
                  Gå till varukorgen
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-xl [font-family:var(--font-display)] text-[var(--lux-ink)] md:text-2xl">
                Rekommenderade väskor för dig
              </h3>
              <ProductGrid products={suggestedProducts} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
