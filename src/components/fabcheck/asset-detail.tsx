import type { ProjectAsset } from "@/types/project";

type AssetDetailProps = {
  asset: ProjectAsset | undefined;
  setIsMarkupMode: (value: boolean) => void;
  deleteAsset: (assetId: string) => void;
};

export function AssetDetail({
  asset,
  setIsMarkupMode,
  deleteAsset,
}: AssetDetailProps) {
  if (!asset) return null;

  return (
    <div className="mx-auto mt-8 max-w-5xl rounded-3xl border-zinc-200 bg-white shadow-sm p-6">
      <div className="grid gap-6 md:grid-cols-[1fr_280px]">
        <div className="overflow-hidden rounded-2xl bg-zinc-100">
{asset.type.startsWith("image/") ? (
  <div className="flex justify-center rounded-2xl bg-zinc-100 p-4">
    <div className="relative inline-block">
      <img
        src={asset.url}
        alt={asset.name}
        className="block max-h-[520px] w-auto max-w-full rounded-2xl"
      />

      {asset.callouts.map((callout, index) => (
        <div
          key={callout.id}
          className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-orange-400 font-black text-black shadow-md"
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
) : (
            <div className="flex h-80 items-center justify-center text-white/40">
              File preview unavailable
            </div>
          )}
        </div>

        <aside>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-400">
            Selected Asset
          </p>

          <h3 className="mt-3 break-words text-xl font-black">{asset.name}</h3>

          <div className="mt-6 space-y-3 text-sm text-zinc-500">
            <p>
              <span className="font-bold text-zinc-800">Type:</span>{" "}
              {asset.type || "Unknown"}
            </p>

            <p>
              <span className="font-bold text-zinc-800">Callouts:</span>{" "}
              {asset.callouts.length}
            </p>

            {asset.isHero && (
              <p className="font-bold uppercase tracking-[0.18em] text-orange-400">
                Hero Asset
              </p>
            )}
          </div>

<button
  type="button"
  onClick={() => setIsMarkupMode(true)}
  className="mt-8 w-full rounded-full bg-orange-400 px-6 py-4 font-black uppercase italic text-black transition hover:scale-105 hover:bg-orange-300"
>
  Review & Markup →
</button>
<button
  type="button"
  onClick={() => deleteAsset(asset.id)}
  className="mt-3 w-full rounded-full border border-red-200 bg-red-50 px-6 py-4 font-black uppercase italic text-red-600 transition hover:bg-red-100"
>
  Delete Asset
</button>
        </aside>
      </div>
    </div>
  );
}