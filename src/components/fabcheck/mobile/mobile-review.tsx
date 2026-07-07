"use client";

import { useState } from "react";
import type { Project } from "@/types/project";

type MobileReviewProps = {
  project: Project;
};

type AiReview = {
  score: number;
  summary: string;
  identifiedElements: string[];
  missingInformation: string[];
  fabricationQuestions: string[];
  productionConcerns: string[];
  suggestedNextSteps: string[];
};

export function MobileReview({ project }: MobileReviewProps) {
  const [isReviewing, setIsReviewing] = useState(false);
  const [aiReview, setAiReview] = useState<AiReview | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const totalCallouts = project.assets.reduce(
    (total, asset) => total + asset.callouts.length,
    0
  );

  async function runAiReview() {
    setIsReviewing(true);
    setAiError(null);
    setAiReview(null);

    try {
      const response = await fetch("/api/ai-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setAiError(data.error || "Failed to run AI review.");
        return;
      }

      setAiReview(data.review);
    } catch (error) {
      console.error(error);
      setAiError("Something went wrong running the AI review.");
    } finally {
      setIsReviewing(false);
    }
  }

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
        onClick={runAiReview}
        disabled={isReviewing || project.assets.length === 0}
        className="w-full rounded-full bg-orange-500 py-4 text-lg font-black uppercase italic text-black disabled:opacity-40"
      >
        {isReviewing ? "Reviewing..." : "Run AI Fab Review"}
      </button>

      {aiError && (
        <div className="rounded-3xl bg-red-50 p-5 text-sm font-bold text-red-700">
          {aiError}
        </div>
      )}

      {aiReview && (
        <div className="space-y-4 rounded-3xl bg-white p-5 shadow-sm">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400">
              AI Readiness Score
            </p>
            <p className="mt-2 text-5xl font-black">{aiReview.score}%</p>
          </div>

          <p className="text-zinc-700">{aiReview.summary}</p>

          <ReviewSection title="What I Can Identify" items={aiReview.identifiedElements} />
          <ReviewSection title="Missing Information" items={aiReview.missingInformation} />
          <ReviewSection title="Questions to Ask" items={aiReview.fabricationQuestions} />
          <ReviewSection title="Production Concerns" items={aiReview.productionConcerns} />
          <ReviewSection title="Suggested Next Steps" items={aiReview.suggestedNextSteps} />
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          localStorage.setItem(
            "fabcheck-print-project",
            JSON.stringify({ project, progress: 100 })
          );
          window.open("/launch/print", "_blank");
        }}
        className="w-full rounded-full bg-[#f9a331] py-4 text-lg font-black uppercase italic text-black"
      >
        Print / Save PDF
      </button>

      <button
        type="button"
        onClick={async () => {
          try {
            const response = await fetch("/api/submit-package", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(project),
            });

            if (!response.ok) {
              alert("Failed to submit package.");
              return;
            }

            alert("Package submitted successfully!");
          } catch (error) {
            console.error(error);
            alert("Something went wrong submitting the package.");
          }
        }}
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

function ReviewSection({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  if (!items || items.length === 0) return null;

  return (
    <div className="border-t border-zinc-100 pt-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
        {title}
      </p>

      <ul className="mt-3 space-y-2 text-sm text-zinc-700">
        {items.map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}