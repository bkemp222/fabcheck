"use client";

import { useProject } from "@/hooks/use-project";
import { Sidebar } from "@/components/fabcheck/sidebar";
import { Workspace } from "@/components/fabcheck/workspace";
import { PackagePreview } from "@/components/fabcheck/package-preview";

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
<main className="min-h-screen bg-[#141212] text-white">
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
    </main>
  );
}