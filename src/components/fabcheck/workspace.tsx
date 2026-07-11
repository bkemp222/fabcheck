import type { ActiveView, Project } from "@/types/project";
import { ProjectForm } from "@/components/fabcheck/project-form";
import { DesktopAssets } from "@/components/fabcheck/desktop-assets";
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
          goDone={() => {
            setIsMarkupMode(false);
            setActiveView("review");
          }}
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
{isAiReviewing && (
  <div className="premium-fade-in fixed inset-0 z-50 hidden flex-col items-center justify-center bg-[#0b0b0b] px-8 text-center text-white md:flex">
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/30">
      <img
        src="/images/branding/magic-hammer.svg"
        alt=""
        className="hammer-swing h-20 w-20"
      />
    </div>

    <p className="mt-7 text-3xl font-black italic uppercase tracking-tight">
      FabChecking...
    </p>

    <p className="mt-2 max-w-sm text-sm leading-6 text-white/55">
      Analyzing your design, identifying key elements, and generating starter notes.
    </p>
  </div>
)}
<div className="hidden md:block">
      {activeView === "overview" && (
        <ProjectForm
  project={project}
  updateProject={updateProject}
  goToAssets={() => setActiveView("assets")}
/>
      )}

      {activeView === "assets" && (
        <DesktopAssets
          project={project}
          updateProject={updateProject}
          addAssets={addAssets}
          setSelectedAssetId={setSelectedAssetId}
          setIsMarkupMode={setIsMarkupMode}
        />
      )}

{activeView === "review" && (
<ReviewPackage
  project={project}
  progress={progress}
  updateProject={updateProject}
/>
)}
</div>
    </section>
  );
}
