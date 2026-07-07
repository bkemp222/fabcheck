import OpenAI from "openai";
import { NextResponse } from "next/server";

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

const content: any[] = [
  {
    type: "input_text",
    text: `
You are FabCheck, an AI assistant for Get Up Creative, a scenic fabrication company.

A customer has uploaded one visual asset. Your job is NOT to deeply review the whole project.
Your job is to create a simple first-draft markup that helps the customer explain the image quickly.

Think like a fabricator briefly scanning the image:
1. What kind of thing is this? Trade show booth, festival activation, photo moment, mobile bar, scenic wall, retail display, custom fabrication, or mixed?
2. What obvious fabricated/produced elements can be identified?
3. What simple customer-friendly notes would help clarify the important parts?

Return ONLY valid JSON in this exact shape:

{
  "projectType": "string",
  "estimatedSize": "string",
  "confidence": number,
  "summary": "string",
  "fabricationInventory": {
    "elements": ["string"],
    "branding": ["string"],
    "lighting": ["string"],
    "finishes": ["string"],
    "scaleClues": ["string"],
    "unknowns": ["string"]
  },
  "suggestedCallouts": [
    {
      "x": number,
      "y": number,
      "note": "string",
      "category": "element | branding | lighting | finish | scale | unknown"
    }
  ]
}

Rules:
- suggestedCallouts should usually contain 3 to 6 pins.
- x and y are percentages from 0 to 100, based on where the pin should appear on the image.
- Notes should be short, plain-English, and customer friendly.
- Do not overwhelm the customer.
- Do not ask about shipping, labor, engineering, electrical code, permits, or fabrication minutiae unless it is visually central.
- Focus on visible things: size/scale, branding, logos, walls, counters, bars, lighting, finishes, displays, graphics, flooring, furniture, props, truss, signage.
- Phrase notes like helpful editable observations, not interrogations.
- Good note example: "Branded front graphic. Confirm logo/artwork is available."
- Good note example: "Possible LED edge lighting. Confirm if this should light up."
- Good note example: "Reception counter or bar structure. Confirm intended use."
- Bad note example: "What are the electrical requirements and power draw?"
- Bad note example: "Confirm fire rating and structural engineering."

Inventory rules:
- projectType should describe the overall likely scope, not force everything into a booth.
- estimatedSize can be "Unknown" if it cannot be reasonably inferred.
- elements should list visible fabricated or produced objects.
- branding should list visible logos, brand graphics, wraps, sponsor marks, dimensional signs, or unclear branding needs.
- lighting should list visible or likely lighting elements.
- finishes should list visible or likely finish materials.
- scaleClues should list anything useful for estimating size, such as people, furniture, TVs, truss, doors, tables, or visible dimensions.
- unknowns should list the most important missing information, but keep it customer-friendly.

Callout rules:
- suggestedCallouts should be generated from the fabrication inventory.
- Each callout should point to an important visible item.
- Avoid duplicate callouts.
- Keep notes short and editable.
- Notes should help the customer confirm or correct the AI's interpretation.
    `,
  },
  {
    type: "input_image",
    image_url: asset.url,
  },
];

const response = await openai.responses.create({
  model: "gpt-4.1-mini",
  input: [
    {
      role: "user",
      content,
    },
  ],
});

    const rawText = response.output_text || "";

    let review;

    try {
      review = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: "AI response was not valid JSON.",
          rawText,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, review });
  } catch (error: any) {
    console.error("AI asset review error:", error);

    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to run AI asset review" },
      { status: 500 }
    );
  }
}