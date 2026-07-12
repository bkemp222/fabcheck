"use client";

import { useCallback, useRef, useState } from "react";
import { estimateFabricationBudget } from "@/data/fabrication-knowledge";
import { FabricationCategoryBars } from "@/components/fabcheck/fabrication-category-bars";
import { SubmissionConfirmationModal } from "@/components/fabcheck/submission-confirmation-modal";
import type { Project } from "@/types/project";

type ReviewPackageProps = {
  project: Project;
  progress: number;
  updateProject: <K extends keyof Project>(
    key: K,
    value: Project[K]
  ) => void;
  onReturnHome: () => void;
};

export function ReviewPackage({
  project,
  updateProject,
  onReturnHome,
}: ReviewPackageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const conceptImage = project.assets.find((asset) =>
    asset.type.startsWith("image/")
  );
  const budgetRange = estimateFabricationBudget(project);
  const canSubmit = Boolean(
    project.contactName.trim() && project.contactEmail.trim()
  );

  const closeConfirmation = useCallback(() => {
    setIsConfirmationOpen(false);
  }, []);

  async function submitEstimateRequest() {
    if (!canSubmit || !conceptImage || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/submit-package", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        alert("Failed to submit estimate request.");
        return;
      }

      setIsConfirmationOpen(true);
    } catch (error) {
      console.error(error);
      alert("Something went wrong submitting the estimate request.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-5 xl:grid-cols-[1fr_0.9fr]">
      <div className="space-y-5">
        {conceptImage ? (
          <section className="overflow-hidden rounded-xl bg-black shadow-sm">
            <img
              src={conceptImage.url}
              alt={conceptImage.name}
              className="max-h-[520px] w-full object-contain"
            />
          </section>
        ) : (
          <section className="rounded-xl border border-black/5 bg-white p-5 text-sm text-zinc-500 shadow-sm">
            Upload a concept image to generate a budget range.
          </section>
        )}

        <section className="rounded-xl bg-black p-6 text-white shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-white/40">
            Estimated Fabrication Budget
          </p>
          <p className="mt-3 text-5xl font-black italic tracking-tight">
            {budgetRange?.label || "Pending"}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60">
            Ballpark custom fabrication range based on your selected project
            type, footprint, uploaded concept, and starter notes.
          </p>
        </section>

        {budgetRange ? (
          <FabricationCategoryBars
            profile={budgetRange.fabricationProfile}
            primaryCostDrivers={budgetRange.primaryCostDrivers}
          />
        ) : null}

        <section className="rounded-xl border border-black/5 bg-white p-5 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-zinc-400">
            Exclusions
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            FabCheck provides a fabrication budget estimate based on the concept
            you&apos;ve submitted. This estimate includes materials and labor
            required to build the project, but excludes services such as
            installation, freight, AV, furniture rentals, and other
            non-fabrication costs, which can be quoted separately as needed.
          </p>
        </section>
      </div>

      <section className="h-fit rounded-xl border border-black/5 bg-white p-5 shadow-sm">
        <p className="text-2xl font-black italic uppercase">Let&apos;s Build It</p>

        <p className="mt-2 text-sm leading-6 text-zinc-600">
          If you&apos;d like to move forward, submit your contact information and
          we&apos;ll review your concept, confirm the project details, and prepare
          a formal fabrication proposal.
        </p>

        <div className="mt-5 space-y-3">
          <Input
            label="Name *"
            value={project.contactName}
            onChange={(value) => updateProject("contactName", value)}
          />
          <Input
            label="Company Name"
            value={project.company}
            onChange={(value) => updateProject("company", value)}
          />
          <Input
            label="Phone"
            value={project.contactPhone}
            onChange={(value) => updateProject("contactPhone", value)}
          />
          <Input
            label="Email *"
            value={project.contactEmail}
            onChange={(value) => updateProject("contactEmail", value)}
            type="email"
          />
          <Input
            label="Message"
            value={project.message}
            onChange={(value) => updateProject("message", value)}
          />
        </div>

        <button
          ref={submitButtonRef}
          type="button"
          onClick={submitEstimateRequest}
          disabled={!canSubmit || !conceptImage || isSubmitting}
          className="mt-5 w-full rounded-xl bg-[#f9a331] py-3.5 text-base font-black uppercase italic text-black shadow-sm transition duration-150 hover:bg-[#ffb14c] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 disabled:shadow-none"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </section>

      <SubmissionConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={closeConfirmation}
        onReturnHome={onReturnHome}
      />
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-black uppercase tracking-[0.22em] text-zinc-400">
        {label}
      </span>
      <input
        type={type}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-base font-semibold outline-none transition duration-150 focus:border-[#faa431] focus:bg-white focus:ring-2 focus:ring-[#faa431]/15"
      />
    </label>
  );
}
