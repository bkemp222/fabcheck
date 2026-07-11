import type { Project } from "@/types/project";
import { estimateFabricationBudget } from "@/data/fabrication-knowledge";

type ReviewPackageProps = {
  project: Project;
  progress: number;
};

export function ReviewPackage({
  project,
  progress,
}: ReviewPackageProps) {
  const totalCallouts = project.assets.reduce(
    (total, asset) => total + asset.callouts.length,
    0
  );
  const fabricationEstimate = estimateFabricationBudget(project);

  async function submitPackage() {
  const response = await fetch("/api/submit-package", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
  });

  if (!response.ok) {
    alert("Package submission failed.");
    return;
  }

  alert("FabCheck package submitted.");
}

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
          FabCheck Review Package
        </p>

        <h1 className="mt-2 text-4xl font-black italic uppercase">
          {project.name || "Untitled Package"}
        </h1>

        <p className="mt-2 text-zinc-500">
          Review the full FabCheck package before creating your submission.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Readiness" value={`${progress}%`} />
        <StatCard label="Assets" value={`${project.assets.length}`} />
        <StatCard label="Callouts" value={`${totalCallouts}`} />
        <StatCard label="Status" value="Draft" />
      </div>

      <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400">
          Estimated Fabrication Budget
        </p>
        <p className="mt-3 text-4xl font-black italic">
          {fabricationEstimate?.label || "Pending"}
        </p>

        {fabricationEstimate ? (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <ReviewItem
                label="Footprint"
                value={fabricationEstimate.footprintLabel}
              />
              <ReviewItem
                label="Complexity"
                value={fabricationEstimate.complexity}
              />
              <ReviewItem
                label="Confidence"
                value={`${fabricationEstimate.confidence}%`}
              />
              <ReviewItem
                label="Drivers"
                value={`${fabricationEstimate.majorCostDrivers.length}`}
              />
            </div>

            {fabricationEstimate.majorCostDrivers.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-black">Major Cost Drivers</h3>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {fabricationEstimate.majorCostDrivers.map((driver) => (
                    <div
                      key={`${driver.label}-${driver.assetName || "scope"}`}
                      className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                    >
                      <p className="font-black">{driver.label}</p>
                      <p className="mt-1 text-sm leading-6 text-zinc-500">
                        {driver.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {fabricationEstimate.includedScope.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-black">Detected Fabrication Scope</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {fabricationEstimate.includedScope.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-zinc-100 px-3 py-2 text-xs font-black text-zinc-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {fabricationEstimate.scopeOnlyItems.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-black">Scope-Only Items</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {fabricationEstimate.scopeOnlyItems.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-zinc-100 px-3 py-2 text-xs font-black text-zinc-600"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {fabricationEstimate.notesAndAssumptions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-black">Notes / Assumptions</h3>
                <div className="mt-3 space-y-2 text-sm leading-6 text-zinc-600">
                  {fabricationEstimate.notesAndAssumptions.map((note) => (
                    <p key={note}>{note}</p>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="mt-3 text-zinc-500">
            Upload an image to generate a fabrication estimate.
          </p>
        )}
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-black">Contact Information</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <ReviewItem label="Name" value={project.contactName || "Not added"} />
          <ReviewItem label="Email" value={project.contactEmail || "Not added"} />
          <ReviewItem label="Phone" value={project.contactPhone || "Not added"} />
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-black">Project Overview</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ReviewItem label="Company" value={project.company || "Not added"} />
          <ReviewItem label="Event Type" value={project.eventType} />
          <ReviewItem label="Venue" value={project.venue || "Not added"} />
          <ReviewItem label="Budget" value={project.budget} />
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-black">Assets & Callouts</h2>

        {project.assets.length === 0 ? (
          <p className="mt-4 text-zinc-500">No assets uploaded yet.</p>
        ) : (
          <div className="mt-6 space-y-8">
            {project.assets.map((asset) => (
              <div
                key={asset.id}
                className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5"
              >
                <div className="grid gap-5 md:grid-cols-[240px_1fr]">
                  <div>
                    {asset.type.startsWith("image/") ? (
<div className="relative mt-4 inline-block rounded-xl border border-zinc-300">
  <img
    src={asset.url}
    alt={asset.name}
    className="block max-h-[500px] w-auto max-w-full rounded-xl object-contain"
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
                    ) : (
                      <div className="flex h-40 items-center justify-center rounded-2xl bg-zinc-200 text-zinc-500">
                        File
                      </div>
                    )}

                    <p className="mt-3 truncate font-bold">{asset.name}</p>

                    {asset.isHero && (
                      <p className="mt-1 text-xs font-black uppercase tracking-[0.2em] text-orange-500">
                        Hero Asset
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-black">Callouts</h3>

                    {asset.callouts.length === 0 ? (
                      <p className="mt-3 text-zinc-500">
                        No callouts added for this asset.
                      </p>
                    ) : (
                      <div className="mt-4 space-y-3">
                        {asset.callouts.map((callout, index) => (
                          <div
                            key={callout.id}
                            className="rounded-2xl border border-zinc-200 bg-white p-4"
                          >
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
                              Callout #{index + 1}
                            </p>

                            <p className="mt-2 text-zinc-700">
                              {callout.note || "No note added."}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex justify-end">
        <button
  type="button"
  onClick={() => {
  localStorage.setItem(
    "fabcheck-print-project",
    JSON.stringify({ project, progress })
  );

  window.open("/launch/print", "_blank");
}}
  className="rounded-full bg-orange-400 px-8 py-4 font-black uppercase italic text-black transition hover:scale-105 hover:bg-orange-300"
>
  Create FabCheck Package
</button>

<button
  type="button"
  onClick={submitPackage}
  className="rounded-full border border-zinc-300 bg-white px-8 py-4 font-black uppercase italic text-zinc-700 transition hover:bg-zinc-100"
>
  Submit Package
</button>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
        {label}
      </p>
      <p className="mt-1 font-bold text-zinc-800">{value}</p>
    </div>
  );
}
