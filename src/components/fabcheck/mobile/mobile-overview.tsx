"use client";

import { Project } from "@/types/project";

type MobileOverviewProps = {
  project: Project;
  updateProject: <K extends keyof Project>(
  key: K,
  value: Project[K]
) => void;
  goToAssets: () => void;
};

export function MobileOverview({
  project,
  updateProject,
  goToAssets,
}: MobileOverviewProps) {
  return (
    <div className="space-y-6 p-5">

      <div>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-500">
          FabCheck
        </p>

        <h1 className="mt-1 text-4xl font-black italic">
          Project Info
        </h1>
      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm space-y-5">

        <Input
          label="Project Name"
          value={project.name}
          onChange={(v) => updateProject("name", v)}
        />

        <Input
          label="Company"
          value={project.company}
          onChange={(v) => updateProject("company", v)}
        />

        <Input
          label="Event Type"
          value={project.eventType}
          onChange={(v) => updateProject("eventType", v)}
        />

        <Input
          label="Venue / City"
          value={project.venue}
          onChange={(v) => updateProject("venue", v)}
        />

        <Input
          label="Budget"
          value={project.budget}
          onChange={(v) => updateProject("budget", v)}
        />

      </div>

      <div className="rounded-3xl bg-white p-5 shadow-sm space-y-5">

        <Input
          label="Contact Name"
          value={project.contactName}
          onChange={(v) => updateProject("contactName", v)}
        />

        <Input
          label="Email"
          value={project.contactEmail}
          onChange={(v) => updateProject("contactEmail", v)}
        />

        <Input
          label="Phone"
          value={project.contactPhone}
          onChange={(v) => updateProject("contactPhone", v)}
        />

      </div>

      <button
        onClick={goToAssets}
        className="w-full rounded-full bg-orange-500 py-4 text-lg font-black uppercase tracking-wide text-black"
      >
        Continue →
      </button>

    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-black uppercase tracking-[0.25em] text-zinc-400">
        {label}
      </label>

      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-lg font-semibold outline-none transition focus:border-orange-500"
      />
    </div>
  );
}