"use client";

import { Project } from "@/types/project";
import { MobileOverview } from "./mobile-overview";

type MobileWorkspaceProps = {
  project: Project;
  activeView: "overview" | "assets" | "review";
  updateProject: (updates: Partial<Project>) => void;
goToAssets: () => void;
  
};

export function MobileWorkspace({
  project,
  activeView,
  updateProject,
  goToAssets,
}: MobileWorkspaceProps) {
  return (
    <div className="md:hidden">
<MobileOverview
    project={project}
    updateProject={updateProject}
    goToAssets={goToAssets}
/>

      {activeView === "assets" && (
        <div className="space-y-4 p-5">
          <h1 className="text-3xl font-black italic uppercase">
            Assets
          </h1>

          {project.assets.map((asset) => (
            <div
              key={asset.id}
              className="rounded-3xl bg-white p-5 shadow-sm"
            >
              <h2 className="font-black">{asset.name}</h2>

              <p className="mt-2 text-sm text-zinc-500">
                {asset.callouts.length} Callouts
              </p>
            </div>
          ))}
        </div>
      )}

      {activeView === "review" && (
        <div className="space-y-6 p-5">
          <h1 className="text-3xl font-black italic uppercase">
            Review
          </h1>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="font-black">
              {project.assets.length} Assets
            </p>

            <p className="mt-2 text-zinc-500">
              Ready to generate your FabCheck package.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold">
        {value || "—"}
      </p>
    </div>
  );
}