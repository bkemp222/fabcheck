import OpenAI from "openai";
import { NextResponse } from "next/server";
import { FABRICATION_DETECTIONS } from "@/data/fabrication-knowledge";
import {
  FABRICATION_CATEGORIES,
  EMPTY_FABRICATION_PROFILE,
  normalizeFabricationProfile,
} from "@/data/fabrication-profile";
import type {
  FabricatedAssembly,
  FabricationCategory,
  FabricationCategoryEvidence,
  FabricationCategoryProfile,
} from "@/types/project";

type CalloutCategory =
  | "element"
  | "branding"
  | "lighting"
  | "finish"
  | "scale"
  | "unknown";

type AiAssetReviewContent =
  | {
      type: "input_text";
      text: string;
    }
  | {
      type: "input_image";
      image_url: string;
      detail: "auto";
    };

type SuggestedCallout = {
  x: number;
  y: number;
  note: string;
  category: CalloutCategory;
};

type AssetReview = {
  projectType: string;
  estimatedSize: string;
  confidence: number;
  summaryTitle: string;
  summaryText: string;
  summary: string;
  fabricationProfile: FabricationCategoryProfile;
  fabricationCategoryEvidence: FabricationCategoryEvidence;
  fabricatedAssemblies: FabricatedAssembly[];
  fabricationInventory: {
    elements: string[];
    branding: string[];
    lighting: string[];
    finishes: string[];
    scaleClues: string[];
    unknowns: string[];
  };
  suggestedCallouts: SuggestedCallout[];
  pins: SuggestedCallout[];
};

const calloutCategories: CalloutCategory[] = [
  "element",
  "branding",
  "lighting",
  "finish",
  "scale",
  "unknown",
];

const fallbackSummary =
  "The concept image uploaded successfully, but FabCheck could not generate starter notes.";

const assetReviewSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "projectType",
    "estimatedSize",
    "confidence",
    "summaryTitle",
    "summaryText",
    "summary",
    "fabricationProfile",
    "fabricationCategoryEvidence",
    "fabricatedAssemblies",
    "fabricationInventory",
    "suggestedCallouts",
    "pins",
  ],
  properties: {
    projectType: { type: "string" },
    estimatedSize: { type: "string" },
    confidence: { type: "number", minimum: 0, maximum: 100 },
    summaryTitle: { type: "string" },
    summaryText: { type: "string" },
    summary: { type: "string" },
    fabricationProfile: {
      type: "object",
      additionalProperties: false,
      required: FABRICATION_CATEGORIES,
      properties: Object.fromEntries(
        FABRICATION_CATEGORIES.map((category) => [
          category,
          { type: "integer", minimum: 0, maximum: 10 },
        ])
      ),
    },
    fabricationCategoryEvidence: {
      type: "object",
      additionalProperties: false,
      required: FABRICATION_CATEGORIES,
      properties: Object.fromEntries(
        FABRICATION_CATEGORIES.map((category) => [
          category,
          { type: "string" },
        ])
      ),
    },
    fabricatedAssemblies: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "category", "evidence"],
        properties: {
          label: { type: "string" },
          category: { type: "string", enum: FABRICATION_CATEGORIES },
          evidence: { type: "string" },
        },
      },
    },
    fabricationInventory: {
      type: "object",
      additionalProperties: false,
      required: [
        "elements",
        "branding",
        "lighting",
        "finishes",
        "scaleClues",
        "unknowns",
      ],
      properties: {
        elements: { type: "array", items: { type: "string" } },
        branding: { type: "array", items: { type: "string" } },
        lighting: { type: "array", items: { type: "string" } },
        finishes: { type: "array", items: { type: "string" } },
        scaleClues: { type: "array", items: { type: "string" } },
        unknowns: { type: "array", items: { type: "string" } },
      },
    },
    suggestedCallouts: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["x", "y", "note", "category"],
        properties: {
          x: { type: "number", minimum: 0, maximum: 100 },
          y: { type: "number", minimum: 0, maximum: 100 },
          note: { type: "string" },
          category: { type: "string", enum: calloutCategories },
        },
      },
    },
    pins: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["x", "y", "note", "category"],
        properties: {
          x: { type: "number", minimum: 0, maximum: 100 },
          y: { type: "number", minimum: 0, maximum: 100 },
          note: { type: "string" },
          category: { type: "string", enum: calloutCategories },
        },
      },
    },
  },
};

