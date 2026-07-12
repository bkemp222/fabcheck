export type AssetCallout = {
  id: string;
  x: number;
  y: number;
  note: string;
  category?:
    | "element"
    | "branding"
    | "lighting"
    | "finish"
    | "scale"
    | "unknown";
  source?: "ai" | "user";
};

export type FabricationDetection = string;

export type FabricationCategory =
  | "walls"
  | "flooring"
  | "counters"
  | "millwork"
  | "av"
  | "structure"
  | "lighting"
  | "customFabrication";

export type FabricationCategoryProfile = Record<FabricationCategory, number>;

export type FabricatedAssembly = {
  label: string;
  category: FabricationCategory;
  evidence?: string;
};

export type FabricationCategoryEvidence = Partial<
  Record<FabricationCategory, string>
>;

export type FabricationKnowledgeRow = {
  detection: FabricationDetection;
  question: string;
  estimateInfluence: number;
  options: string[];
  defaultValue: string;
  aliases?: string[];
};

export type FabricationAssumption = {
  id: string;
  detection: FabricationDetection;
  question: string;
  estimateInfluence: number;
  options: string[];
  defaultValue: string;
  value: string;
  source: "knowledge-base";
};

export type EstimateComplexity = "simple" | "moderate" | "complex" | "premium";

export type EstimateFootprint =
  | "8x8"
  | "10x10"
  | "10x20"
  | "20x20"
  | "20x30"
  | "30x30"
  | "unknown";

export type FabricationCostDriver = {
  label: string;
  detail: string;
  impact: 0 | 1 | 3 | 6;
  severity: "moderate" | "major" | "premium";
  assetName?: string;
};

export type FabricationEstimate = {
  low: number;
  high: number;
  label: string;
  footprint: EstimateFootprint | "";
  footprintLabel: string;
  complexity: EstimateComplexity;
  confidence: number;
  majorCostDrivers: FabricationCostDriver[];
  includedScope: string[];
  scopeOnlyItems: string[];
  missingInfo: string[];
  notesAndAssumptions: string[];
  exclusions: string[];
  costSavingSuggestions: string[];
  fabricationProfile: FabricationCategoryProfile;
  primaryCostDrivers: string[];
};

export type AssetAiReview = {
  projectType: string;
  estimatedSize: string;
  confidence: number;
  summary: string;
  fabricationProfile?: FabricationCategoryProfile;
  fabricationCategoryEvidence?: FabricationCategoryEvidence;
  fabricatedAssemblies?: FabricatedAssembly[];
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
  aiReviewError?: string;
  fabricationAssumptions?: FabricationAssumption[];
  callouts: AssetCallout[];
};
export type Project = {
  name: string;
  company: string;
  contactName: string;
contactEmail: string;
contactPhone: string;
message: string;
  eventType: string;
  footprint: EstimateFootprint | "";
  venue: string;
  budget: string;
  assets: ProjectAsset[];
  callouts: string[];
};

export type ActiveView = "overview" | "assets" | "review";
