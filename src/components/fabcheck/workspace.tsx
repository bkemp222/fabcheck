import type { ActiveView, Project } from "@/types/project";
import { ProjectForm } from "@/components/fabcheck/project-form";
import { AssetDropzone } from "@/components/fabcheck/asset-dropzone";
import { AssetGallery } from "@/components/fabcheck/asset-gallery";
import { AssetDetail } from "@/components/fabcheck/asset-detail";
import { MarkupMode } from "@/components/fabcheck/markup-mode";
import { ReviewPackage } from "@/components/fabcheck/review-package";
import { PrintPackage } from "@/components/fabcheck/print-package";
import { MobileWorkspace } from "./mobile/mobile-workspace";

type WorkspaceProps = {
  project: Project;
  updateProject: <K extends keyof Project>(key: K, value: Project[K]) => void;
 addAssets: (files: File[]) => Promise<string[]>;
deleteAsset: (assetId: string) => void;
  addCallout: (assetId: string, x: number, y: number) => string;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedAssetId: string | null;
  setSelectedAssetId: (id: string) => void;
  isMarkupMode: boolean;
  isAiReviewing: boolean;
  setIsMarkupMode: (value: boolean) => void;
  selectedCalloutId: string | null;
  setSelectedCalloutId: React.Dispatch<React.SetStateAction<string | null>>;
  updateCallout: (assetId: string, calloutId: string, note: string) => void;
  deleteCallout: (assetId: string, calloutId: string) => void;
  progress: number;
  isPrintMode: boolean;
setIsPrintMode: (value: boolean) => void;
isMobileAssetDetailOpen: boolean;
setIsMobileAssetDetailOpen: (value: boolean) => void;
};

export function Workspace({
  project,
  updateProject,
  addAssets,
  addCallout,
  deleteAsset,
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
  isMobileAssetDetailOpen,
setIsMobileAssetDetailOpen,
progress,
isPrintMode,
setIsPrintMode,
}: WorkspaceProps) {
  const selectedAsset = project.assets.find(
    (asset) => asset.id === selectedAssetId
  );
  if (isPrintMode) {
  return (
<PrintPackage
  project={project}
  progress={progress}
  setIsPrintMode={setIsPrintMode}
/>
  );
}

if (isMarkupMode) {
  return (
    <>
      <div className="md:hidden">
        <MobileWorkspace
          project={project}
          activeView={activeView}
          updateProject={updateProject}
          setActiveView={setActiveView}
          addAssets={addAssets}
          selectedAssetId={selectedAssetId}
          setSelectedAssetId={setSelectedAssetId}
          isMobileAssetDetailOpen={isMobileAssetDetailOpen}
          setIsMobileAssetDetailOpen={setIsMobileAssetDetailOpen}
          setIsMarkupMode={setIsMarkupMode}
          isAiReviewing={isAiReviewing}
          addCallout={addCallout}
          selectedCalloutId={selectedCalloutId}
          setSelectedCalloutId={setSelectedCalloutId}
          updateCallout={updateCallout}
          isMarkupMode={isMarkupMode}
          deleteCallout={deleteCallout}
        />
      </div>

      <div className="hidden md:block">
        <MarkupMode
          asset={selectedAsset}
          setIsMarkupMode={setIsMarkupMode}
          addCallout={addCallout}
          selectedCalloutId={selectedCalloutId}
          setSelectedCalloutId={setSelectedCalloutId}
          updateCallout={updateCallout}
          deleteCallout={deleteCallout}
        />
      </div>
    </>
  );
}

  return (
    <section className="min-h-screen bg-[#F5F2EC] p-4 md:p-10 text-black">
      <MobileWorkspace
  project={project}
  activeView={activeView}
  updateProject={updateProject}
  setActiveView={setActiveView}
  addAssets={addAssets}
setSelectedAssetId={setSelectedAssetId}
isMobileAssetDetailOpen={isMobileAssetDetailOpen}
setIsMobileAssetDetailOpen={setIsMobileAssetDetailOpen}
selectedAssetId={selectedAssetId}
setIsMarkupMode={setIsMarkupMode}
addCallout={addCallout}
selectedCalloutId={selectedCalloutId}
setSelectedCalloutId={setSelectedCalloutId}
updateCallout={updateCallout}
isMarkupMode={isMarkupMode}
isAiReviewing={isAiReviewing}
deleteCallout={deleteCallout}
/>
<div className="hidden md:block">
      {activeView === "overview" && (
        <ProjectForm
  project={project}
  updateProject={updateProject}
  goToAssets={() => setActiveView("assets")}
/>
      )}

      {activeView === "assets" && (
        <>
          {project.assets.length === 0 ? (
            <AssetDropzone addAssets={addAssets} />
          ) : (
            <>
              <AssetDropzone addAssets={addAssets} compact />

              <AssetGallery
                assets={project.assets}
                selectedAssetId={selectedAssetId}
                setSelectedAssetId={setSelectedAssetId}
              />

<AssetDetail
  asset={selectedAsset}
  setIsMarkupMode={setIsMarkupMode}
  deleteAsset={deleteAsset}
/>
            </>
          )}
        </>
      )}

{activeView === "review" && (
<ReviewPackage
  project={project}
  progress={progress}
/>
)}
</div>
    </section>
  );
}
