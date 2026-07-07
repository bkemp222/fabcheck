import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { ok: false, error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const project = await request.json();

    const imageAssets = project.assets
      .filter((asset: any) => asset.type?.startsWith("image/"))
      .slice(0, 3);

    if (imageAssets.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No image assets found for AI review." },
        { status: 400 }
      );
    }

    const content: any[] = [
      {
        type: "input_text",
        text: `
You are FabCheck, an AI assistant for a scenic fabrication company.

Review this customer-submitted project package as if you are helping a fabricator understand what is buildable, unclear, missing, risky, or worth asking about.

Return ONLY valid JSON using this exact shape:

{
  "score": number,
  "summary": string,
  "identifiedElements": string[],
  "missingInformation": string[],
  "fabricationQuestions": string[],
  "productionConcerns": string[],
  "suggestedNextSteps": string[]
}

Score should be 0-100 based on production readiness.

Project info:
Name: ${project.name || "Not provided"}
Company: ${project.company || "Not provided"}
Event Type: ${project.eventType || "Not provided"}
Venue: ${project.venue || "Not provided"}
Budget: ${project.budget || "Not provided"}

Customer callouts:
${project.assets
  .flatMap((asset: any) =>
    asset.callouts.map(
      (callout: any, index: number) =>
        `- ${asset.name}, callout ${index + 1}: ${
          callout.note || "No note provided"
        }`
    )
  )
  .join("\n")}
        `,
      },
    ];

    imageAssets.forEach((asset: any) => {
      content.push({
        type: "input_image",
        image_url: asset.url,
      });
    });

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
    console.error("AI review error:", error);

    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to run AI review" },
      { status: 500 }
    );
  }
}