const reviewPrompt = `
You are FabCheck, a fabrication review tool for Get Up Creative, a scenic fabrication company.

A customer has uploaded one visual asset. Your job is NOT to deeply review the whole project.
Your job is to create a simple first-draft markup that helps the customer explain the image quickly.

Think like a fabricator briefly scanning the image:
1. What kind of thing is this? Trade show booth, festival activation, photo moment, mobile bar, scenic wall, retail display, custom fabrication, or mixed?
2. What visible fabricated assemblies can be identified?
3. What simple customer-friendly notes would help clarify the important parts?

When naming detected fabrication assets, prefer these knowledge-base labels when they fit:
${FABRICATION_DETECTIONS.join(", ")}

Return only valid JSON. Do not include markdown, code fences, commentary, or text outside the JSON object.

Benchmark interpretation principles:
- Identify fabricated assemblies, not separate visual traits.
- A graphic scenic wall is one assembly, not separate wall, graphic, branding, and logo items.
- A wrapped reception counter is one assembly, not separate counter, laminate, vinyl, and branding items.
- A halo-lit dimensional logo is one assembly with lighting and custom fabrication influence.
- Flat printed branding is part of the assembly finish.
- Treat branding as independent only when it is dimensional, illuminated, freestanding, suspended, sculptural, or custom fabricated.
- Do not try to distinguish SEG fabric from hard scenic with vinyl where the rendering is ambiguous. Use assembly language such as graphic wall.
- Distinguish visible integrated fabrication lighting from ambient render or venue lighting.
- Recognize AV presence, but do not include ordinary AV rental cost as fabrication effort. Score only scenic integration or mounting complexity.
- Scores represent fabrication effort and cost influence, not visual prominence. Scores do not need to add to 10 or 100.
- Custom Fabrication should reflect density and scale, not mere presence. One large custom hero prop or sculptural assembly should usually score strongly. Multiple independent large custom assemblies, such as product replicas, mascot figures, sculptural scenic elements, custom photo props, fabricated packaging, organic forms, or separate dimensional scenic pieces, should increase the score substantially.
- Do not count every decorative object. Only increase Custom Fabrication for independent assemblies that could reasonably be fabricated separately.

Use exactly these fabricationProfile categories with integer scores from 0 to 10:
- walls
- flooring
- counters
- millwork
- av
- structure
- lighting
- customFabrication

Rules:
- suggestedCallouts and pins should contain the same 3 to 6 starter notes based on fabricated assemblies.
- x and y are percentages from 0 to 100, based on where the pin should appear on the image.
- Notes should be short, plain-English, and customer friendly.
- Do not overwhelm the customer.
- Do not ask about shipping, labor, engineering, electrical code, permits, or fabrication minutiae unless it is visually central.
- Focus on visible things: size/scale, branding, logos, walls, counters, bars, lighting, finishes, displays, graphics, flooring, furniture, props, truss, signage.
- Prioritize items an exhibit fabricator would normally fabricate: scenic walls, counters, bars, platforms, hanging signs, truss, large graphics, integrated lighting, specialty finishes, doors, storage, shelving, and display structures.
- TVs, LED walls, tablets, furniture, plants, people, loose decor, and products can be useful scale/scope clues, but they should not be described as custom fabrication unless they are visibly integrated into scenic construction.
- Ignore tiny props, counter clutter, laptops, brochures, food, clothing, and coffee cups.
- Phrase notes like helpful editable observations, not interrogations.
- Good note example: "Branded front graphic. Confirm logo/artwork is available."
- Good note example: "Possible LED edge lighting. Confirm if this should light up."
- Good note example: "Reception counter or bar structure. Confirm intended use."
- Bad note example: "What are the electrical requirements and power draw?"
- Bad note example: "Confirm fire rating and structural engineering."

Inventory rules:
- projectType should describe the overall likely scope, not force everything into a booth.
- estimatedSize can be "Unknown" if it cannot be reasonably inferred.
- confidence should be a number from 0 to 100.
- summaryTitle should be a short title for the starter review.
- summaryText and summary should contain the same concise customer-friendly overview.
- elements should list visible fabricated or produced objects.
- branding should list visible logos, brand graphics, wraps, sponsor marks, dimensional signs, or unclear branding needs.
- lighting should list visible or likely lighting elements.
- finishes should list visible or likely finish materials.
- scaleClues should list anything useful for estimating size, such as people, furniture, TVs, truss, doors, tables, or visible dimensions.
- unknowns should list the most important missing information, but keep it customer-friendly.

Callout rules:
- suggestedCallouts should be generated from fabricatedAssemblies.
- Each callout should point to an important visible fabricated assembly.
- Avoid duplicate callouts.
- Do not create separate pins for wall, logo, branding, finish, and graphic when those belong to one assembly.
- Keep notes short and editable.
- Notes should help the customer confirm or correct the AI's interpretation.
`;

