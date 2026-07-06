import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const adminEmail = process.env.ADMIN_EMAIL;

export async function POST(request: Request) {
    console.log("Submit package route hit");
  try {
    const project = await request.json();

    const totalCallouts = project.assets.reduce(
      (total: number, asset: any) => total + asset.callouts.length,
      0
    );

const result = await resend.emails.send({
      from: "FabCheck <onboarding@resend.dev>",
      to: adminEmail!,
      subject: `New FabCheck Package: ${project.name || "Untitled Package"}`,
      html: `
        <h1>New FabCheck Package</h1>

        <h2>Contact</h2>
        <p><strong>Name:</strong> ${project.contactName || "Not added"}</p>
        <p><strong>Email:</strong> ${project.contactEmail || "Not added"}</p>
        <p><strong>Phone:</strong> ${project.contactPhone || "Not added"}</p>

        <h2>Project</h2>
        <p><strong>Name:</strong> ${project.name || "Untitled Package"}</p>
        <p><strong>Company:</strong> ${project.company || "Not added"}</p>
        <p><strong>Type:</strong> ${project.eventType}</p>
        <p><strong>Venue:</strong> ${project.venue || "Not added"}</p>
        <p><strong>Budget:</strong> ${project.budget}</p>

        <h2>Summary</h2>
        <p><strong>Assets:</strong> ${project.assets.length}</p>
        <p><strong>Callouts:</strong> ${totalCallouts}</p>

        <h2>Callout Notes</h2>
        ${project.assets
          .map(
            (asset: any, assetIndex: number) => `
              <h3>Asset ${assetIndex + 1}: ${asset.name}</h3>
              ${
                asset.callouts.length
                  ? asset.callouts
                      .map(
                        (callout: any, index: number) => `
                          <p><strong>Callout #${index + 1}:</strong> ${
                          callout.note || "No note added."
                        }</p>
                        `
                      )
                      .join("")
                  : "<p>No callouts added.</p>"
              }
            `
          )
          .join("")}
      `,
    });

    console.log("Resend result:", result);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("FabCheck submit error:", error);

    return NextResponse.json(
      { ok: false, error: "Failed to submit package." },
      { status: 500 }
    );
  }
}