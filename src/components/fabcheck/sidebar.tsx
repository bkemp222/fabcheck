import type { ActiveView } from "@/types/project";

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
  { label: "Overview", view: "overview" },
  { label: assetCount ? `Assets (${assetCount})` : "Assets", view: "assets" },
  { label: "Review Package", view: "review" },
];

  return (
    <aside className="border-r border-white/10 bg-black/30 p-6">
      <a
        href="/"
        className="flex items-center justify-center rounded-2xl p-2 transition hover:bg-white/5"
      >
        <img
          src="/images/branding/fabcheck-logo.svg"
          alt="FabCheck"
          className="h-auto w-full"
        />
      </a>

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
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                isActive ? "bg-orange-400 text-black" : "text-white/50 hover:bg-white/5"
              }`}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/30 text-xs">
                {isActive ? index + 1 : "○"}
              </span>
              {step.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/40">
          Review Readiness
        </p>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-orange-400 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-3 text-sm text-white/60">{progress}% ready</p>
      </div>
    </aside>
  );
}