"use client";

import type { ActiveView, Project } from "@/types/project";
import { MobileOverview } from "./mobile-overview";
import { MobileAssets } from "./mobile-assets";
import { MobileAssetDetail } from "./mobile-asset-detail";
import { MobileMarkup } from "./mobile-markup";

type MobileWorkspaceProps = {
  project: Project;
  activeView: ActiveView;
  updateProject: <K extends keyof Project>(
    key: K,
    value: Project[K]
  ) => void;
  goToAssets: () => void;
  addAssets: (files: File[]) => void;
  selectedAssetId: string | null;
  setSelectedAssetId: (id: string) => void;
  isMobileAssetDetailOpen: boolean;
  setIsMobileAssetDetailOpen: (value: boolean) => void;
  setIsMarkupMode: (value: boolean) => void;
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
  goToAssets,
  addAssets,
  selectedAssetId,
  setSelectedAssetId,
  isMobileAssetDetailOpen,
  setIsMobileAssetDetailOpen,
  setIsMarkupMode,
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
          goToAssets={goToAssets}
        />
      )}

      {activeView === "assets" && (
        <MobileAssets
          project={project}
          addAssets={addAssets}
          setSelectedAssetId={setSelectedAssetId}
          setMobileAssetDetailOpen={setIsMobileAssetDetailOpen}
        />
      )}

      {activeView === "review" && (
        <div className="space-y-6 p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-500">
              FabCheck
            </p>
            <h1 className="mt-1 text-4xl font-black italic uppercase">
              Review
            </h1>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400">
              Assets
            </p>
            <p className="mt-2 text-3xl font-black">
              {project.assets.length}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-zinc-400">
              Project
            </p>
            <p className="mt-2 text-xl font-black">
              {project.name || "Untitled Package"}
            </p>
            <p className="mt-1 text-zinc-500">
              {project.company || "No company added"}
            </p>
          </div>

          <p className="text-sm text-zinc-500">
            Mobile review actions are next. Desktop review and PDF generation
            still work normally.
          </p>
        </div>
      )}
    </div>
  );
}