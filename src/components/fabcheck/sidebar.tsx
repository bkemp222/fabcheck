import type { ActiveView } from "@/types/project";
import Link from "next/link";

type SidebarProps = {
  progress: number;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  assetCount: number;
  setIsMarkupMode: (value: boolean) => void;
};

export function Sidebar({
  progress,
  activeView,
  setActiveView,
  assetCount,
  setIsMarkupMode,
}: SidebarProps) {
const steps: { label: string; view: ActiveView }[] = [
  { label: assetCount ? `Concept (${assetCount})` : "Concept", view: "assets" },
  { label: "Review", view: "review" },
];

  return (
    <aside className="border-r border-white/10 bg-black/30 p-6">
      <Link
        href="/"
        className="flex items-center justify-center rounded-2xl p-2 transition hover:bg-white/5"
      >
        <img
          src="/images/branding/fabcheck-logo.svg"
          alt="FabCheck"
          className="h-auto w-full"
        />
      </Link>

      <nav className="mt-16 space-y-3">
        {steps.map((step, index) => {
          const isActive = activeView === step.view;

          return (
            <button
              key={step.view}
              type="button"
              onClick={() => {
  setIsMarkupMode(false);
  setActiveView(step.view);
}}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-black uppercase tracking-[0.12em] transition ${
                isActive ? "bg-orange-400 text-black" : "text-white/50 hover:bg-white/5"
              }`}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-black/30 text-xs">
                {isActive ? index + 1 : "○"}
              </span>
              {step.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
