"use client";

import type { Project } from "@/types/project";
import { MobileHeader } from "./mobile-header";

type MobileAssetsProps = {
  project: Project;
  addAssets: (files: File[]) => string[];
  setSelectedAssetId: (id: string) => void;
  setMobileAssetDetailOpen: (value: boolean) => void;
  setIsMarkupMode: (value: boolean) => void;
};

export function MobileAssets({
  project,
  addAssets,
  setSelectedAssetId,
  setMobileAssetDetailOpen,
  setIsMarkupMode,
}: MobileAssetsProps) {
  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const newAssetIds = addAssets(Array.from(fileList));

if (newAssetIds.length > 0) {
  setSelectedAssetId(newAssetIds[0]);
  setMobileAssetDetailOpen(false);
  setIsMarkupMode(true);
}
  }

  return (
    <div className="space-y-5 p-5">

      <label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#f9a331] bg-white/10 p-6 text-center shadow-sm">
        <p className="text-2xl font-black italic uppercase">Upload Assets</p>
        <p className="mt-2 text-sm text-zinc-500">
          Renderings, AI concepts, logos, floorplans, and references.
        </p>

        <input
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      <div className="space-y-3">
        {project.assets.length === 0 ? (
          <div className="rounded-3xl bg-white p-5 text-zinc-500 shadow-sm">
            No assets uploaded yet.
          </div>
        ) : (
          project.assets.map((asset) => (
            <button
              key={asset.id}
              type="button"
onClick={() => {
  setSelectedAssetId(asset.id);
  setMobileAssetDetailOpen(true);
}}
              className="flex w-full items-center gap-4 rounded-3xl bg-white p-4 text-left shadow-sm"
            >
              {asset.type.startsWith("image/") ? (
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="h-20 w-20 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-100 text-xs font-bold text-zinc-400">
                  FILE
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate font-black">{asset.name}</p>
                <p className="mt-1 text-sm text-zinc-500">
                  {asset.callouts.length} callout
                  {asset.callouts.length === 1 ? "" : "s"}
                </p>
              </div>

              <span className="text-2xl text-zinc-300">›</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}