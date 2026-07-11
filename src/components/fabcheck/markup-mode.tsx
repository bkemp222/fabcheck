import type { ProjectAsset } from "@/types/project";

type MarkupModeProps = {
  asset: ProjectAsset | undefined;
  goDone: () => void;
  addCallout: (assetId: string, x: number, y: number) => string;
  selectedCalloutId: string | null;
  setSelectedCalloutId: React.Dispatch<React.SetStateAction<string | null>>;
  updateCallout: (
    assetId: string,
    calloutId: string,
    note: string
  ) => void;
  deleteCallout: (assetId: string, calloutId: string) => void;
};

export function MarkupMode({
  asset,
  goDone,
  addCallout,
  selectedCalloutId,
  setSelectedCalloutId,
  updateCallout,
  deleteCallout,
}: MarkupModeProps) {
  if (!asset) return null;

  const selectedCallout = asset.callouts.find(
    (callout) => callout.id === selectedCalloutId
  );

  function handleCanvasClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!asset) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newCalloutId = addCallout(asset.id, x, y);
    setSelectedCalloutId(newCalloutId);
  }

  return (
    <section className="flex min-h-screen flex-col bg-[#080808] p-8 text-white">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-400">
            Markup
          </p>

          <h1 className="mt-2 text-2xl font-black italic uppercase tracking-tight">
            Review starter pins
          </h1>
          <p className="mt-1 text-sm text-white/45">
            Edit FabCheck notes, delete anything that is off, or click the image
            to add your own pins.
          </p>
        </div>

        <button
          type="button"
          onClick={goDone}
          className="rounded-lg bg-[#ffa431] px-5 py-3 text-sm font-black uppercase italic text-black transition hover:bg-[#ffb14c] active:scale-[0.99]"
        >
          Done
        </button>
      </div>

      <div className="grid flex-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex items-center justify-center rounded-xl border border-white/10 bg-black p-5">
          <div className="relative cursor-crosshair" onClick={handleCanvasClick}>
            {asset.type.startsWith("image/") ? (
              <img
                src={asset.url}
                alt={asset.name}
                className="max-h-[78vh] max-w-full rounded-xl object-contain"
              />
            ) : (
              <div className="flex h-[70vh] w-full items-center justify-center text-white/40">
                File preview unavailable
              </div>
            )}

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
                  className={`absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-sm font-black text-black shadow-[0_0_30px_rgba(251,146,60,0.45)] transition ${
                    isSelected
                      ? "scale-125 bg-white"
                      : callout.source === "ai"
                      ? "bg-orange-400 hover:scale-110"
                      : "bg-sky-300 hover:scale-110"
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
          </div>
        </div>

        <aside className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-400">
            Notes
          </p>

          {selectedCallout ? (
            <>
              <h2 className="mt-3 text-xl font-black">
                {selectedCallout.source === "ai" ? "FabCheck note" : "Your note"} #
                {asset.callouts.indexOf(selectedCallout) + 1}
              </h2>

              <textarea
                value={selectedCallout.note}
                onChange={(e) =>
                  updateCallout(asset.id, selectedCallout.id, e.target.value)
                }
                className="mt-4 min-h-36 w-full resize-none rounded-lg border border-white/10 bg-black/40 p-3 text-sm text-white outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/10"
                placeholder="Type note..."
                autoFocus
              />

<div className="mt-4 space-y-3">
  <button
    type="button"
    onClick={() => setSelectedCalloutId(null)}
    className="w-full rounded-lg bg-orange-400 px-5 py-3 text-sm font-black uppercase italic text-black transition hover:bg-orange-300 active:scale-[0.99]"
  >
    Save Note
  </button>

  <button
  type="button"
  onClick={() => {
    deleteCallout(asset.id, selectedCallout.id);
    setSelectedCalloutId(null);
  }}
  className="w-full rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-black uppercase italic text-red-300 transition hover:bg-red-500/20"
>
  Delete Callout
</button>

  <p className="text-xs leading-5 text-white/40">
    This note will be included with the formal estimate request.
  </p>
</div>
            </>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-white/10 p-4 text-sm leading-6 text-white/50">
              Click the image to add a numbered callout.
            </div>
          )}

          <div className="mt-5 space-y-2">
            {asset.callouts.map((callout, index) => (
              <button
                key={callout.id}
                type="button"
                onClick={() => setSelectedCalloutId(callout.id)}
                className={`w-full rounded-xl border p-3 text-left transition ${
                  callout.id === selectedCalloutId
                    ? "border-orange-400 bg-orange-400/10"
                    : "border-white/10 bg-white/5 hover:bg-white/[0.08]"
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
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/75">
                  {callout.note || "No note yet."}
                </p>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
