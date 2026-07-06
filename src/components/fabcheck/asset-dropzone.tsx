type AssetDropzoneProps = {
  addAssets: (files: File[]) => void;
  compact?: boolean;
};

export function AssetDropzone({
  addAssets,
  compact = false,
}: AssetDropzoneProps) {
  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    addAssets(Array.from(fileList));
  }

  if (compact) {
    return (
      <div className="mx-auto mt-10 flex max-w-5xl items-center justify-between border-b border-zinc-200 pb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-400">
            Assets
          </p>
          <h2 className="mt-2 text-3xl font-black italic uppercase">
            Project Assets
          </h2>
        </div>

        <label className="cursor-pointer rounded-full bg-orange-400 px-6 py-3 font-black uppercase italic text-black transition hover:scale-105 hover:bg-orange-300">
          Upload More
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
      }}
      className="mx-auto mt-10 flex min-h-[420px] max-w-5xl flex-col items-center justify-center rounded-3xl border border-dashed border-orange-400/50 bg-white/[0.04] p-10 text-center"
    >
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-400">
        Assets
      </p>

      <h2 className="mt-4 text-4xl font-black italic uppercase">
        Drop your vision here.
      </h2>

      <p className="mx-auto mt-4 max-w-xl text-zinc-500">
        Upload renderings, AI concepts, logos, brand guides, floor plans, and
        inspiration images.
      </p>

      <label className="mt-8 cursor-pointer rounded-full bg-orange-400 px-8 py-4 font-black uppercase italic text-black transition hover:scale-105 hover:bg-orange-300">
        Browse Files
        <input
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>
    </div>
  );
}