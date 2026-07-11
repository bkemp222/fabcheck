import type { Project } from "@/types/project";
import { PackageCard } from "@/components/fabcheck/package-card";
import { estimateFabricationBudget } from "@/data/fabrication-knowledge";

type PackagePreviewProps = {
  project: Project;
};

export function PackagePreview({ project }: PackagePreviewProps) {
  const heroAsset = project.assets.find((asset) =>
    asset.type.startsWith("image/")
  );
  const budgetRange = estimateFabricationBudget(project);
  const totalCallouts = project.assets.reduce(
    (total, asset) => total + asset.callouts.length,
    0
  );

  return (
    <aside className="border-l border-white/10 bg-black/20 p-6">
      <div className="sticky top-6">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-400">
          FabCheck Preview
        </p>

        <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.04] p-5">
          {heroAsset && (
            <img
              src={heroAsset.url}
              alt={heroAsset.name}
              className="mb-5 h-40 w-full rounded-lg object-cover"
            />
          )}

          <h2 className="text-2xl font-black italic uppercase">
            {budgetRange?.label || "Pending"}
          </h2>

          <p className="mt-1 text-sm leading-5 text-white/40">
            Fabrication budget range updates after concept review.
          </p>

          <div className="mt-6 space-y-3">
            <PackageCard label="Project Type" value={project.eventType || "Not selected"} />
            <PackageCard
              label="Footprint"
              value={project.footprint || "Not selected"}
            />
            <PackageCard
              label="Concept"
              value={
                project.assets.length
                  ? "Uploaded"
                  : "No image uploaded"
              }
            />
            <PackageCard
              label="Starter Notes"
              value={
                totalCallouts
                  ? `${totalCallouts} added`
                  : "No notes added"
              }
            />
            <PackageCard label="Contact" value={project.contactEmail || "Not added"} />
          </div>
        </div>
      </div>
    </aside>
  );
}
