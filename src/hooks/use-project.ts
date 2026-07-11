"use client";

import { useState } from "react";
import { mockProject } from "@/data/mock-project";
import { createFabricationAssumptions } from "@/data/fabrication-knowledge";
import type {
  ActiveView,
  AssetAiReview,
  AssetCallout,
  Project,
  ProjectAsset,
} from "@/types/project";
import imageCompression from "browser-image-compression";

type FabCheckStatus =
  | "idle"
  | "compressing"
  | "reading"
  | "fabchecking"
  | "complete"
  | "error";

type AiSuggestedCallout = {
  x?: number | string;
  y?: number | string;
  note?: string;
  category?: AssetCallout["category"];
};

type AiAssetReviewResponse = {
  ok?: boolean;
  error?: string;
  review?: Partial<AssetAiReview> & {
    suggestedCallouts?: AiSuggestedCallout[];
  };
};

type AiAssetReviewResult = {
  aiReview?: AssetAiReview;
  aiCallouts: AssetCallout[];
  aiError?: string;
};

export function useProject() {
  const [project, setProject] = useState<Project>(mockProject);
  const [activeView, setActiveView] = useState<ActiveView>("assets");
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [isMarkupMode, setIsMarkupMode] = useState(false);
  const [selectedCalloutId, setSelectedCalloutId] = useState<string | null>(null);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [isMobileAssetDetailOpen, setIsMobileAssetDetailOpen] = useState(false);

  const [fabCheckStatus, setFabCheckStatus] =
    useState<FabCheckStatus>("idle");
  const [fabCheckMessage, setFabCheckMessage] = useState("");

  const isAiReviewing =
    fabCheckStatus === "compressing" ||
    fabCheckStatus === "reading" ||
    fabCheckStatus === "fabchecking";

  function updateProject<K extends keyof Project>(key: K, value: Project[K]) {
    setProject((currentProject) => ({
      ...currentProject,
      [key]: value,
    }));
  }

  async function reviewAssetWithAi(asset: {
    name: string;
    type: string;
    url: string;
  }): Promise<AiAssetReviewResult> {
    if (!asset.type.startsWith("image/")) {
      return {
        aiReview: undefined,
        aiCallouts: [],
      };
    }

    setFabCheckStatus("fabchecking");
    setFabCheckMessage("FabChecking your design...");

    try {
      const response = await fetch("/api/ai-asset-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(asset),
      });

      const data = (await response.json()) as AiAssetReviewResponse;

      console.log("AI ASSET REVIEW RESPONSE:", data);
      console.log("AI RESPONSE OK?", response.ok);

      if (!response.ok || !data.ok || !data.review) {
        throw new Error(data.error || "AI review failed.");
      }

      const aiReview: AssetAiReview = {
        projectType: data.review.projectType || "Unknown",
        estimatedSize: data.review.estimatedSize || "Unknown",
        confidence: data.review.confidence || 0,
        summary: data.review.summary || "",
        fabricationInventory: {
          elements: data.review.fabricationInventory?.elements || [],
          branding: data.review.fabricationInventory?.branding || [],
          lighting: data.review.fabricationInventory?.lighting || [],
          finishes: data.review.fabricationInventory?.finishes || [],
          scaleClues: data.review.fabricationInventory?.scaleClues || [],
          unknowns: data.review.fabricationInventory?.unknowns || [],
        },
      };

      const aiCallouts: AssetCallout[] = (
        data.review.suggestedCallouts || []
      ).map((callout) => ({
          id: crypto.randomUUID(),
          x: Number(callout.x) || 50,
          y: Number(callout.y) || 50,
          note: callout.note || "",
          category: callout.category || "element",
          source: "ai",
        })
      );

      return {
        aiReview,
        aiCallouts,
      };
    } catch (error) {
      console.error("AI asset review failed:", error);

      const aiError =
        error instanceof Error
          ? error.message
          : "AI review failed. Your asset was still uploaded.";

      setFabCheckStatus("error");
      setFabCheckMessage(aiError);

      return {
        aiReview: undefined,
        aiCallouts: [],
        aiError,
      };
    }
  }

  async function addAssets(files: File[]) {
    const newAssets: ProjectAsset[] = [];

    for (const file of files.slice(0, 1)) {
      const originalFileName = file.name;
      setFabCheckStatus("compressing");
      setFabCheckMessage("Preparing your image...");

      const processedFile = file.type.startsWith("image/")
        ? await imageCompression(file, {
            maxSizeMB: 0.8,
            maxWidthOrHeight: 1600,
            useWebWorker: true,
          })
        : file;

      setFabCheckStatus("reading");
      setFabCheckMessage("Reading your upload...");

      const assetUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          resolve(reader.result as string);
        };

        reader.onerror = () => {
          reject(new Error("Failed to read file."));
        };

        reader.readAsDataURL(processedFile);
      });

      const assetId = crypto.randomUUID();

      const { aiReview, aiCallouts, aiError } = await reviewAssetWithAi({
        name: originalFileName,
        type: file.type,
        url: assetUrl,
      });

      const newAsset: ProjectAsset = {
        id: assetId,
        name: originalFileName,
        type: file.type,
        url: assetUrl,
        isHero: true,
        aiReview,
        aiReviewError: aiError,
        fabricationAssumptions: createFabricationAssumptions(aiReview),
        callouts: aiCallouts,
      };

      newAssets.push(newAsset);
    }

    setProject((current) => ({
      ...current,
      assets: newAssets,
    }));

    if (newAssets.length > 0) {
      setSelectedAssetId(newAssets[0].id);
      setIsMobileAssetDetailOpen(false);
    }

    if (newAssets.length > 0) {
      setSelectedCalloutId(null);
    }

    const hasAiError = newAssets.some((asset) => asset.aiReviewError);

    setFabCheckStatus(hasAiError ? "error" : "complete");
    setFabCheckMessage(
      hasAiError
        ? "Uploaded, but AI notes need setup."
        : "FabCheck complete."
    );

    setTimeout(() => {
      setFabCheckStatus("idle");
      setFabCheckMessage("");
    }, 600);

    return newAssets.map((asset) => asset.id);
  }

  function deleteAsset(assetId: string) {
    setProject((currentProject) => {
      const remainingAssets = currentProject.assets.filter(
        (asset) => asset.id !== assetId
      );

      return {
        ...currentProject,
        assets: remainingAssets,
      };
    });

    if (selectedAssetId === assetId) {
      setSelectedAssetId(null);
    }
  }

  function addCallout(assetId: string, x: number, y: number) {
    const newCalloutId = crypto.randomUUID();

    setProject((currentProject) => ({
      ...currentProject,
      assets: currentProject.assets.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              callouts: [
                ...asset.callouts,
                {
                  id: newCalloutId,
                  x,
                  y,
                  note: "",
                  source: "user",
                },
              ],
            }
          : asset
      ),
    }));

    setSelectedCalloutId(newCalloutId);
    return newCalloutId;
  }

  function updateCallout(assetId: string, calloutId: string, note: string) {
    setProject((currentProject) => ({
      ...currentProject,
      assets: currentProject.assets.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              callouts: asset.callouts.map((callout) =>
                callout.id === calloutId
                  ? {
                      ...callout,
                      note,
                    }
                  : callout
              ),
            }
          : asset
      ),
    }));
  }

  function deleteCallout(assetId: string, calloutId: string) {
    setProject((currentProject) => ({
      ...currentProject,
      assets: currentProject.assets.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              callouts: asset.callouts.filter(
                (callout) => callout.id !== calloutId
              ),
            }
          : asset
      ),
    }));

    if (selectedCalloutId === calloutId) {
      setSelectedCalloutId(null);
    }
  }

  function updateFabricationAssumption(
    assetId: string,
    assumptionId: string,
    value: string
  ) {
    setProject((currentProject) => ({
      ...currentProject,
      assets: currentProject.assets.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              fabricationAssumptions: (
                asset.fabricationAssumptions || []
              ).map((assumption) =>
                assumption.id === assumptionId
                  ? {
                      ...assumption,
                      value,
                    }
                  : assumption
              ),
            }
          : asset
      ),
    }));
  }

  const progress =
    (project.contactName ? 10 : 0) +
    (project.contactEmail ? 10 : 0) +
    (project.contactPhone ? 10 : 0) +
    (project.name ? 15 : 0) +
    (project.company ? 10 : 0) +
    (project.eventType ? 10 : 0) +
    (project.venue ? 10 : 0) +
    (project.budget !== "Not sure yet" ? 10 : 0) +
    (project.assets.length > 0 ? 15 : 0);

  return {
    project,
    updateProject,
    addAssets,
    deleteAsset,
    progress,

    activeView,
    setActiveView,

    selectedAssetId,
    setSelectedAssetId,

    isMobileAssetDetailOpen,
    setIsMobileAssetDetailOpen,

    isMarkupMode,
    setIsMarkupMode,

    fabCheckStatus,
    fabCheckMessage,
    isAiReviewing,

    addCallout,
    selectedCalloutId,
    setSelectedCalloutId,
    updateCallout,
    deleteCallout,
    updateFabricationAssumption,

    isPrintMode,
    setIsPrintMode,
  };
}
