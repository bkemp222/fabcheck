export type AssetCallout = {
  id: string;
  x: number;
  y: number;
  note: string;
};

export type AssetAiReview = {
  projectType: string;
  estimatedSize: string;
  confidence: number;
  summary: string;
  fabricationInventory: {
    elements: string[];
    branding: string[];
    lighting: string[];
    finishes: string[];
    scaleClues: string[];
    unknowns: string[];
  };
};
export type ProjectAsset = {
  id: string;
  name: string;
  type: string;
  url: string;
  isHero: boolean;
  aiReview?: AssetAiReview;
  callouts: AssetCallout[];
};
export type Project = {
  name: string;
  company: string;
  contactName: string;
contactEmail: string;
contactPhone: string;
  eventType: string;
  venue: string;
  budget: string;
  assets: ProjectAsset[];
  callouts: string[];
};

export type ActiveView = "overview" | "assets" | "review";