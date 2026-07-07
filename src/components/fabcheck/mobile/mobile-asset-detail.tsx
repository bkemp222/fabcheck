"use client";

import type { ProjectAsset } from "@/types/project";
import { MobileHeader } from "./mobile-header";

type MobileAssetDetailProps = {
asset: ProjectAsset;
  goBack: () => void;
  editMarkup: () => void;
};

export function MobileAssetDetail({
  asset,
  goBack,
  editMarkup,
}: MobileAssetDetailProps) {
  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-[#F5F2EC] animate-[fadeIn_.25s_ease] pb-28">
  <div className="mx-auto max-w-md space-y-6 p-5">

      <button
        onClick={goBack}
        className="text-sm font-black uppercase tracking-[0.2em] text-orange-500"
      >
        ← Assets
      </button>

      <div>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-500">
          Asset
        </p>

<h1 className="mt-1 break-words text-lg font-black leading-tight">
  {asset.name}
</h1>
      </div>

{asset.type.startsWith("image/") && (
  <div className="overflow-hidden rounded-3xl bg-white p-3 shadow-sm">
    <div className="relative inline-block w-full">
      <img src={asset.url} alt={asset.name} className="block w-full" />

      {asset.callouts.map((callout, index) => (
        <div
          key={callout.id}
          className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-orange-500 text-sm font-black text-black shadow-md"
          style={{
            left: `${callout.x}%`,
            top: `${callout.y}%`,
          }}
        >
          {index + 1}
        </div>
      ))}
    </div>
  </div>
)}

      <div className="rounded-3xl bg-white p-5 shadow-sm">

        <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400">
          Callouts
        </p>

        <p className="mt-2 text-3xl font-black">
          {asset.callouts.length}
        </p>

      </div>

      <div className="space-y-4">

        {asset.callouts.map((callout, index) => (

          <div
            key={callout.id}
            className="rounded-3xl bg-white p-5 shadow-sm"
          >
            <p className="font-black">
              Callout {index + 1}
            </p>

            <p className="mt-2 text-zinc-600">
              {callout.note || "No note entered."}
            </p>

          </div>

        ))}

      </div>

      <button
        onClick={editMarkup}
        className="w-full rounded-full bg-orange-500 py-4 text-lg font-black uppercase"
      >
        Edit Markup
      </button>

    </div>
    </div>
  );
}