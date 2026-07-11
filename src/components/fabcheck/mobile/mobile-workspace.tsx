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
      goDone={() => {
        setIsMarkupMode(false);
        setActiveView("review");
      }}
      deleteCallout={deleteCallout}
    />
  );
}

if (isAiReviewing) {
  return (
    <div className="premium-fade-in fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0b0b0b] px-8 text-center text-white md:hidden">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/30">
        <img
          src="/images/branding/magic-hammer.svg"
          alt=""
          className="hammer-swing h-20 w-20"
        />
      </div>

      <p className="mt-7 text-2xl font-black italic uppercase tracking-tight">
        FabChecking...
      </p>

      <p className="mt-2 max-w-xs text-xs leading-5 text-white/55">
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
  updateProject={updateProject}
  addAssets={addAssets}
  setSelectedAssetId={setSelectedAssetId}
  setMobileAssetDetailOpen={setIsMobileAssetDetailOpen}
  setIsMarkupMode={setIsMarkupMode}
/>
      )}

      {activeView === "review" && (
        <MobileReview
          project={project}
          updateProject={updateProject}
        />
      )}
    </div>
  );
}
