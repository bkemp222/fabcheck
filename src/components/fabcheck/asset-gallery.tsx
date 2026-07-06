import type { ProjectAsset } from "@/types/project";

type AssetGalleryProps = {
  assets: ProjectAsset[];
  selectedAssetId: string | null;
  setSelectedAssetId: (id: string) => void;
};

export function AssetGallery({
  assets,
  selectedAssetId,
  setSelectedAssetId,
}: AssetGalleryProps) {
  if (assets.length === 0) return null;

  return (
    <div className="mx-auto mt-8 max-w-5xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-black">Uploaded Assets</h3>
        <p className="text-sm text-zinc-400">{assets.length} uploaded</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {assets.map((asset) => {
          const isSelected = selectedAssetId === asset.id;

          return (
            <button
              key={asset.id}
              type="button"
              onClick={() => setSelectedAssetId(asset.id)}
              className={`overflow-hidden rounded-2xl border bg-white text-left transition ${
                isSelected
                  ? "border-orange-400 ring-4 ring-orange-400/30 shadow-sm"
                  : "border-zinc-200 hover:border-orange-400"
              }`}
            >
              {asset.type.startsWith("image/") ? (
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="flex h-40 items-center justify-center bg-black/30 text-white/40">
                  File
                </div>
              )}

              <div className="p-4">
                <p className="truncate text-sm font-bold">{asset.name}</p>
                {asset.isHero && (
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
                    Hero Asset
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}