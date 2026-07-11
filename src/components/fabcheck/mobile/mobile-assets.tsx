"use client";

import type { EstimateFootprint, Project } from "@/types/project";

type MobileAssetsProps = {
  project: Project;
  updateProject: <K extends keyof Project>(
    key: K,
    value: Project[K]
  ) => void;
  addAssets: (files: File[]) => Promise<string[]>;
  setSelectedAssetId: (id: string) => void;
  setMobileAssetDetailOpen: (value: boolean) => void;
  setIsMarkupMode: (value: boolean) => void;
};

const projectTypeOptions = [
  "Brand Activation",
  "Trade Show Booth",
  "Product Launch",
  "Photo Moment",
  "Specialty Build",
];

const footprintOptions: Array<{ label: string; value: EstimateFootprint }> = [
  { label: "Photo Moment / 8x8", value: "8x8" },
  { label: "10x10", value: "10x10" },
  { label: "10x20", value: "10x20" },
  { label: "20x20", value: "20x20" },
  { label: "20x30", value: "20x30" },
  { label: "30x30", value: "30x30" },
];

export function MobileAssets({
  project,
  updateProject,
  addAssets,
  setSelectedAssetId,
  setMobileAssetDetailOpen,
  setIsMarkupMode,
}: MobileAssetsProps) {
  const selectedAsset = project.assets[0];
  const canUpload = Boolean(project.eventType && project.footprint);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || !canUpload) return;
    const newAssetIds = await addAssets(Array.from(fileList).slice(0, 1));

    if (newAssetIds.length > 0) {
      setSelectedAssetId(newAssetIds[0]);
      setMobileAssetDetailOpen(false);
      setIsMarkupMode(true);
    }
  }

  return (
    <div className="mobile-page-enter space-y-4 p-4">
      <section className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">

        <div className="mt-0 space-y-3">
          <Select
            label="Project Type"
            value={project.eventType}
            onChange={(value) => updateProject("eventType", value)}
            placeholder="Select project type"
            options={projectTypeOptions.map((option) => ({
              label: option,
              value: option,
            }))}
          />

          <Select
            label="Footprint"
            value={project.footprint}
            onChange={(value) =>
              updateProject("footprint", value as EstimateFootprint | "")
            }
            placeholder="Select footprint"
            options={footprintOptions}
          />
        </div>
      </section>

      <label
        className={`flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed p-5 text-center shadow-sm transition duration-150 active:scale-[0.99] ${
          canUpload
            ? "cursor-pointer border-[#f9a331] bg-white/70 hover:bg-white"
            : "cursor-not-allowed border-zinc-300 bg-white/40 opacity-60"
        }`}
      >
        <p className="text-xl font-black italic uppercase">
          {selectedAsset ? "Replace Concept" : "Upload Concept"}
        </p>
        <p className="mt-2 max-w-[18rem] text-xs leading-5 text-zinc-500">
          Upload one main concept image. Replacing it will refresh the estimate.
        </p>
        <input
          type="file"
          accept="image/*"
          disabled={!canUpload}
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </label>

      {selectedAsset ? (
        <button
          type="button"
          onClick={() => {
            setSelectedAssetId(selectedAsset.id);
            setMobileAssetDetailOpen(true);
          }}
          className="flex w-full items-center gap-3 rounded-xl border border-black/5 bg-white p-3 text-left shadow-sm transition duration-150 hover:border-black/10 hover:bg-zinc-50 active:scale-[0.99]"
        >
          <img
            src={selectedAsset.url}
            alt={selectedAsset.name}
            className="h-16 w-16 rounded-lg object-cover"
          />

          <div className="min-w-0 flex-1">
            <p className="truncate font-black">{selectedAsset.name}</p>
            <p className="mt-0.5 text-xs text-zinc-500">
              {selectedAsset.callouts.length} starter note
              {selectedAsset.callouts.length === 1 ? "" : "s"}
            </p>
          </div>

          <span className="text-2xl text-zinc-300">›</span>
        </button>
      ) : (
        <div className="rounded-xl border border-black/5 bg-white p-4 text-sm text-zinc-500 shadow-sm">
          Choose a project type and footprint, then upload a concept image.
        </div>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  placeholder,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.22em] text-zinc-400">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-base font-semibold outline-none transition duration-150 focus:border-[#faa431] focus:bg-white focus:ring-2 focus:ring-[#faa431]/15"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
