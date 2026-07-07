"use client";

import type { ActiveView, Project } from "@/types/project";
import { MobileOverview } from "./mobile-overview";
import { MobileAssets } from "./mobile-assets";
import { MobileAssetDetail } from "./mobile-asset-detail";
import { MobileMarkup } from "./mobile-markup";
import { MobileReview } from "./mobile-review";

type MobileWorkspaceProps = {
  project: Project;
  activeView: ActiveView;
  updateProject: <K extends keyof Project>(
    key: K,
    value: Project[K]
  ) => void;
setActiveView: (view: ActiveView) => void;
  goToAssets: () => void;
  addAssets: (files: File[]) => Promise<string[]>;
  selectedAssetId: string | null;
  setSelectedAssetId: (id: string) => void;
  isMobileAssetDetailOpen: boolean;
  setIsMobileAssetDetailOpen: (value: boolean) => void;
  setIsMarkupMode: (value: boolean) => void;
  isAiReviewing: boolean;
  addCallout: (assetId: string, x: number, y: number) => string;
selectedCalloutId: string | null;
setSelectedCalloutId: React.Dispatch<React.SetStateAction<string | null>>;
updateCallout: (
  assetId: string,
  calloutId: string,
  note: string
) => void;
isMarkupMode: boolean;
deleteCallout: (
  assetId: string,
  calloutId: string
) => void;

};

export function MobileWorkspace({
  project,
  activeView,
  updateProject,
  setActiveView,
  goToAssets,
  addAssets,
  selectedAssetId,
  setSelectedAssetId,
  isMobileAssetDetailOpen,
  setIsMobileAssetDetailOpen,
  setIsMarkupMode,
  isAiReviewing,
  addCallout,
selectedCalloutId,
setSelectedCalloutId,
updateCallout,
deleteCallout,
isMarkupMode,
}: MobileWorkspaceProps) {
  const selectedAsset = project.assets.find(
    (asset) => asset.id === selectedAssetId
  );

    if (activeView === "assets" && isMarkupMode && selectedAsset) {
  return (
    <MobileMarkup
      asset={selectedAsset}
      addCallout={addCallout}
      selectedCalloutId={selectedCalloutId}
      setSelectedCalloutId={setSelectedCalloutId}
      updateCallout={updateCallout}
      goDone={() => setIsMarkupMode(false)}
      deleteCallout={deleteCallout}
    />
  );
}

if (isAiReviewing) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0b0b0b] px-8 text-center text-white md:hidden">
      <div className="h-20 w-20 animate-spin rounded-full border-8 border-white/10 border-t-orange-400" />

      <p className="mt-8 text-3xl font-black italic uppercase">
        FabChecking...
      </p>

      <p className="mt-3 max-w-xs text-sm leading-6 text-white/60">
        Analyzing your design, identifying key elements, and generating starter notes.
      </p>
    </div>
  );
}

if (activeView === "assets" && isMobileAssetDetailOpen && selectedAsset) {
  return (
    <div className="md:hidden">
      <MobileAssetDetail
        asset={selectedAsset}
        goBack={() => setIsMobileAssetDetailOpen(false)}
        editMarkup={() => {
          setSelectedAssetId(selectedAsset.id);
          setIsMobileAssetDetailOpen(false);
          setIsMarkupMode(true);
        }}
      />
    </div>
  );
}
  


  return (
    <div className="md:hidden">
      {activeView === "overview" && (
        <MobileOverview
          project={project}
          updateProject={updateProject}
          goToReview={() => setActiveView("review")}
        />
      )}

      {activeView === "assets" && (
<MobileAssets
  project={project}
  addAssets={addAssets}
  setSelectedAssetId={setSelectedAssetId}
  setMobileAssetDetailOpen={setIsMobileAssetDetailOpen}
  setIsMarkupMode={setIsMarkupMode}
  goToProjectInfo={() => setActiveView("overview")}
/>
      )}

      {activeView === "review" && <MobileReview project={project} />}
    </div>
  );
}