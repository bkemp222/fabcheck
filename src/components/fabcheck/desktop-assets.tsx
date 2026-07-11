"use client";

import type { EstimateFootprint, Project } from "@/types/project";

type DesktopAssetsProps = {
  project: Project;
  updateProject: <K extends keyof Project>(
    key: K,
    value: Project[K]
  ) => void;
  addAssets: (files: File[]) => Promise<string[]>;
  setSelectedAssetId: (id: string) => void;
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

export function DesktopAssets({
  project,
  updateProject,
  addAssets,
  setSelectedAssetId,
  setIsMarkupMode,
}: DesktopAssetsProps) {
  const selectedAsset = project.assets[0];
  const canUpload = Boolean(project.eventType && project.footprint);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || !canUpload) return;

    const newAssetIds = await addAssets(Array.from(fileList).slice(0, 1));

    if (newAssetIds.length > 0) {
      setSelectedAssetId(newAssetIds[0]);
      setIsMarkupMode(true);
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="self-start rounded-xl border border-black/5 bg-white p-5 shadow-sm">

        <div className="grid gap-4">
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

      <section className="rounded-xl border border-black/5 bg-white p-5 shadow-sm">
        <label
          className={`flex min-h-[17rem] flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition duration-150 ${
            canUpload
              ? "cursor-pointer border-[#f9a331] bg-zinc-50 hover:bg-white"
              : "cursor-not-allowed border-zinc-300 bg-zinc-50/60 opacity-60"
          }`}
        >
          <p className="text-3xl font-black italic uppercase tracking-tight">
            {selectedAsset ? "Replace Concept" : "Upload Concept"}
          </p>
          <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
            Upload your AI-generated concept image. Replacing it will refresh the session.
          </p>
          <span
            className={`mt-5 rounded-lg px-5 py-3 text-sm font-black uppercase italic transition ${
              canUpload
                ? "bg-[#f9a331] text-black hover:bg-[#ffb14c]"
                : "bg-zinc-300 text-zinc-500"
            }`}
          >
            Choose Image
          </span>
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
              setIsMarkupMode(true);
            }}
            className="mt-4 flex w-full items-center gap-4 rounded-xl border border-black/5 bg-white p-3 text-left shadow-sm transition duration-150 hover:border-black/10 hover:bg-zinc-50 active:scale-[0.99]"
          >
            <img
              src={selectedAsset.url}
              alt={selectedAsset.name}
              className="h-20 w-20 rounded-lg object-cover"
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-black">{selectedAsset.name}</p>
              <p className="mt-1 text-sm text-zinc-500">
                {selectedAsset.callouts.length} starter note
                {selectedAsset.callouts.length === 1 ? "" : "s"}
              </p>
            </div>

            <span className="rounded-lg bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white">
              Edit Pins
            </span>
          </button>
        ) : (
          <div className="mt-4 rounded-xl border border-black/5 bg-zinc-50 p-4 text-sm text-zinc-500">
            Choose a project type and footprint, then upload a concept image.
          </div>
        )}
      </section>
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
