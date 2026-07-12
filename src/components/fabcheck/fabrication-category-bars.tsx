"use client";

import {
  FABRICATION_CATEGORIES,
  FABRICATION_CATEGORY_LABELS,
  normalizeFabricationProfile,
} from "@/data/fabrication-profile";
import type { FabricationCategoryProfile } from "@/types/project";

type FabricationCategoryBarsProps = {
  profile?: FabricationCategoryProfile;
  primaryCostDrivers?: string[];
};

export function FabricationCategoryBars({
  profile,
  primaryCostDrivers = [],
}: FabricationCategoryBarsProps) {
  const normalizedProfile = normalizeFabricationProfile(profile);

  return (
    <section className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
      <div className="space-y-3">
        {FABRICATION_CATEGORIES.map((category, index) => {
          const score = normalizedProfile[category];
          const percentage = `${score * 10}%`;

          return (
            <div key={category} className="grid gap-1.5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">
                  {FABRICATION_CATEGORY_LABELS[category]}
                </span>
                <span className="text-[11px] font-black tabular-nums text-zinc-400">
                  {score}/10
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="fabrication-score-bar h-full origin-left rounded-full bg-[#ffa431]"
                  style={{
                    width: percentage,
                    animationDelay: `${index * 35}ms`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {primaryCostDrivers.length > 0 ? (
        <div className="mt-4 border-t border-zinc-100 pt-3">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-400">
            Primary Cost Drivers
          </p>
          <p className="mt-1 text-sm font-semibold leading-5 text-zinc-700">
            {primaryCostDrivers.slice(0, 4).join(", ")}
          </p>
        </div>
      ) : null}
    </section>
  );
}