function emptyInventory(): AssetReview["fabricationInventory"] {
  return {
    elements: [],
    branding: [],
    lighting: [],
    finishes: [],
    scaleClues: [],
    unknowns: [],
  };
}

function fallbackReview(): AssetReview {
  return {
    projectType: "Unknown",
    estimatedSize: "Unknown",
    confidence: 0,
    summaryTitle: "Review setup needed",
    summaryText: fallbackSummary,
    summary: fallbackSummary,
    fabricationProfile: EMPTY_FABRICATION_PROFILE,
    fabricationCategoryEvidence: {},
    fabricatedAssemblies: [],
    fabricationInventory: emptyInventory(),
    suggestedCallouts: [],
    pins: [],
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("AI review JSON was not an object.");
  }

  return value as Record<string, unknown>;
}

function stringValue(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function stringList(value: unknown): string[] {
  return Array.isArray(value)
    ? value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

function boundedNumber(value: unknown, fallback: number, min = 0, max = 100) {
  const numberValue = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numberValue)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, numberValue));
}

function normalizeCategory(value: unknown): CalloutCategory {
  return calloutCategories.includes(value as CalloutCategory)
    ? (value as CalloutCategory)
    : "element";
}

function normalizeFabricationCategory(value: unknown): FabricationCategory {
  return FABRICATION_CATEGORIES.includes(value as FabricationCategory)
    ? (value as FabricationCategory)
    : "customFabrication";
}

function normalizeCategoryEvidence(
  value: unknown
): FabricationCategoryEvidence {
  const record =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  return FABRICATION_CATEGORIES.reduce<FabricationCategoryEvidence>(
    (evidence, category) => ({
      ...evidence,
      [category]: stringValue(record[category], ""),
    }),
    {}
  );
}

function normalizeFabricatedAssemblies(value: unknown): FabricatedAssembly[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const assemblies: FabricatedAssembly[] = [];

  for (const item of value) {
    const record =
      item && typeof item === "object" && !Array.isArray(item)
        ? (item as Record<string, unknown>)
        : null;

    if (!record) {
      continue;
    }

    const label = stringValue(record.label, "");

    if (!label) {
      continue;
    }

    assemblies.push({
      label,
      category: normalizeFabricationCategory(record.category),
      evidence: stringValue(record.evidence, ""),
    });
  }

  return assemblies.slice(0, 12);
}

function normalizeCallouts(value: unknown): SuggestedCallout[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      const record =
        item && typeof item === "object" && !Array.isArray(item)
          ? (item as Record<string, unknown>)
          : null;

      if (!record) {
        return null;
      }

      const note = stringValue(record.note, "");

      if (!note) {
        return null;
      }

      return {
        x: boundedNumber(record.x, 50),
        y: boundedNumber(record.y, 50),
        note,
        category: normalizeCategory(record.category),
      };
    })
    .filter((callout): callout is SuggestedCallout => Boolean(callout))
    .slice(0, 8);
}

function stripCodeFence(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);

  return fenced?.[1]?.trim() || trimmed;
}

