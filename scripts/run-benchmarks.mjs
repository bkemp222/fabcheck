import fs from "node:fs";
import path from "node:path";

const categories = [
  "walls",
  "flooring",
  "counters",
  "millwork",
  "av",
  "structure",
  "lighting",
  "customFabrication",
];

const weights = {
  walls: 0.85,
  flooring: 0.35,
  counters: 1.05,
  millwork: 1.15,
  av: 0.55,
  structure: 1.25,
  lighting: 0.95,
  customFabrication: 1.45,
};

const baseRanges = {
  "8x8": { anchor: 8000, typicalUpper: 12000, rare: 25000 },
  "10x10": { anchor: 7000, typicalUpper: 10000, rare: 20000 },
  "10x20": { anchor: 15000, typicalUpper: 20000, rare: 35000 },
  "20x20": { anchor: 25000, typicalUpper: 35000, rare: 60000 },
  "30x30": { anchor: 55000, typicalUpper: 65000, rare: 125000 },
};

const exclusions = [
  "Freight",
  "Shipping",
  "Installation",
  "Dismantle",
  "Drayage",
  "Rigging labor",
  "Venue labor",
  "Venue electrical",
  "Furniture rental",
  "AV rental",
  "Taxes",
  "Permits",
  "Venue services",
  "General contractor costs",
];

function profile(values) {
  return Object.fromEntries(categories.map((category) => [category, values[category] || 0]));
}

function profileScore(fabricationProfile) {
  const weightedTotal = categories.reduce(
    (total, category) => total + fabricationProfile[category] * weights[category],
    0
  );
  const activeCategories = categories.filter(
    (category) => fabricationProfile[category] > 0
  ).length;
  const dominantCategories = categories.filter(
    (category) => fabricationProfile[category] >= 7
  ).length;

  return weightedTotal + activeCategories * 0.55 + dominantCategories * 1.1;
}

function multiplier(fabricationProfile) {
  const score = profileScore(fabricationProfile);

  if (score >= 50) return 2.05;
  if (score >= 42) return 1.85;
  if (score >= 34) return 1.65;
  if (score >= 26) return 1.45;
  if (score >= 18) return 1.28;
  if (score >= 10) return 1.14;
  return 1;
}

function floorBudget(value) {
  if (value < 20000) return Math.floor(value / 1000) * 1000;
  return Math.floor(value / 5000) * 5000;
}

function ceilBudget(value) {
  if (value < 20000) return Math.ceil(value / 1000) * 1000;
  return Math.ceil(value / 5000) * 5000;
}

function calculateBudget(footprint, fabricationProfile) {
  const base = baseRanges[footprint];
  const target = Math.min(base.rare * 1.15, base.anchor * multiplier(fabricationProfile));

  return {
    low: floorBudget(Math.max(base.anchor * 0.85, target * 0.88)),
    high: ceilBudget(Math.max(base.typicalUpper, target * 1.12)),
  };
}

function overlaps(a, b) {
  return a.low <= b.high && b.low <= a.high;
}

function makeRecord({
  id,
  projectType,
  footprint,
  version,
  sourceImage,
  expectedBudget,
  fabricationProfile,
  assemblies,
  predecessor = null,
}) {
  return {
    id,
    projectType,
    footprint,
    budgetLow: expectedBudget.low,
    budgetHigh: expectedBudget.high,
    fabricationEffortProfile: fabricationProfile,
    detectedAssemblies: assemblies,
    pricingAssumptions: [
      "Budget includes fabrication materials, shop labor, standard fabrication finishing, and standard assembly.",
      "Printed graphics are treated as assembly finishes rather than separate fabricated objects.",
      "Standard furniture and AV equipment are excluded unless scenic integration is visible.",
    ],
    exclusions,
    cumulativeVersionReference: predecessor,
    sourceImage,
    benchmarkVersion: version,
    calculatedBudget: calculateBudget(footprint, fabricationProfile),
  };
}

