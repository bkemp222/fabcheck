import { Resend } from "resend";
import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";

function generatePdf(project: any): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 48 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    doc.fontSize(26).text("FABCHECK PACKAGE", { underline: true });
    doc.moveDown();

    doc.fontSize(16).text(project.name || "Untitled Package");
    doc.fontSize(11).fillColor("gray");
    doc.text(project.eventType || "Event Type");
    doc.text(project.company || "Company");
    doc.text(project.venue || "Venue / City");
    doc.text(project.budget || "Budget");
    doc.moveDown();

    doc.fillColor("black").fontSize(14).text("Contact Information");
    doc.fontSize(11);
    doc.text(`Name: ${project.contactName || "Not added"}`);
    doc.text(`Email: ${project.contactEmail || "Not added"}`);
    doc.text(`Phone: ${project.contactPhone || "Not added"}`);
    doc.moveDown();

    project.assets.forEach((asset: any, assetIndex: number) => {
      doc.addPage();

      doc.fillColor("black").fontSize(18).text(`Asset ${assetIndex + 1}: ${asset.name}`);

      asset.callouts.forEach((callout: any, index: number) => {
        doc.moveDown();
        doc.fontSize(13).text(`Callout ${index + 1}`, { underline: true });
        doc.fontSize(11).text(callout.note || "No note added.");
      });
    });

    doc.end();
  });
}

export async function POST(request: Request) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!resendApiKey) {
      return NextResponse.json({ ok: false, error: "Missing RESEND_API_KEY" }, { status: 500 });
    }

    if (!adminEmail) {
      return NextResponse.json({ ok: false, error: "Missing ADMIN_EMAIL" }, { status: 500 });
    }

    const project = await request.json();

    const totalCallouts = project.assets.reduce(
      (total: number, asset: any) => total + asset.callouts.length,
      0
    );

    const pdfBuffer = await generatePdf(project);
    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: "FabCheck <noreply@getupcreative.com>",
      to: adminEmail,
      subject: `New FabCheck Package: ${project.name || "Untitled Package"}`,
      html: `
        <h1>New FabCheck Package</h1>
        <p><strong>Project:</strong> ${project.name || "Untitled Package"}</p>
        <p><strong>Company:</strong> ${project.company || "Not added"}</p>
        <p><strong>Assets:</strong> ${project.assets.length}</p>
        <p><strong>Callouts:</strong> ${totalCallouts}</p>
        <p>PDF package attached.</p>
      `,
      attachments: [
        {
          filename: `FabCheck-${project.name || "Package"}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Submit package error:", error);

    return NextResponse.json(
      { ok: false, error: error?.message || "Failed to submit package" },
      { status: 500 }
    );
  }
}