import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
const resendApiKey = process.env.RESEND_API_KEY;
const adminEmail = process.env.ADMIN_EMAIL;

console.log({
  hasResendKey: !!resendApiKey,
  hasAdminEmail: !!adminEmail,
});

    if (!resendApiKey) {
      return NextResponse.json(
        { ok: false, error: "Missing RESEND_API_KEY" },
        { status: 500 }
      );
    }

    if (!adminEmail) {
      return NextResponse.json(
        { ok: false, error: "Missing ADMIN_EMAIL" },
        { status: 500 }
      );
    }

    const project = await request.json();

    const totalCallouts = project.assets.reduce(
      (total: number, asset: any) => total + asset.callouts.length,
      0
    );

    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: "FabCheck <noreply@getupcreative.com>",
      to: adminEmail,
      subject: `New FabCheck Package: ${project.name || "Untitled Package"}`,
      html: `
        <h1>New FabCheck Package</h1>

        <h2>Project</h2>
        <p><strong>Name:</strong> ${project.name || "Not added"}</p>
        <p><strong>Company:</strong> ${project.company || "Not added"}</p>
        <p><strong>Type:</strong> ${project.eventType || "Not added"}</p>
        <p><strong>Venue:</strong> ${project.venue || "Not added"}</p>
        <p><strong>Budget:</strong> ${project.budget || "Not added"}</p>

        <h2>Contact</h2>
        <p><strong>Name:</strong> ${project.contactName || "Not added"}</p>
        <p><strong>Email:</strong> ${project.contactEmail || "Not added"}</p>
        <p><strong>Phone:</strong> ${project.contactPhone || "Not added"}</p>

        <h2>Summary</h2>
        <p><strong>Assets:</strong> ${project.assets.length}</p>
        <p><strong>Callouts:</strong> ${totalCallouts}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Submit package error:", error);

    return NextResponse.json(
      { ok: false, error: "Failed to submit package" },
      { status: 500 }
    );
  }
}