const series = [
  {
    key: "10x10-liquidlettuce",
    projectType: "Trade Show Booth",
    footprint: "10x10",
    dir: "10x10",
    budgets: [
      [8000, 10000],
      [9000, 12000],
      [11000, 14000],
      [12000, 17000],
    ],
    profiles: [
      profile({ walls: 4, flooring: 2, counters: 2, lighting: 1 }),
      profile({ walls: 5, flooring: 2, counters: 4, lighting: 2 }),
      profile({ walls: 5, flooring: 3, counters: 5, millwork: 3, lighting: 3 }),
      profile({ walls: 6, flooring: 3, counters: 5, millwork: 4, lighting: 5, customFabrication: 4 }),
    ],
    assemblies: [
      ["Graphic scenic back wall", "Standard flooring", "Compact reception counter"],
      ["Graphic scenic wall returns", "Wrapped reception counter", "Accent lighting"],
      ["Graphic scenic walls", "Reception counter", "Product display millwork"],
      ["Graphic scenic wall system", "Wrapped counter", "Integrated lighting", "Custom display feature"],
    ],
  },
  {
    key: "10x20-boner",
    projectType: "Trade Show Booth",
    footprint: "10x20",
    dir: "10x20",
    budgets: [
      [15000, 20000],
      [16000, 22000],
      [19000, 25000],
      [21000, 28000],
      [24000, 32000],
      [27000, 35000],
    ],
    profiles: [
      profile({ walls: 4, flooring: 2, counters: 4 }),
      profile({ walls: 5, flooring: 2, counters: 5, lighting: 3 }),
      profile({ walls: 5, flooring: 3, counters: 6, millwork: 4, lighting: 3 }),
      profile({ walls: 6, flooring: 3, counters: 6, millwork: 5, lighting: 5 }),
      profile({ walls: 7, flooring: 4, counters: 6, millwork: 6, lighting: 6, customFabrication: 4 }),
      profile({ walls: 7, flooring: 4, counters: 7, millwork: 6, structure: 4, lighting: 7, customFabrication: 5 }),
    ],
    assemblies: [
      ["Graphic scenic walls", "Reception counter"],
      ["Graphic scenic wall system", "Custom counter", "Accent lighting"],
      ["Scenic walls", "Custom counter", "Display millwork"],
      ["Scenic walls", "Counter system", "Integrated lighting"],
      ["Expanded scenic wall system", "Counter and display millwork", "Integrated lighting"],
      ["Scenic wall system", "Custom counters", "Lighted display feature", "Light structural element"],
    ],
  },
  {
    key: "10x20-gunts",
    projectType: "Trade Show Booth",
    footprint: "10x20",
    dir: "10x20",
    budgets: [
      [15000, 20000],
      [18000, 24000],
      [20000, 27000],
      [23000, 30000],
      [25000, 34000],
      [28000, 36000],
    ],
    profiles: [
      profile({ walls: 5, flooring: 2, counters: 3, customFabrication: 2 }),
      profile({ walls: 5, flooring: 3, counters: 5, customFabrication: 4 }),
      profile({ walls: 6, flooring: 3, counters: 5, millwork: 5, customFabrication: 4 }),
      profile({ walls: 6, flooring: 4, counters: 6, millwork: 5, lighting: 5, customFabrication: 5 }),
      profile({ walls: 7, flooring: 4, counters: 6, millwork: 6, lighting: 6, customFabrication: 6 }),
      profile({ walls: 7, flooring: 5, counters: 7, millwork: 6, av: 4, lighting: 6, customFabrication: 7 }),
    ],
    assemblies: [
      ["Graphic scenic wall", "Counter"],
      ["Graphic scenic wall", "Wrapped counter", "Custom brand feature"],
      ["Scenic walls", "Custom counter", "Display millwork"],
      ["Scenic wall system", "Custom counter", "Integrated lighting"],
      ["Expanded scenic walls", "Millwork display", "Integrated lighting", "Custom brand feature"],
      ["Scenic wall system", "Custom counters", "Technology integration", "Custom fabricated feature"],
    ],
  },
  {
    key: "20x20-shrimp",
    projectType: "Trade Show Booth",
    footprint: "20x20",
    dir: "20x20",
    budgets: [
      [25000, 35000],
      [28000, 38000],
      [31000, 42000],
      [36000, 48000],
      [40000, 55000],
      [45000, 60000],
    ],
    profiles: [
      profile({ walls: 5, flooring: 3, counters: 4 }),
      profile({ walls: 6, flooring: 3, counters: 5, lighting: 3 }),
      profile({ walls: 6, flooring: 4, counters: 6, millwork: 5, lighting: 4 }),
      profile({ walls: 7, flooring: 4, counters: 6, millwork: 6, structure: 5, lighting: 5 }),
      profile({ walls: 7, flooring: 5, counters: 7, millwork: 6, structure: 6, lighting: 7, customFabrication: 5 }),
      profile({ walls: 8, flooring: 5, counters: 7, millwork: 7, av: 4, structure: 7, lighting: 7, customFabrication: 6 }),
    ],
    assemblies: [
      ["Island scenic wall", "Counter"],
      ["Scenic walls", "Custom counter", "Accent lighting"],
      ["Scenic walls", "Custom counters", "Display millwork"],
      ["Island wall system", "Counters", "Overhead structure"],
      ["Island scenic system", "Millwork", "Integrated lighting", "Custom feature"],
      ["Island scenic system", "Counters and millwork", "Technology integration", "Overhead structure"],
    ],
  },
  {
    key: "30x30-stepjet",
    projectType: "Trade Show Booth",
    footprint: "30x30",
    dir: "30x30",
    budgets: [
      [55000, 70000],
      [60000, 80000],
      [65000, 90000],
      [75000, 105000],
      [85000, 115000],
      [95000, 130000],
    ],
    profiles: [
      profile({ walls: 5, flooring: 3, counters: 5, millwork: 4 }),
      profile({ walls: 6, flooring: 4, counters: 5, millwork: 5, lighting: 4 }),
      profile({ walls: 7, flooring: 4, counters: 6, millwork: 6, structure: 5, lighting: 5 }),
      profile({ walls: 7, flooring: 5, counters: 7, millwork: 7, structure: 6, lighting: 6, customFabrication: 5 }),
      profile({ walls: 8, flooring: 5, counters: 7, millwork: 7, av: 5, structure: 7, lighting: 7, customFabrication: 6 }),
      profile({ walls: 8, flooring: 6, counters: 8, millwork: 8, av: 5, structure: 8, lighting: 8, customFabrication: 7 }),
    ],
    assemblies: [
      ["Large scenic wall system", "Counters"],
      ["Large scenic walls", "Counters", "Integrated lighting"],
      ["Scenic walls", "Counters", "Millwork", "Structural feature"],
      ["Scenic system", "Counters and millwork", "Overhead structure", "Custom feature"],
      ["Scenic system", "Technology integration", "Overhead structure", "Integrated lighting"],
      ["Premium scenic system", "Counters and millwork", "Technology integration", "Overhead structure", "Custom fabrication"],
    ],
  },
];

