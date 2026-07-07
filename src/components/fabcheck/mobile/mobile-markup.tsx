"use client";

import type { ProjectAsset } from "@/types/project";

type MobileMarkupProps = {
  asset: ProjectAsset;
  addCallout: (assetId: string, x: number, y: number) => string;
  selectedCalloutId: string | null;
  setSelectedCalloutId: React.Dispatch<React.SetStateAction<string | null>>;
  updateCallout: (
    assetId: string,
    calloutId: string,
    note: string
  ) => void;
  goDone: () => void;
  deleteCallout: (assetId: string, calloutId: string) => void;
};

export function MobileMarkup({
  asset,
  addCallout,
  selectedCalloutId,
  setSelectedCalloutId,
  updateCallout,
  goDone,
  deleteCallout,
}: MobileMarkupProps) {
  const selectedCallout = asset.callouts.find(
    (callout) => callout.id === selectedCalloutId
  );

  function handleImageClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newCalloutId = addCallout(asset.id, x, y);
    setSelectedCalloutId(newCalloutId);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0b0b0b] text-white md:hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
        <button
          type="button"
          onClick={goDone}
          className="text-sm font-black uppercase tracking-[0.2em] text-orange-400"
        >
          ← Done
        </button>

        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/50">
          Tap image to add pin
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-auto p-4">
        <div className="relative inline-block" onClick={handleImageClick}>
          <img
            src={asset.url}
            alt={asset.name}
            className="block max-h-[68vh] max-w-full rounded-2xl"
          />

          {asset.callouts.map((callout, index) => {
            const isSelected = callout.id === selectedCalloutId;

            return (
              <button
                key={callout.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCalloutId(callout.id);
                }}
                className={`absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-sm font-black text-black shadow-md transition ${
                  isSelected ? "scale-125 bg-white" : "bg-orange-400"
                }`}
                style={{
                  left: `${callout.x}%`,
                  top: `${callout.y}%`,
                }}
              >
                {index + 1}
              </button>
            );
          })}
          {selectedCallout && (
  <div
    onClick={(e) => e.stopPropagation()}
    className="absolute z-[999] w-64 rounded-2xl border border-white/10 bg-[#141212] p-4 shadow-2xl"
    style={{
      left: `${Math.min(selectedCallout.x + 5, 55)}%`,
      top: `${Math.min(selectedCallout.y + 5, 55)}%`,
    }}
  >
    <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-400">
      Callout #{asset.callouts.indexOf(selectedCallout) + 1}
    </p>

    <textarea
      value={selectedCallout.note}
      onChange={(e) =>
        updateCallout(asset.id, selectedCallout.id, e.target.value)
      }
      className="mt-3 min-h-24 w-full resize-none rounded-xl border border-white/10 bg-black/40 p-3 text-sm text-white outline-none focus:border-orange-400"
      placeholder="Type note..."
    />

    <button
      type="button"
      onClick={() => setSelectedCalloutId(null)}
      className="mt-3 w-full rounded-full bg-orange-400 py-3 text-sm font-black uppercase italic text-black"
    >
      Save Note
    </button>
  </div>
)}
        </div>
      </div>


    </div>
  );
}