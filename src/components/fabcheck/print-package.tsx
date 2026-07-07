import Image from "next/image";
import type { Project } from "@/types/project";

type PrintPackageProps = {
  project: Project;
  progress: number;
  setIsPrintMode: (value: boolean) => void;
};

export function PrintPackage({
  project,
  setIsPrintMode,
}: PrintPackageProps) {
  return (
    <main className="print-package mx-auto hidden max-w-6xl bg-white p-10 text-black md:block">
      <div className="no-print mb-8 flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
        <button
          type="button"
          onClick={() => setIsPrintMode(false)}
          className="rounded-full border border-zinc-300 bg-white px-5 py-2 text-sm font-bold text-zinc-700"
        >
          ← Back to Editor
        </button>

        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-full bg-orange-400 px-5 py-2 text-sm font-black uppercase italic text-black"
        >
          Print / Save PDF
        </button>
      </div>

      <section className="grid grid-cols-[1fr_280px] gap-10 pb-8">
        <div>
          <h1 className="mb-2 text-lg font-black uppercase tracking-[0.25em]">
            {project.name || "Project Name"}
          </h1>

          <div className="mt-0 space-y-1 text-lg font-black uppercase leading-tight text-zinc-500">
            <p>{project.eventType || "Event Type"}</p>
            <p>{project.company || "Company"}</p>
            <p>{project.venue || "Event City / Venue"}</p>
            <p>{project.budget || "Target Budget"}</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Image
            src="/images/branding/fabcheck-logo.png"
            alt="FabCheck"
            width={280}
            height={130}
            priority
            className="h-auto w-full max-w-[280px]"
          />
        </div>
      </section>

<section className="mb-6">
  <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
    Contact Information
  </p>

  <p className="border-t border-black pt-3 text-xl font-bold tracking-tight">
    {project.contactName || "Contact Name"}
    <span className="px-3 text-zinc-400">|</span>
    {project.contactEmail || "Email"}
    <span className="px-3 text-zinc-400">|</span>
    {project.contactPhone || "Phone #"}
  </p>
</section>

      <section>
        <h2 className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-zinc-500">
          Assets
        </h2>

        {project.assets.length === 0 ? (
          <div className="border-4 border-black p-10">
            <p className="text-2xl font-black uppercase">No assets uploaded.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {project.assets.map((asset, assetIndex) => (
<article
  key={asset.id}
  className="grid break-inside-avoid grid-cols-[440px_1fr] gap-10"
>
                <div>
                  <h3 className="mb-3 text-md font-black uppercase">
                    Image #{assetIndex + 1}: {asset.name}
                  </h3>

                  {asset.type.startsWith("image/") ? (
<div className="flex w-[440px] justify-center bg-black">
  <div className="relative inline-block">
    <img
      src={asset.url}
      alt={asset.name}
      className="block max-h-[560px] w-auto max-w-[440px] object-contain"
    />

    {asset.callouts.map((callout, index) => (
      <div
        key={callout.id}
        className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-orange-400 text-sm font-black text-black shadow-md"
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
                    <div className="flex h-[420px] items-center justify-center bg-black text-3xl font-black uppercase text-white">
                      File #{assetIndex + 1}
                    </div>
                  )}
                </div>

                <div className="pt-9">
                  {asset.callouts.length === 0 ? (
                    <div className="flex min-h-28 items-center justify-center bg-black p-6 text-center text-2xl font-black uppercase text-white">
                      No Callouts Added
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {asset.callouts.map((callout, index) => (
                        <div
                          key={callout.id}
                          className="bg-black p-6 text-white"
                        >
                          <p className="text-1xl font-black uppercase">
                            Callout {index + 1}
                          </p>

                          <p className="mt-3 text-md font-bold leading-snug text-white/90">
                            {callout.note || "No note added."}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
    
  );
}