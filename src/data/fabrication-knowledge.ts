import type {
  AssetAiReview,
  FabricationAssumption,
  FabricationCostDriver,
  FabricationDetection,
  FabricationEstimate,
  FabricationKnowledgeRow,
  EstimateComplexity,
  EstimateFootprint,
  Project,
  ProjectAsset,
} from "@/types/project";

export const FABRICATION_KNOWLEDGE: FabricationKnowledgeRow[] = [
  {
    detection: "Wall",
    question: "Construction",
    estimateInfluence: 10,
    options: ["Hard Scenic", "SEG/Fabric", "Venue/Existing"],
    defaultValue: "Hard Scenic",
  },
  {
    detection: "Wall",
    question: "Finish",
    estimateInfluence: 8,
    options: ["Paint", "Laminate", "Vinyl"],
    defaultValue: "Paint",
  },
  {
    detection: "Wall",
    question: "Shape",
    estimateInfluence: 7,
    options: ["Square", "Single Radius", "Double Radius"],
    defaultValue: "Square",
  },
  {
    detection: "Wall",
    question: "Height",
    estimateInfluence: 9,
    options: ["6'", "8'", "10'", "12'"],
    defaultValue: "8'",
  },
  {
    detection: "Logo",
    question: "Construction",
    estimateInfluence: 7,
    options: ["Vinyl Graphic", "Dimensional PVC", "Acrylic", "Metal"],
    defaultValue: "Dimensional PVC",
  },
  {
    detection: "Logo",
    question: "Lighting",
    estimateInfluence: 8,
    options: ["None", "Halo", "Backlit", "Edge Lit", "Neon"],
    defaultValue: "None",
  },
  {
    detection: "Logo",
    question: "Mounting",
    estimateInfluence: 5,
    options: ["Flush", "Stand-off", "Suspended"],
    defaultValue: "Flush",
  },
  {
    detection: "Counter",
    question: "Type",
    estimateInfluence: 9,
    options: ["Rental", "Custom"],
    defaultValue: "Custom",
  },
  {
    detection: "Counter",
    question: "Finish",
    estimateInfluence: 8,
    options: ["Paint", "Laminate", "Vinyl"],
    defaultValue: "Laminate",
  },
  {
    detection: "Counter",
    question: "Lighting",
    estimateInfluence: 6,
    options: ["None", "Toe Kick", "Under Counter"],
    defaultValue: "Under Counter",
  },
  {
    detection: "Flooring",
    question: "Type",
    estimateInfluence: 6,
    options: [
      "Carpet",
      "Printed Vinyl",
      "Raised Floor",
      "Laminate / Wood",
      "Turf",
      "Existing Venue Floor",
    ],
    defaultValue: "Carpet",
  },
  {
    detection: "Truss",
    question: "Size",
    estimateInfluence: 8,
    options: ["10x10", "10x20", "20x20", "20x30", "30x30"],
    defaultValue: "10x10",
  },
  {
    detection: "TV/Monitor",
    question: "Size",
    estimateInfluence: 4,
    options: ['32"', '55"', '65"', '75"'],
    defaultValue: '65"',
    aliases: ["tv", "monitor", "screen", "display"],
  },
  {
    detection: "TV/Monitor",
    question: "Mounting",
    estimateInfluence: 5,
    options: ["Wall Mount", "Freestanding"],
    defaultValue: "Freestanding",
    aliases: ["tv", "monitor", "screen", "display"],
  },
  {
    detection: "Hanging Sign",
    question: "Construction",
    estimateInfluence: 8,
    options: ["Wooden", "PVC", "Foamboard"],
    defaultValue: "PVC",
    aliases: ["overhead sign", "suspended sign", "hanging signage"],
  },
  {
    detection: "Furniture",
    question: "Type",
    estimateInfluence: 5,
    options: ["Rental", "Custom"],
    defaultValue: "Rental",
  },
  {
    detection: "Furniture",
    question: "Quantity",
    estimateInfluence: 5,
    options: ["1", "2-4", "5+"],
    defaultValue: "1",
  },
  {
    detection: "Shelving",
    question: "Construction",
    estimateInfluence: 6,
    options: ["Wood", "Acrylic"],
    defaultValue: "Wood",
  },
  {
    detection: "Shelving",
    question: "Lighting",
    estimateInfluence: 4,
    options: ["None", "Under Shelf", "Edge"],
    defaultValue: "None",
  },
  {
    detection: "Interactive",
    question: "Type",
    estimateInfluence: 6,
    options: ["Touchscreen", "Tablet", "Photo Booth"],
    defaultValue: "Touchscreen",
    aliases: ["interactive screen", "kiosk", "touchscreen", "tablet"],
  },
  {
    detection: "Door",
    question: "Type",
    estimateInfluence: 5,
    options: ["Hidden", "Standard", "Locking"],
    defaultValue: "Standard",
  },
  {
    detection: "Lighting",
    question: "Type",
    estimateInfluence: 6,
    options: ["Spotlight", "LED", "Decorative"],
    defaultValue: "LED",
  },
  {
    detection: "Special Finish",
    question: "Type",
    estimateInfluence: 7,
    options: ["Mirror", "Chrome", "Wood Laminate", "Stucco", "None"],
    defaultValue: "None",
    aliases: ["mirror", "chrome", "wood laminate", "stucco"],
  },
  {
    detection: "Graphics",
    question: "Type",
    estimateInfluence: 7,
    options: ["SEG / Fabric", "Vinyl Wrap", "Banner"],
    defaultValue: "Vinyl Wrap",
    aliases: ["graphic", "branding", "brand graphics", "printed graphics"],
  },
  {
    detection: "Graphics",
    question: "Coverage",
    estimateInfluence: 8,
    options: ["Partial", "Full"],
    defaultValue: "Full",
    aliases: ["graphic", "branding", "brand graphics", "printed graphics"],
  },
];

