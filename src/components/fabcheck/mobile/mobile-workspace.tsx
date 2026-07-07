"use client";

import { Project } from "@/types/project";
import { MobileOverview } from "./mobile-overview";

type MobileWorkspaceProps = {
  project: Project;
  activeView: "overview" | "assets" | "review";
  updateProject: <K extends keyof Project>(
  key: K,
  value: Project[K]
) => void;
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
    {activeView === "overview" && (
      <MobileOverview
        project={project}
        updateProject={updateProject}
        goToAssets={goToAssets}
      />
    )}

    {activeView === "assets" && (
      <div className="space-y-4 p-5">
        <h1 className="text-3xl font-black italic uppercase">Assets</h1>
        {/* asset content here */}
      </div>
    )}

    {activeView === "review" && (
      <div className="space-y-6 p-5">
        <h1 className="text-3xl font-black italic uppercase">Review</h1>
        {/* review content here */}
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