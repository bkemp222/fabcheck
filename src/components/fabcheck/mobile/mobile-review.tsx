"use client";

import type { Project } from "@/types/project";
import { MobileHeader } from "./mobile-header";

type MobileReviewProps = {
  project: Project;
};

export function MobileReview({ project }: MobileReviewProps) {
  const totalCallouts = project.assets.reduce(
    (total, asset) => total + asset.callouts.length,
    0
  );

  return (
    <div className="space-y-6 p-5 pb-28">

      <div className="rounded-3xl bg-white p-5 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400">
          Project
        </p>
        <p className="mt-2 text-2xl font-black">
          {project.name || "Untitled Package"}
        </p>
        <p className="mt-1 text-zinc-500">
          {project.company || "No company added"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Assets" value={project.assets.length} />
        <Stat label="Callouts" value={totalCallouts} />
      </div>

      <button
        type="button"
        onClick={() => {
          localStorage.setItem(
            "fabcheck-print-project",
            JSON.stringify({ project, progress: 100 })
          );
          window.open("/launch/print", "_blank");
        }}
        className="w-full rounded-full bg-[#faa431] py-4 text-lg font-black uppercase italic text-black"
      >
        Create Package
      </button>

      <button
        type="button"
        className="w-full rounded-full bg-black py-4 text-lg font-black uppercase italic text-white"
      >
        Submit Package
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}