export const FABRICATION_DETECTIONS = Array.from(
  new Set(FABRICATION_KNOWLEDGE.map((row) => row.detection))
);

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function inventoryItems(review: AssetAiReview) {
  return [
    ...review.fabricationInventory.elements,
    ...review.fabricationInventory.branding,
    ...review.fabricationInventory.lighting,
    ...review.fabricationInventory.finishes,
    ...review.fabricationInventory.scaleClues,
    ...review.fabricationInventory.unknowns,
  ];
}

function detectionMatchesText(detection: FabricationDetection, text: string) {
  const normalizedText = normalize(text);
  const candidates = [
    detection,
    ...FABRICATION_KNOWLEDGE.filter((row) => row.detection === detection).flatMap(
      (row) => row.aliases || []
    ),
  ];

  return candidates.some((candidate) => {
    const normalizedCandidate = normalize(candidate);
    return (
      normalizedText.includes(normalizedCandidate) ||
      normalizedCandidate.includes(normalizedText)
    );
  });
}

export function detectFabricationItems(
  review: AssetAiReview
): FabricationDetection[] {
  const detectedText = inventoryItems(review).join(" ");

  return FABRICATION_DETECTIONS.filter((detection) =>
    detectionMatchesText(detection, detectedText)
  );
}

export function createFabricationAssumptions(
  review?: AssetAiReview
): FabricationAssumption[] {
  if (!review) return [];

  const detections = detectFabricationItems(review);

  return FABRICATION_KNOWLEDGE.filter((row) =>
    detections.includes(row.detection)
  ).map((row) => ({
    id: `${row.detection}:${row.question}`,
    detection: row.detection,
    question: row.question,
    estimateInfluence: row.estimateInfluence,
    options: row.options,
    defaultValue: row.defaultValue,
    value: row.defaultValue,
    source: "knowledge-base",
  }));
}

export function getProjectAssumptions(project: Project) {
  return project.assets.flatMap((asset) =>
    (asset.fabricationAssumptions || []).map((assumption) => ({
      asset,
      assumption,
    }))
  );
}

const ESTIMATE_EXCLUSIONS = [
  "AV equipment",
  "Furniture",
  "Freight",
  "Installation",
  "Dismantle",
  "Travel",
  "Rigging labor",
  "Rigging",
  "Venue Services",
  "Union Labor",
  "Electrical Service",
  "Engineering",
];

const FOOTPRINT_BASE_RANGES: Record<
  EstimateFootprint,
  {
    label: string;
    anchor: number;
    typicalUpper: number;
    premium: number;
    rare: number;
    confidence: number;
  }
