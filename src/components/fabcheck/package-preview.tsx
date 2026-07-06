import type { Project } from "@/types/project";
import { PackageCard } from "@/components/fabcheck/package-card";

type PackagePreviewProps = {
  project: Project;
};

export function PackagePreview({ project }: PackagePreviewProps) {
  const heroAsset = project.assets.find((asset) =>
    asset.type.startsWith("image/")
  );

  return (
    <aside className="border-l border-white/10 bg-black/20 p-6">
      <div className="sticky top-6">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-400">
          FabCheck Package
        </p>

        <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          {heroAsset && (
            <img
              src={heroAsset.url}
              alt={heroAsset.name}
              className="mb-5 h-40 w-full rounded-2xl object-cover"
            />
          )}

          <h2 className="text-2xl font-black">
            {project.name || "Untitled Package"}
          </h2>

          <p className="mt-1 text-sm text-white/40">Draft Package</p>

          <div className="mt-6 space-y-3">
            <PackageCard label="Company" value={project.company || "Not added"} />
            <PackageCard label="Type" value={project.eventType} />
            <PackageCard label="Venue" value={project.venue || "Not added"} />
            <PackageCard label="Budget" value={project.budget} />
            <PackageCard
              label="Assets"
              value={
                project.assets.length
                  ? `${project.assets.length} uploaded`
                  : "No files uploaded"
              }
            />
            <PackageCard
              label="Callouts"
              value={
                project.callouts.length
                  ? `${project.callouts.length} added`
                  : "No notes added"
              }
            />
          </div>
        </div>
      </div>
    </aside>
  );
}