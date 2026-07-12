import type {
  FabricationCategory,
  FabricationCategoryProfile,
} from "@/types/project";

export const FABRICATION_CATEGORIES: FabricationCategory[] = [
  "walls",
  "flooring",
  "counters",
  "millwork",
  "av",
  "structure",
  "lighting",
  "customFabrication",
];

export const FABRICATION_CATEGORY_LABELS: Record<FabricationCategory, string> = {
  walls: "Scenic Walls",
  flooring: "Flooring",
  counters: "Counters & Bars",
  millwork: "Millwork",
  av: "Technology",
  structure: "Structure",
  lighting: "Lighting",
  customFabrication: "Custom Fabrication",
};

export const FABRICATION_CATEGORY_DRIVER_LABELS: Record<
  FabricationCategory,
  string
> = {
  walls: "Scenic walls",
  flooring: "Flooring scope",
  counters: "Counters and bars",
  millwork: "Millwork",
  av: "Technology integration",
  structure: "Structural elements",
  lighting: "Integrated lighting",
  customFabrication: "Custom fabrication",
};

export const FABRICATION_CATEGORY_WEIGHTS: Record<FabricationCategory, number> =
  {
    walls: 0.85,
    flooring: 0.35,
    counters: 1.05,
    millwork: 1.15,
    av: 0.55,
    structure: 1.25,
    lighting: 0.95,
    customFabrication: 1.45,
  };

export const EMPTY_FABRICATION_PROFILE: FabricationCategoryProfile = {
  walls: 0,
  flooring: 0,
  counters: 0,
  millwork: 0,
  av: 0,
  structure: 0,
  lighting: 0,
  customFabrication: 0,
};

export function clampFabricationScore(value: unknown) {
  const numericValue = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return Math.max(0, Math.min(10, Math.round(numericValue)));
}

export function normalizeFabricationProfile(
  profile?: Partial<Record<FabricationCategory, unknown>> | null
): FabricationCategoryProfile {
  return FABRICATION_CATEGORIES.reduce<FabricationCategoryProfile>(
    (normalized, category) => ({
      ...normalized,
      [category]: clampFabricationScore(profile?.[category]),
    }),
    { ...EMPTY_FABRICATION_PROFILE }
  );
}

export function hasFabricationProfile(
  profile?: FabricationCategoryProfile | null
) {
  return Boolean(
    profile &&
      FABRICATION_CATEGORIES.some((category) => profile[category] > 0)
  );
}

export function getDominantFabricationCategories(
  profile?: FabricationCategoryProfile | null,
  limit = 4
) {
  const normalizedProfile = normalizeFabricationProfile(profile);

  return FABRICATION_CATEGORIES.map((category) => ({
    category,
    label: FABRICATION_CATEGORY_LABELS[category],
    driverLabel: FABRICATION_CATEGORY_DRIVER_LABELS[category],
    score: normalizedProfile[category],
    weightedScore:
      normalizedProfile[category] * FABRICATION_CATEGORY_WEIGHTS[category],
  }))
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (b.weightedScore !== a.weightedScore) {
        return b.weightedScore - a.weightedScore;
      }

      return b.score - a.score;
    })
    .slice(0, limit);
}

export function getPrimaryCostDriverLabels(
  profile?: FabricationCategoryProfile | null
) {
  return getDominantFabricationCategories(profile, 4)
    .filter((item) => item.score >= 3)
    .slice(0, 4)
    .map((item) => {
      if (item.category === "customFabrication") {
        return "Extensive custom fabrication";
      }

      if (item.category === "structure") {
        return "Structural overhead or architectural elements";
      }

      if (item.category === "lighting") {
        return "Integrated lighting";
      }

      if (item.category === "millwork") {
        return "Significant millwork";
      }

      if (item.category === "counters") {
        return "Custom counters and bars";
      }

      if (item.category === "av") {
        return "Technology integration";
      }

      if (item.category === "walls") {
        return "Scenic wall construction";
      }

      return "Flooring scope";
    });
}

export function calculateFabricationProfileScore(
  profile?: FabricationCategoryProfile | null
) {
  const normalizedProfile = normalizeFabricationProfile(profile);
  const weightedTotal = FABRICATION_CATEGORIES.reduce(
    (total, category) =>
      total + normalizedProfile[category] * FABRICATION_CATEGORY_WEIGHTS[category],
    0
  );
  const activeCategories = FABRICATION_CATEGORIES.filter(
    (category) => normalizedProfile[category] > 0
  ).length;
  const dominantCategories = FABRICATION_CATEGORIES.filter(
    (category) => normalizedProfile[category] >= 7
  ).length;

  return weightedTotal + activeCategories * 0.55 + dominantCategories * 1.1;
}

export function getFabricationProfileMultiplier(
  profile?: FabricationCategoryProfile | null
) {
  const profileScore = calculateFabricationProfileScore(profile);

  if (profileScore >= 50) return 2.05;
  if (profileScore >= 42) return 1.85;
  if (profileScore >= 34) return 1.65;
  if (profileScore >= 26) return 1.45;
  if (profileScore >= 18) return 1.28;
  if (profileScore >= 10) return 1.14;
  return 1;
}