> = {
  "8x8": {
    label: "Photo Moment / 8x8 Activation",
    anchor: 5000,
    typicalUpper: 8000,
    premium: 12000,
    rare: 18000,
    confidence: 84,
  },
  "10x10": {
    label: "10x10",
    anchor: 7000,
    typicalUpper: 10000,
    premium: 15000,
    rare: 20000,
    confidence: 86,
  },
  "10x20": {
    label: "10x20",
    anchor: 15000,
    typicalUpper: 20000,
    premium: 25000,
    rare: 35000,
    confidence: 84,
  },
  "20x20": {
    label: "20x20",
    anchor: 205000,
    typicalUpper: 35000,
    premium: 45000,
    rare: 60000,
    confidence: 82,
  },
  "20x30": {
    label: "20x30",
    anchor: 45000,
    typicalUpper: 55000,
    premium: 65000,
    rare: 100000,
    confidence: 80,
  },
  "30x30": {
    label: "30x30",
    anchor: 55000,
    typicalUpper: 65000,
    premium: 85000,
    rare: 125000,
    confidence: 78,
  },
  unknown: {
    label: "Unknown footprint",
    anchor: 12000,
    typicalUpper: 25000,
    premium: 45000,
    rare: 65000,
    confidence: 58,
  },
};

const MAX_IMPACT_MULTIPLIER = 1.9;

type ProjectAssumption = ReturnType<typeof getProjectAssumptions>[number];

function hasAssumption(
  assumptions: ProjectAssumption[],
  detection: string,
  question: string,
  values?: string[]
) {
  return assumptions.some(
    ({ assumption }) =>
      assumption.detection === detection &&
      assumption.question === question &&
      (!values || values.includes(assumption.value))
  );
}

function findAssumptions(
  assumptions: ProjectAssumption[],
  detection: string,
  question?: string,
  values?: string[]
) {
  return assumptions.filter(
    ({ assumption }) =>
      assumption.detection === detection &&
      (!question || assumption.question === question) &&
      (!values || values.includes(assumption.value))
  );
}

function inferFootprint(project: Project): EstimateFootprint {
  if (project.footprint && project.footprint !== "unknown") {
    return project.footprint;
  }

  const text = [
    project.eventType,
    project.venue,
    project.budget,
    ...project.assets.flatMap((asset) => [
      asset.aiReview?.estimatedSize || "",
      asset.aiReview?.summary || "",
      ...(asset.aiReview?.fabricationInventory.scaleClues || []),
    ]),
  ]
    .join(" ")
    .toLowerCase();

  const explicitSize = text.match(/\b(10|20|30)\s*[x×]\s*(10|20|30)\b/);

  if (explicitSize) {
    const normalized = `${explicitSize[1]}x${explicitSize[2]}`;

    if (normalized in FOOTPRINT_BASE_RANGES) {
      return normalized as EstimateFootprint;
    }
  }

  const trussSize = getProjectAssumptions(project).find(
    ({ assumption }) =>
      assumption.detection === "Truss" && assumption.question === "Size"
  )?.assumption.value;

  if (trussSize && trussSize in FOOTPRINT_BASE_RANGES) {
    return trussSize as EstimateFootprint;
  }

  if (
    text.includes("photo moment") ||
    text.includes("bar") ||
    text.includes("activation") ||
    text.match(/\b8\s*[x×]\s*8\b/)
  ) {
    return "8x8";
  }

  return "unknown";
}

function createDriver(
  label: string,
  detail: string,
  impact: FabricationCostDriver["impact"],
  severity: FabricationCostDriver["severity"],
  assetName?: string
): FabricationCostDriver {
  return {
    label,
    detail,
    impact,
    severity,
    assetName,
  };
}