const records = series.flatMap((item) =>
  item.budgets.map(([low, high], index) => {
    const version = `b${String(index + 1).padStart(2, "0")}`;
    const id = `${item.key}-${version}`;

    return makeRecord({
      id,
      projectType: item.projectType,
      footprint: item.footprint,
      version,
      sourceImage: `benchmark/${item.dir}/${id}.png`,
      expectedBudget: { low, high },
      fabricationProfile: item.profiles[index],
      assemblies: item.assemblies[index],
      predecessor: index === 0 ? null : `${item.key}-b${String(index).padStart(2, "0")}`,
    });
  })
);

const photoMoments = [
  ["got_worms", [8000, 12000], profile({ walls: 5, flooring: 1, lighting: 4, customFabrication: 5 }), ["Graphic photo wall", "Integrated lighting", "Custom scenic photo feature"]],
  ["laquatius", [9000, 14000], profile({ walls: 5, flooring: 2, structure: 3, lighting: 5, customFabrication: 5 }), ["Photo moment wall", "Light structure", "Integrated lighting", "Custom scenic detail"]],
  ["mutt_cutts", [12000, 18000], profile({ walls: 6, flooring: 2, millwork: 4, lighting: 5, customFabrication: 6 }), ["Photo moment scenic wall", "Display millwork", "Integrated lighting", "Custom fabrication"]],
  ["nurd", [8000, 13000], profile({ walls: 4, flooring: 1, structure: 3, lighting: 4, customFabrication: 5 }), ["Compact scenic structure", "Graphic wall", "Integrated lighting", "Custom photo feature"]],
].map(([id, [low, high], fabricationProfile, assemblies]) =>
  makeRecord({
    id: `photo-moment-${id}`,
    projectType: "Photo Moment",
    footprint: "8x8",
    version: "b01",
    sourceImage: `benchmark/photo_moments/${id}.png`,
    expectedBudget: { low, high },
    fabricationProfile,
    assemblies,
  })
);

records.push(...photoMoments);

const failures = [];

for (const record of records) {
  const expected = { low: record.budgetLow, high: record.budgetHigh };

  if (!overlaps(expected, record.calculatedBudget)) {
    failures.push(
      `${record.id}: expected ${expected.low}-${expected.high}, calculated ${record.calculatedBudget.low}-${record.calculatedBudget.high}`
    );
  }

  if (record.cumulativeVersionReference) {
    const previous = records.find(
      (candidate) => candidate.id === record.cumulativeVersionReference
    );

    if (previous && record.calculatedBudget.high < previous.calculatedBudget.high) {
      failures.push(
        `${record.id}: calculated upper range moved below ${previous.id}`
      );
    }
  }
}

const outputDirectory = path.join(process.cwd(), "benchmark", "generated-json");
fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(
  path.join(outputDirectory, "benchmark-records.json"),
  `${JSON.stringify(records, null, 2)}\n`
);

if (failures.length > 0) {
  console.error("Benchmark validation failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Benchmark validation passed for ${records.length} records.`);
console.log("Wrote benchmark/generated-json/benchmark-records.json");
