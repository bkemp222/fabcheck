"use client";

import { PackagePreview } from "@/components/fabcheck/package-preview";
import { Sidebar } from "@/components/fabcheck/sidebar";
import { Workspace } from "@/components/fabcheck/workspace";
import { useProject } from "@/hooks/use-project";
import { MobileNav } from "./mobile/mobile-nav";


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
    isAiReviewing,
    setIsMarkupMode,
    selectedCalloutId,
    setSelectedCalloutId,
    updateCallout,
    deleteCallout,
    isPrintMode,
    setIsPrintMode,
    isMobileAssetDetailOpen,
setIsMobileAssetDetailOpen,
  } = useProject();

  return (
    <main className="min-h-screen bg-[#141212] pb-20 text-white md:pb-0">
      <div className="flex justify-center border-b border-white/10 bg-[#0d0d0d] px-4 py-3 md:hidden">
  <img
    src="/images/branding/fabcheck-logo.svg"
    alt="FabCheck"
    className="h-auto w-32"
  />
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
          isAiReviewing={isAiReviewing}
          setIsMarkupMode={setIsMarkupMode}
          selectedCalloutId={selectedCalloutId}
          setSelectedCalloutId={setSelectedCalloutId}
          updateCallout={updateCallout}
          deleteCallout={deleteCallout}
          progress={progress}
          isPrintMode={isPrintMode}
          setIsPrintMode={setIsPrintMode}
          isMobileAssetDetailOpen={isMobileAssetDetailOpen}
setIsMobileAssetDetailOpen={setIsMobileAssetDetailOpen}
          
        />

        {!isMarkupMode && !isPrintMode && (
          <div className="hidden md:block">
            <PackagePreview project={project} />
          </div>
        )}
      </div>

      {!isMarkupMode && !isPrintMode && (
        <MobileNav
          activeView={activeView}
          setActiveView={setActiveView}
          setIsMarkupMode={setIsMarkupMode}
        />
      )}

    </main>
  );
}
