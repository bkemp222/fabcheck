import type { ProjectAsset } from "@/types/project";

type MarkupModeProps = {
  asset: ProjectAsset | undefined;
  setIsMarkupMode: (value: boolean) => void;
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
  setIsMarkupMode,
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
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-400">
            Review Canvas
          </p>

          <h1 className="mt-2 text-lg font-black italic uppercase">
            Click anywhere to add a callout
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsMarkupMode(false)}
          className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-bold text-white/70 transition hover:bg-white/10"
        >
          ← Return to Assets
        </button>
      </div>

      <div className="grid flex-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex items-center justify-center rounded-3xl border border-white/10 bg-black p-6">
          <div className="relative cursor-crosshair" onClick={handleCanvasClick}>
            {asset.type.startsWith("image/") ? (
              <img
                src={asset.url}
                alt={asset.name}
                className="max-h-[78vh] max-w-full rounded-2xl object-contain"
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
                  className={`absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-sm font-black text-black shadow-[0_0_30px_rgba(251,146,60,0.6)] transition ${
                    isSelected
                      ? "scale-125 bg-white"
                      : "bg-orange-400 hover:scale-110"
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

        <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-400">
            Callout Editor
          </p>

          {selectedCallout ? (
            <>
              <h2 className="mt-3 text-2xl font-black">
                Callout #{asset.callouts.indexOf(selectedCallout) + 1}
              </h2>

              <label className="mt-6 block text-sm font-bold text-white/70">
                Fabrication note
              </label>

              <textarea
                value={selectedCallout.note}
                onChange={(e) =>
                  updateCallout(asset.id, selectedCallout.id, e.target.value)
                }
                className="mt-2 min-h-40 w-full resize-none rounded-2xl border border-white/10 bg-black/40 p-4 text-white outline-none focus:border-orange-400"
                placeholder="Ex: Make this logo dimensional PVC with painted edges..."
                autoFocus
              />

<div className="mt-4 space-y-3">
  <button
    type="button"
    onClick={() => setSelectedCalloutId(null)}
    className="w-full rounded-full bg-orange-400 px-6 py-4 font-black uppercase italic text-black transition hover:scale-105 hover:bg-orange-300"
  >
    Save Note
  </button>

  <button
  type="button"
  onClick={() => deleteCallout(asset.id, selectedCallout.id)}
  className="w-full rounded-full border border-red-500/30 bg-red-500/10 px-6 py-4 font-black uppercase italic text-red-300 transition hover:bg-red-500/20"
>
  Delete Callout
</button>

  <p className="text-sm text-white/40">
    This note will be included in the FabCheck review package.
  </p>
</div>
            </>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-white/10 p-6 text-white/50">
              Click the image to add a numbered callout.
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}