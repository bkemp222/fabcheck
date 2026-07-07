"use client";

import { useState } from "react";
import { mockProject } from "@/data/mock-project";
import type { ActiveView, Project, ProjectAsset } from "@/types/project";

export function useProject() {
  const [project, setProject] = useState<Project>(mockProject);
  const [activeView, setActiveView] = useState<ActiveView>("assets");
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [isMarkupMode, setIsMarkupMode] = useState(false);
  const [selectedCalloutId, setSelectedCalloutId] = useState<string | null>(null);
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [isMobileAssetDetailOpen, setIsMobileAssetDetailOpen] =
  useState(false);

  function updateProject<K extends keyof Project>(key: K, value: Project[K]) {
    setProject((currentProject) => ({
      ...currentProject,
      [key]: value,
    }));
  }

  function addAssets(files: File[]) {
    const newAssets: ProjectAsset[] = files.map((file, index) => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      isHero: project.assets.length === 0 && index === 0,
      callouts: [],
    }));

    setProject((currentProject) => ({
      ...currentProject,
      assets: [...currentProject.assets, ...newAssets],
    }));

    if (!selectedAssetId && newAssets.length > 0) {
      setSelectedAssetId(newAssets[0].id);
    }
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
    addCallout,
    selectedCalloutId,
setSelectedCalloutId,
updateCallout,
deleteCallout,
isPrintMode,
setIsPrintMode,
  };
}