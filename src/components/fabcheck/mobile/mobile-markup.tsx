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
  const aiCalloutCount = asset.callouts.filter(
    (callout) => callout.source === "ai"
  ).length;

  function handleImageClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newCalloutId = addCallout(asset.id, x, y);
    setSelectedCalloutId(newCalloutId);
  }

  return (
    <div className="mobile-page-enter fixed inset-0 z-50 flex flex-col bg-[#0b0b0b] text-white md:hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <button
          type="button"
          onClick={goDone}
          className="rounded-lg px-2 py-1 text-xs font-black uppercase tracking-[0.18em] text-orange-400 transition hover:bg-white/5 active:scale-95"
        >
          Done
        </button>

        <div className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-white/40">
            Markup
          </p>
          <p className="max-w-36 truncate text-sm font-black">{asset.name}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-auto p-3">
        {asset.aiReviewError ? (
          <div className="mb-3 rounded-xl border border-red-400/30 bg-red-400/10 p-3">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-300">
              Review setup needed
            </p>
            <p className="mt-2 text-sm font-black text-white">
              The image uploaded, but the first-pass review did not run.
            </p>
            <p className="mt-2 text-sm leading-5 text-white/65">
              {asset.aiReviewError === "Missing OPENAI_API_KEY"
                ? "Add the review key to the local app, restart the preview, then upload again."
                : asset.aiReviewError}
            </p>
          </div>

        ) : asset.aiReview ? (
          <>
          <div className="mb-3 rounded-xl border border-orange-400/25 bg-orange-400/10 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-400">
                  FabCheck Summary
                </p>
                <p className="mt-1 text-sm font-black text-white">
                  {asset.aiReview.projectType}
                </p>
              </div>
              <p className="shrink-0 rounded-md bg-white/10 px-2.5 py-1 text-xs font-black text-white/70">
                {aiCalloutCount} pins
              </p>
            </div>

            <p className="mt-2 text-xs leading-5 text-white/70">
              {asset.aiReview.summary ||
                "Review the starter pins, edit anything that is off, or tap the image to add your own notes."}
            </p>
          </div>
          
          <p className="mb-3 text-sm leading-6 text-white/70">
  Review the suggested pins and edit anything that needs clarification. Tap
  anywhere on the image to add your own note.
</p>
</>

        ) : (
          <div className="mb-3 rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-sm font-bold text-white">
              Tap anywhere on your image to add a note.
            </p>
            <p className="mt-1 text-xs leading-5 text-white/60">
              Starter notes were not added for this file, but you can still place
              your own pins.
            </p>
          </div>
        )}

        <div className="flex flex-1 items-center justify-center">
  <div
    className="relative inline-block"
    onClick={handleImageClick}
  >
            <img
              src={asset.url}
              alt={asset.name}
            className="block max-h-[64vh] max-w-full rounded-xl"
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
                className={`absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-xs font-black text-black shadow-md transition duration-150 ${
                  isSelected
                    ? "scale-125 bg-white"
                    : callout.source === "ai"
                    ? "bg-orange-400"
                    : "bg-sky-300"
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
    className={`absolute z-[999] w-[min(15rem,calc(100vw-2rem))] rounded-xl border border-white/10 bg-[#141212] p-3 shadow-2xl ${
  selectedCallout.x > 55
    ? "-translate-x-full"
    : "translate-x-4"
}`}
style={{
  left: `${selectedCallout.x}%`,
  top: `${Math.min(selectedCallout.y + 4, 60)}%`,
}}
  >
    <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-400">
      {selectedCallout.source === "ai" ? "FabCheck note" : "Your note"} #
      {asset.callouts.indexOf(selectedCallout) + 1}
    </p>

    <textarea
      value={selectedCallout.note}
      onChange={(e) =>
        updateCallout(asset.id, selectedCallout.id, e.target.value)
      }
      className="mt-2 min-h-20 w-full resize-none rounded-lg border border-white/10 bg-black/40 p-2.5 text-sm text-white outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10"
      placeholder="Type note..."
    />

    <button
      type="button"
      onClick={() => setSelectedCalloutId(null)}
      className="mt-2 w-full rounded-lg bg-orange-400 py-2.5 text-sm font-black uppercase italic text-black transition hover:bg-orange-300 active:scale-[0.99]"
    >
      Save Note
    </button>
    <button
  type="button"
  onClick={() => {
    deleteCallout(asset.id, selectedCallout.id);
    setSelectedCalloutId(null);
  }}
  className="mt-3 w-full text-center text-sm font-bold text-red-400 transition hover:text-red-300"
>
  Delete Callout
</button>
  </div>
)}
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
          Notes
        </p>

        {asset.callouts.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/60">
            No pins yet. Tap the image to add one.
          </div>
        ) : (
          asset.callouts.map((callout, index) => (
            <button
              key={callout.id}
              type="button"
              onClick={() => setSelectedCalloutId(callout.id)}
              className={`w-full rounded-xl border p-3 text-left transition duration-150 ${
                callout.id === selectedCalloutId
                  ? "border-orange-400 bg-orange-400/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black text-black ${
                    callout.source === "ai" ? "bg-orange-400" : "bg-sky-300"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="text-xs font-black uppercase tracking-[0.16em] text-white/40">
                  {callout.source === "ai" ? "FabCheck suggested" : "Added by you"}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-white/80">
                {callout.note || "No note yet."}
              </p>
            </button>
          ))
        )}
      </div>

    </div>
    </div>
  );
}
