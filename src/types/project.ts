export type AssetCallout = {
  id: string;
  x: number;
  y: number;
  note: string;
};

export type ProjectAsset = {
  id: string;
  name: string;
  type: string;
  url: string;
  isHero: boolean;
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