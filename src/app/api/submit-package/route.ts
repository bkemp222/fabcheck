import { Resend } from "resend";
import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

function cleanFileName(value: string) {
  return value.replace(/[^a-z0-9-_]/gi, "-").replace(/-+/g, "-");
}

function drawWrappedText({
  page,
  text,
  x,
  y,
  size,
  font,
  color = rgb(0, 0, 0),
  maxWidth,
  lineHeight,
}: any) {
  const words = String(text || "").split(" ");
  let line = "";
  let currentY = y;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, size);

    if (width > maxWidth && line) {
      page.drawText(line, { x, y: currentY, size, font, color });
      line = word;
      currentY -= lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line) {
    page.drawText(line, { x, y: currentY, size, font, color });
  }

  return currentY - lineHeight;
}

async function generatePdf(project: any) {
  const pdfDoc = await PDFDocument.create();
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 48;

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  page.drawText("FABCHECK PACKAGE", {
    x: margin,
    y,
    size: 28,
    font: bold,
    color: rgb(0, 0, 0),
  });

  y -= 44;

  page.drawText(project.name || "Untitled Package", {
    x: margin,
    y,
    size: 18,
    font: bold,
  });

  y -= 28;

  const projectLines = [
    ["Type", project.eventType],
    ["Company", project.company],
    ["Venue", project.venue],
    ["Budget", project.budget],
  ];

  projectLines.forEach(([label, value]) => {
    page.drawText(`${label}: ${value || "Not added"}`, {
      x: margin,
      y,
      size: 11,
      font: regular,
      color: rgb(0.25, 0.25, 0.25),
    });
    y -= 17;
  });

  y -= 18;

  page.drawText("CONTACT INFORMATION", {
    x: margin,
    y,
    size: 13,
    font: bold,
  });

  y -= 22;

  const contactLine = `${project.contactName || "Not added"}  |  ${
    project.contactEmail || "Not added"
  }  |  ${project.contactPhone || "Not added"}`;

  y = drawWrappedText({
    page,
    text: contactLine,
    x: margin,
    y,
    size: 11,
    font: regular,
    maxWidth: pageWidth - margin * 2,
    lineHeight: 15,
  });

  for (const [assetIndex, asset] of project.assets.entries()) {
    page = pdfDoc.addPage([pageWidth, pageHeight]);
    y = pageHeight - margin;

    page.drawText(`ASSET ${assetIndex + 1}`, {
      x: margin,
      y,
      size: 18,
      font: bold,
    });

    y -= 26;

    y = drawWrappedText({
      page,
      text: asset.name || "Untitled Asset",
      x: margin,
      y,
      size: 12,
      font: bold,
      maxWidth: pageWidth - margin * 2,
      lineHeight: 16,
    });

    y -= 10;

    if (asset.url && asset.type?.startsWith("image/")) {
  try {
    const base64Data = asset.url.split(",")[1];
    const imageBytes = Buffer.from(base64Data, "base64");

    const image =
      asset.type === "image/png"
        ? await pdfDoc.embedPng(imageBytes)
        : await pdfDoc.embedJpg(imageBytes);

    const maxImageWidth = 300;
    const maxImageHeight = 360;

    const scaled = image.scaleToFit(maxImageWidth, maxImageHeight);

    page.drawImage(image, {
      x: margin,
      y: y - scaled.height,
      width: scaled.width,
      height: scaled.height,
    });

    asset.callouts.forEach((callout: any, index: number) => {
  const pinX = margin + (callout.x / 100) * scaled.width;
  const pinY = y - scaled.height + scaled.height - (callout.y / 100) * scaled.height;

  page.drawCircle({
    x: pinX,
    y: pinY,
    size: 12,
    color: rgb(1, 0.54, 0),
  });

  page.drawText(String(index + 1), {
    x: pinX - 3.5,
    y: pinY - 4,
    size: 10,
    font: bold,
    color: rgb(0, 0, 0),
  });
});

    y -= scaled.height + 24;
  } catch (error) {
    console.error("Image embed failed:", error);

    page.drawText("Image could not be embedded.", {
      x: margin,
      y,
      size: 11,
      font: regular,
      color: rgb(0.6, 0.1, 0.1),
    });

    y -= 20;
  }
}

    if (asset.callouts.length === 0) {
      page.drawText("No callouts added.", {
        x: margin,
        y,
        size: 11,
        font: regular,
        color: rgb(0.45, 0.45, 0.45),
      });
    } else {
      for (const [index, callout] of asset.callouts.entries()) {
        if (y < 120) {
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }

        page.drawText(`CALLOUT ${index + 1}`, {
          x: margin,
          y,
          size: 13,
          font: bold,
        });

        y -= 20;

        y = drawWrappedText({
          page,
          text: callout.note || "No note added.",
          x: margin,
          y,
          size: 11,
          font: regular,
          maxWidth: pageWidth - margin * 2,
          lineHeight: 15,
          color: rgb(0.25, 0.25, 0.25),
        });

        y -= 12;
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

export async function POST(request: Request) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;

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
    console.log(project.assets[0]?.url?.substring(0, 40));

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
          filename: `FabCheck-${cleanFileName(
            project.name || "Package"
          )}.pdf`,
          content: pdfBuffer.toString("base64"),
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