function extractFirstJsonObject(text: string): string | null {
  const start = text.indexOf("{");

  if (start === -1) {
    return null;
  }

  let depth = 0;
  let isInString = false;
  let isEscaped = false;

  for (let index = start; index < text.length; index += 1) {
    const character = text[index];

    if (isInString) {
      if (isEscaped) {
        isEscaped = false;
      } else if (character === "\\") {
        isEscaped = true;
      } else if (character === "\"") {
        isInString = false;
      }

      continue;
    }

    if (character === "\"") {
      isInString = true;
    } else if (character === "{") {
      depth += 1;
    } else if (character === "}") {
      depth -= 1;

      if (depth === 0) {
        return text.slice(start, index + 1);
      }
    }
  }

  return null;
}

function normalizeReview(value: unknown): AssetReview {
  const review = asRecord(value);
  const inventory = asRecord(review.fabricationInventory);
  const callouts = normalizeCallouts(
    review.suggestedCallouts || review.pins
  );
  const fabricationProfile = normalizeFabricationProfile(
    review.fabricationProfile as Partial<Record<FabricationCategory, unknown>>
  );
  const summaryText = stringValue(
    review.summaryText || review.summary,
    "FabCheck created starter notes for this concept image."
  );

  return {
    projectType: stringValue(review.projectType, "Unknown"),
    estimatedSize: stringValue(review.estimatedSize, "Unknown"),
    confidence: boundedNumber(review.confidence, 0),
    summaryTitle: stringValue(review.summaryTitle, "FabCheck first pass"),
    summaryText,
    summary: summaryText,
    fabricationProfile,
    fabricationCategoryEvidence: normalizeCategoryEvidence(
      review.fabricationCategoryEvidence
    ),
    fabricatedAssemblies: normalizeFabricatedAssemblies(
      review.fabricatedAssemblies
    ),
    fabricationInventory: {
      elements: stringList(inventory.elements),
      branding: stringList(inventory.branding),
      lighting: stringList(inventory.lighting),
      finishes: stringList(inventory.finishes),
      scaleClues: stringList(inventory.scaleClues),
      unknowns: stringList(inventory.unknowns),
    },
    suggestedCallouts: callouts,
    pins: callouts,
  };
}

function parseReview(rawText: string): AssetReview {
  const trimmed = rawText.trim();
  const unfenced = stripCodeFence(trimmed);
  const extracted = extractFirstJsonObject(unfenced);
  const candidates = [trimmed, unfenced, extracted].filter(
    (candidate): candidate is string => Boolean(candidate)
  );
  const uniqueCandidates = Array.from(new Set(candidates));
  const errors: string[] = [];

  for (const candidate of uniqueCandidates) {
    try {
      return normalizeReview(JSON.parse(candidate));
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }

  throw new Error(errors.at(-1) || "AI response was not valid JSON.");
}

async function createAiReview(openai: OpenAI, content: AiAssetReviewContent[]) {
  try {
    return await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "fabcheck_asset_review",
          description: "Starter fabrication review and editable image pins.",
          strict: true,
          schema: assetReviewSchema,
        },
      },
    });
  } catch (error) {
    console.warn(
      "Structured AI asset review failed. Retrying with JSON mode.",
      error
    );

    return openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content,
        },
      ],
      text: {
        format: {
          type: "json_object",
        },
      },
    });
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { ok: false, error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const asset = await request.json();

    if (!asset?.url || !asset?.type?.startsWith("image/")) {
      return NextResponse.json(
        { ok: false, error: "No image asset provided." },
        { status: 400 }
      );
    }

    const content: AiAssetReviewContent[] = [
      {
        type: "input_text",
        text: reviewPrompt,
      },
      {
        type: "input_image",
        image_url: asset.url,
        detail: "auto",
      },
    ];

    const response = await createAiReview(openai, content);
    const rawText = response.output_text || "";

    try {
      return NextResponse.json({ ok: true, review: parseReview(rawText) });
    } catch (error) {
      console.error("AI asset review JSON parse failed:", error);
      console.error("Raw AI asset review response:", rawText);

      return NextResponse.json({
        ok: true,
        review: fallbackReview(),
        error:
          error instanceof Error
            ? error.message
            : "AI response was not valid JSON.",
      });
    }
  } catch (error: unknown) {
    console.error("AI asset review error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to run AI asset review";

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
