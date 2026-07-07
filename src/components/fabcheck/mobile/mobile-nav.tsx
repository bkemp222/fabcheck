import type { ActiveView } from "@/types/project";

type MobileNavProps = {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  setIsMarkupMode: (value: boolean) => void;
};

export function MobileNav({
  activeView,
  setActiveView,
  setIsMarkupMode,
}: MobileNavProps) {
  function go(view: ActiveView) {
    setIsMarkupMode(false);
    setActiveView(view);
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-white/10 bg-[#0d0d0d] md:hidden">
      <MobileNavButton
        label="Overview"
        active={activeView === "overview"}
        onClick={() => go("overview")}
      />

      <MobileNavButton
        label="Assets"
        active={activeView === "assets"}
        onClick={() => go("assets")}
      />

      <MobileNavButton
        label="Review"
        active={activeView === "review"}
        onClick={() => go("review")}
      />
    </nav>
  );
}

function MobileNavButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`py-4 text-xs font-black uppercase tracking-[0.15em] ${
        active ? "text-orange-400" : "text-white/45"
      }`}
    >
      {label}
    </button>
  );
}