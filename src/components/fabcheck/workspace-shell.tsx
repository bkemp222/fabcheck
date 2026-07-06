"use client";

import { PackagePreview } from "@/components/fabcheck/package-preview";
import { Sidebar } from "@/components/fabcheck/sidebar";
import { Workspace } from "@/components/fabcheck/workspace";
import { useProject } from "@/hooks/use-project";

export function WorkspaceShell() {
  const {
    project,
    updateProject,
    addAssets,
    deleteAsset,
    addCallout,
    progress,
    activeView,
    setActiveView,
    selectedAssetId,
    setSelectedAssetId,
    isMarkupMode,
    setIsMarkupMode,
    selectedCalloutId,
    setSelectedCalloutId,
    updateCallout,
    deleteCallout,
    isPrintMode,
    setIsPrintMode,
  } = useProject();

  return (
    <main className="min-h-screen bg-[#141212] pb-20 text-white md:pb-0">
      <div className="flex items-center justify-between border-b border-white/10 bg-[#0d0d0d] px-4 py-4 md:hidden">
  <img
    src="/images/branding/fabcheck-logo.svg"
    alt="FabCheck"
    className="h-auto w-36"
  />

  <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-400">
    {activeView}
  </p>
</div>
      <div
className={
  isMarkupMode || isPrintMode
    ? "grid min-h-screen grid-cols-1 md:grid-cols-[240px_1fr]"
    : "grid min-h-screen grid-cols-1 md:grid-cols-[240px_1fr_340px]"
}
      >
        <div className="hidden md:block">
          <Sidebar
            progress={progress}
            activeView={activeView}
            setActiveView={setActiveView}
            assetCount={project.assets.length}
            setIsMarkupMode={setIsMarkupMode}
          />
        </div>

        <Workspace
          project={project}
          updateProject={updateProject}
          addAssets={addAssets}
          deleteAsset={deleteAsset}
          addCallout={addCallout}
          activeView={activeView}
          setActiveView={setActiveView}
          selectedAssetId={selectedAssetId}
          setSelectedAssetId={setSelectedAssetId}
          isMarkupMode={isMarkupMode}
          setIsMarkupMode={setIsMarkupMode}
          selectedCalloutId={selectedCalloutId}
          setSelectedCalloutId={setSelectedCalloutId}
          updateCallout={updateCallout}
          deleteCallout={deleteCallout}
          progress={progress}
          isPrintMode={isPrintMode}
          setIsPrintMode={setIsPrintMode}
        />

        {!isMarkupMode && !isPrintMode && (
          <div className="hidden md:block">
            <PackagePreview project={project} />
          </div>
        )}
      </div>
      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-white/10 bg-[#0d0d0d] md:hidden">
  <button
    type="button"
    onClick={() => {
      setIsMarkupMode(false);
      setActiveView("overview");
    }}
    className={`py-4 text-xs font-black uppercase tracking-[0.15em] ${
      activeView === "overview" ? "text-orange-400" : "text-white/50"
    }`}
  >
    Overview
  </button>

  <button
    type="button"
    onClick={() => {
      setIsMarkupMode(false);
      setActiveView("assets");
    }}
    className={`py-4 text-xs font-black uppercase tracking-[0.15em] ${
      activeView === "assets" ? "text-orange-400" : "text-white/50"
    }`}
  >
    Assets
  </button>

  <button
    type="button"
    onClick={() => {
      setIsMarkupMode(false);
      setActiveView("review");
    }}
    className={`py-4 text-xs font-black uppercase tracking-[0.15em] ${
      activeView === "review" ? "text-orange-400" : "text-white/50"
    }`}
  >
    Review
  </button>
</div>
    </main>
  );
}