function getMajorCostDrivers(
  assumptions: ProjectAssumption[]
): FabricationCostDriver[] {
  const drivers: FabricationCostDriver[] = [];

  const hardScenicWalls = findAssumptions(assumptions, "Wall", "Construction", [
    "Hard Scenic",
  ]);
  if (hardScenicWalls.length > 0) {
    drivers.push(
      createDriver(
        "Custom hard scenic walls",
        "Hard scenic wall construction is treated as a primary fabrication driver, not one charge per wall variable.",
        3,
        "major",
        hardScenicWalls[0].asset.name
      )
    );
  }

  const tallWalls = findAssumptions(assumptions, "Wall", "Height", [
    "10'",
    "12'",
  ]);
  if (tallWalls.length > 0) {
    drivers.push(
      createDriver(
        "Tall scenic wall height",
        "Wall height above a typical 8' build adds material, structure, and shop labor.",
        3,
        "major",
        tallWalls[0].asset.name
      )
    );
  }

  const curvedWalls = findAssumptions(assumptions, "Wall", "Shape", [
    "Single Radius",
    "Double Radius",
  ]);
  if (curvedWalls.length > 0) {
    drivers.push(
      createDriver(
        "Curved scenic construction",
        "Radius wall shapes require more specialized layout, material handling, and finishing.",
        curvedWalls.some(({ assumption }) => assumption.value === "Double Radius")
          ? 1
          : 1,
        curvedWalls.some(({ assumption }) => assumption.value === "Double Radius")
          ? "moderate"
          : "moderate",
        curvedWalls[0].asset.name
      )
    );
  }

  const hangingSigns = findAssumptions(assumptions, "Hanging Sign");
  const suspendedLogos = findAssumptions(assumptions, "Logo", "Mounting", [
    "Suspended",
  ]);
  const truss = findAssumptions(assumptions, "Truss");
  if (hangingSigns.length > 0 || suspendedLogos.length > 0 || truss.length > 0) {
    drivers.push(
      createDriver(
        "Overhead, hanging, or truss structure",
        "Overhead scenic, hanging signs, and truss affect fabrication coordination. Rigging labor is excluded.",
        3,
        "major",
        (hangingSigns[0] || suspendedLogos[0] || truss[0])?.asset.name
      )
    );
  }

  const customCounters = findAssumptions(assumptions, "Counter", "Type", [
    "Custom",
  ]);
  if (customCounters.length > 0) {
    drivers.push(
      createDriver(
        "Custom counter or millwork",
        "Custom counters affect cabinetry, laminates, finishing, and shop assembly.",
        3,
        "major",
        customCounters[0].asset.name
      )
    );
  }

  const avScope =
    hasAssumption(assumptions, "TV/Monitor", "Size", ['75"']) ||
    hasAssumption(assumptions, "Interactive", "Type");
  if (avScope) {
    drivers.push(
      createDriver(
        "AV or interactive scenic integration",
        "AV equipment is excluded; only custom scenic integration or mounting complexity is reflected.",
        1,
        "major"
      )
    );
  }

  const integratedLighting =
    hasAssumption(assumptions, "Logo", "Lighting", [
      "Halo",
      "Backlit",
      "Edge Lit",
      "Neon",
    ]) ||
    hasAssumption(assumptions, "Counter", "Lighting", ["Toe Kick", "Under Counter"]) ||
    hasAssumption(assumptions, "Shelving", "Lighting", ["Under Shelf", "Edge"]) ||
    hasAssumption(assumptions, "Lighting", "Type", ["Decorative"]);
  if (integratedLighting) {
    drivers.push(
      createDriver(
        "Integrated lighting",
        "Integrated lighting affects fabrication coordination and finish details. Electrical service remains excluded.",
        3,
        "major"
      )
    );
  }

  const specialtyMaterial =
    hasAssumption(assumptions, "Logo", "Construction", ["Acrylic", "Metal"]) ||
    hasAssumption(assumptions, "Shelving", "Construction", ["Acrylic"]) ||
    hasAssumption(assumptions, "Special Finish", "Type", [
      "Mirror",
      "Chrome",
      "Wood Laminate",
      "Stucco",
    ]);
  if (specialtyMaterial) {
    drivers.push(
      createDriver(
        "Specialty materials or finishes",
        "Acrylic, metal-like finishes, mirror, chrome, or textured finishes can raise fabrication cost.",
        3,
        "premium"
      )
    );
  }

  const flooringDriver = findAssumptions(assumptions, "Flooring", "Type", [
    "Printed Vinyl",
    "Raised Floor",
    "Laminate / Wood",
    "Turf",
  ]);
  if (flooringDriver.length > 0) {
    const isRaised = flooringDriver[0].assumption.value === "Raised Floor";
    drivers.push(
      createDriver(
        "Upgraded flooring",
        "Printed, raised, laminate, wood-look, or turf flooring can affect fabrication scope.",
        isRaised ? 6 : 3,
        isRaised ? "premium" : "major",
        flooringDriver[0].asset.name
      )
    );
  }

  const fullGraphics = findAssumptions(assumptions, "Graphics", "Coverage", [
    "Full",
  ]);
  if (fullGraphics.length > 0) {
    drivers.push(
      createDriver(
        "Large graphics or full wraps",
        "Full scenic graphics influence production and finishing, but are not double-counted as a separate wall system.",
        3,
        "major",
        fullGraphics[0].asset.name
      )
    );
  }

  return drivers;
}

