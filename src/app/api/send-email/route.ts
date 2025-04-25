import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import EmailTemplate from "@/components/EmailTemplate/EmailTemplate";
import { render } from "@react-email/render";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    // Convert NextRequest to readable stream for  formData parsing
    const formData = await req.formData();
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const content = formData.get("content") as string;
    const logo = formData.get("logo") as File;

    // Validate required fields
    if (!email || !subject || !content || !logo) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate HTML email template (await the render result)
    // here render is a function from @react-email/render
    // that takes a React component and returns a string of HTML
    const emailHtml = await render(
      EmailTemplate({
        subject: subject,
        content: content,
        logoUrl: "cid:logo",
      })
    );

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Convert File to buffer for nodemailer
    const logoBuffer = Buffer.from(await logo.arrayBuffer());

    // Send email
    const info = await transporter.sendMail({
      from: `"Your Company" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: emailHtml,
      attachments: [
        {
          filename: logo.name || "logo.png",
          content: logoBuffer,
          cid: "logo",
        },
      ],
    });

    return NextResponse.json(
      { success: true, messageId: info.messageId },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: error || "Failed to send email" },
      { status: 500 }
    );
  }
}