function getIncludedScope(project: Project, assumptions: ProjectAssumption[]) {
  const detected = Array.from(
    new Set(assumptions.map(({ assumption }) => assumption.detection))
  );
  const included = detected.filter((detection) =>
    [
      "Logo",
      "Graphics",
      "Furniture",
      "Shelving",
      "Lighting",
      "TV/Monitor",
      "Door",
    ].includes(detection)
  );

  const visibleInventory = project.assets.flatMap((asset) => {
    const inventory = asset.aiReview?.fabricationInventory;
    if (!inventory) return [];

    return [
      ...inventory.elements,
      ...inventory.branding,
      ...inventory.lighting,
      ...inventory.finishes,
    ];
  });

  return Array.from(new Set([...included, ...visibleInventory])).slice(0, 10);
}

function getScopeOnlyItems(project: Project, assumptions: ProjectAssumption[]) {
  const scopeOnlyDetections = assumptions
    .filter(({ assumption }) =>
      ["TV/Monitor", "Furniture", "Interactive"].includes(assumption.detection)
    )
    .map(({ assumption }) => assumption.detection);
  const visibleScopeOnly = project.assets.flatMap((asset) => {
    const text = inventoryItems(asset.aiReview || {
      projectType: "",
      estimatedSize: "",
      confidence: 0,
      summary: "",
      fabricationInventory: {
        elements: [],
        branding: [],
        lighting: [],
        finishes: [],
        scaleClues: [],
        unknowns: [],
      },
    });

    return text.filter((item) =>
      /tv|monitor|screen|tablet|audio|furniture|chair|sofa|plant|decor|people|product/i.test(
        item
      )
    );
  });

  return Array.from(new Set([...scopeOnlyDetections, ...visibleScopeOnly])).slice(
    0,
    8
  );
}

function getMissingInfo(project: Project, footprint: EstimateFootprint) {
  const unknowns = project.assets.flatMap(
    (asset) => asset.aiReview?.fabricationInventory.unknowns || []
  );
  const missing = new Set(unknowns);

  if (footprint === "unknown") {
    missing.add("Confirm booth footprint or approximate concept size.");
  }

  if (project.assets.length === 0) {
    missing.add("Upload an image to generate a fabrication estimate.");
  }

  return Array.from(missing).slice(0, 6);
}

function getImpactScore(drivers: FabricationCostDriver[]) {
  return drivers.reduce((total, driver) => total + driver.impact, 0);
}

function getComplexity(
  assumptions: ProjectAssumption[],
  drivers: FabricationCostDriver[]
): EstimateComplexity {
  const impactScore = getImpactScore(drivers);
  const uniqueDetections = new Set(
    assumptions.map(({ assumption }) => assumption.detection)
  ).size;

  if (impactScore >= 17) return "premium";
  if (impactScore >= 12) return "complex";
  if (impactScore >= 8 || uniqueDetections >= 8) {
    return "complex";
  }
  if (impactScore >= 4 || uniqueDetections >= 4) return "moderate";
  return "simple";
}

function getImpactMultiplier(impactScore: number) {
  if (impactScore >= 17) return 1.9;
  if (impactScore >= 12) return 1.6;
  if (impactScore >= 8) return 1.35;
  if (impactScore >= 4) return 1.15;
  return 1;
}

function getCostSavingSuggestions(drivers: FabricationCostDriver[]) {
  const suggestions = drivers.map((driver) => {
    if (driver.label.includes("hard scenic")) {
      return "Consider SEG fabric, rental walls, or simplifying hard scenic wall construction.";
    }
    if (driver.label.includes("Curved")) {
      return "Straightening curved scenic or reducing radius work can lower shop labor.";
    }
    if (driver.label.includes("Overhead")) {
      return "Convert suspended signage to wall-mounted or freestanding signage where possible.";
    }
    if (driver.label.includes("counter")) {
      return "Use rental counters or simplify custom millwork details.";
    }
    if (driver.label.includes("lighting")) {
      return "Reduce integrated lighting zones or use simpler clip-on/display lighting.";
    }
    if (driver.label.includes("Specialty")) {
      return "Swap premium finishes for paint, vinyl, or laminate lookalikes.";
    }
    if (driver.label.includes("flooring")) {
      return "Use standard carpet or partial printed flooring instead of full upgraded flooring.";
    }
    if (driver.label.includes("graphics")) {
      return "Reduce full-surface wraps to key graphic moments or use standard printed panels.";
    }

    return "Review whether this major fabrication driver can be simplified.";
  });

  return Array.from(new Set(suggestions)).slice(0, 5);
}

function getNotesAndAssumptions(
  project: Project,
  footprint: EstimateFootprint,
  complexity: EstimateComplexity
) {
  const notes = [
    "Estimate covers custom fabrication, materials, shop labor, and standard assembly only.",
    "Assumes professional event-grade reusable construction.",
    "Detected common scope is used for context and does not become separate line-item pricing.",
    `Footprint basis: ${FOOTPRINT_BASE_RANGES[footprint].label}.`,
    `Complexity classification: ${complexity}.`,
  ];

  if (footprint === "unknown") {
    notes.push(
      "Footprint was not confirmed; range is conservative and confidence is reduced."
    );
  }

  if (project.budget && project.budget !== "Not sure yet") {
    notes.push(`User-provided target budget: ${project.budget}.`);
  }

  return notes;
}

function calculateConfidence(
  project: Project,
  footprint: EstimateFootprint,
  drivers: FabricationCostDriver[]
) {
  const baseConfidence = FOOTPRINT_BASE_RANGES[footprint].confidence;
  const aiConfidences = project.assets
    .map((asset) => asset.aiReview?.confidence)
    .filter((confidence): confidence is number => typeof confidence === "number");
  const aiAverage =
    aiConfidences.length > 0
      ? aiConfidences.reduce((total, confidence) => total + confidence, 0) /
        aiConfidences.length
      : 65;
  const impactPenalty = Math.min(getImpactScore(drivers), 16);
  const unknownPenalty = footprint === "unknown" ? 10 : 0;

  return Math.max(
    35,
    Math.min(
      92,
      Math.round((baseConfidence + aiAverage) / 2 - impactPenalty - unknownPenalty)
    )
  );
}

export function estimateFabricationBudget(project: Project): FabricationEstimate | null {
  const assumptions = getProjectAssumptions(project);

  if (assumptions.length === 0) {
    return null;
  }

  const footprint = inferFootprint(project);
  const baseRange = FOOTPRINT_BASE_RANGES[footprint];
  const majorCostDrivers = getMajorCostDrivers(assumptions);
  const impactScore = getImpactScore(majorCostDrivers);
  const complexity = getComplexity(assumptions, majorCostDrivers);
  const impactMultiplier = Math.min(
    getImpactMultiplier(impactScore),
    MAX_IMPACT_MULTIPLIER
  );
  const target = Math.min(baseRange.rare * 1.15, baseRange.anchor * impactMultiplier);
  const width = footprint === "unknown" ? 0.24 : 0.12;
  const low = floorToFiveThousand(
    Math.max(baseRange.anchor * 0.85, target * (1 - width))
  );
  const high = ceilToFiveThousand(
    Math.max(baseRange.typicalUpper, target * (1 + width))
  );

  return {
    low,
    high,
    label: `${formatCurrency(low)}-${formatCurrency(high)}`,
    footprint,
    footprintLabel: baseRange.label,
    complexity,
    confidence: calculateConfidence(project, footprint, majorCostDrivers),
    majorCostDrivers,
    includedScope: getIncludedScope(project, assumptions),
    scopeOnlyItems: getScopeOnlyItems(project, assumptions),
    missingInfo: getMissingInfo(project, footprint),
    notesAndAssumptions: getNotesAndAssumptions(
      project,
      footprint,
      complexity
    ),
    exclusions: ESTIMATE_EXCLUSIONS,
    costSavingSuggestions: getCostSavingSuggestions(majorCostDrivers),
  };
}

export function getCostDrivers(project: Project) {
  return estimateFabricationBudget(project)?.majorCostDrivers || [];
}

export function getCostSavingOpportunities(project: Project) {
  return estimateFabricationBudget(project)?.costSavingSuggestions || [];
}

export function groupAssetAssumptions(asset: ProjectAsset) {
  return (asset.fabricationAssumptions || []).reduce<
    Record<string, FabricationAssumption[]>
  >((groups, assumption) => {
    groups[assumption.detection] = groups[assumption.detection] || [];
    groups[assumption.detection].push(assumption);
    return groups;
  }, {});
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function floorToFiveThousand(value: number) {
  if (value < 20000) return Math.floor(value / 1000) * 1000;
  return Math.floor(value / 5000) * 5000;
}

function ceilToFiveThousand(value: number) {
  if (value < 20000) return Math.ceil(value / 1000) * 1000;
  return Math.ceil(value / 5000) * 5000;
}
