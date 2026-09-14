import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Please provide your name, email, and message." },
        { status: 400 }
      );
    }

    const targetEmail = process.env.CONTACT_EMAIL || process.env.GMAIL_USER || "zandriebarraba.1305@gmail.com";
    let delivered = false;
    let deliveryMethod = "";

    // 1. Primary: Formspree (xqpkvwqz)
    const formspreeEndpoint = process.env.FORMSPREE_ENDPOINT || "https://formspree.io/f/xqpkvwqz";
    try {
      const formspreeRes = await fetch(formspreeEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _replyto: email,
          _subject: `New Portfolio Message from ${name}`,
        }),
      });

      if (formspreeRes.ok) {
        delivered = true;
        deliveryMethod = "formspree";
      }
    } catch (err) {
      console.warn("Formspree dispatch error:", err);
    }

    // 2. Secondary: Direct Gmail SMTP using Nodemailer (if configured)
    if (!delivered && process.env.GMAIL_APP_PASSWORD) {
      try {
        const gmailUser = process.env.GMAIL_USER || "zandriebarraba.1305@gmail.com";
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: gmailUser,
            pass: process.env.GMAIL_APP_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: `"Portfolio Contact Form" <${gmailUser}>`,
          to: targetEmail,
          replyTo: email,
          subject: `New Portfolio Message from ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #f9f9fb; padding: 25px; color: #222;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <div style="background-color: #111827; padding: 20px 25px; color: #ffffff;">
                  <h2 style="margin: 0; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; color: #ffffff;">
                    New Portfolio <span style="color: #ea580c;">Inquiry</span>
                  </h2>
                </div>
                <div style="padding: 25px;">
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-size: 13px; font-weight: bold; text-transform: uppercase; width: 120px;">Sender Name:</td>
                      <td style="padding: 8px 0; color: #111827; font-size: 15px; font-weight: 600;">${name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-size: 13px; font-weight: bold; text-transform: uppercase;">Sender Email:</td>
                      <td style="padding: 8px 0; color: #ea580c; font-size: 15px;">
                        <a href="mailto:${email}" style="color: #ea580c; text-decoration: none;">${email}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280; font-size: 13px; font-weight: bold; text-transform: uppercase;">Sent At:</td>
                      <td style="padding: 8px 0; color: #4b5563; font-size: 13px;">${new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })} (PHT)</td>
                    </tr>
                  </table>

                  <div style="color: #6b7280; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 8px;">Message:</div>
                  <div style="background-color: #f3f4f6; padding: 18px; border-radius: 6px; font-size: 14px; line-height: 1.6; color: #1f2937; border-left: 4px solid #ea580c; white-space: pre-wrap;">
${message}
                  </div>

                  <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #f3f4f6; font-size: 12px; color: #9ca3af; text-align: center;">
                    Tip: Simply hit <strong>Reply</strong> in your email client to respond directly to ${name}.
                  </div>
                </div>
              </div>
            </div>
          `,
        });

        delivered = true;
        deliveryMethod = "gmail-smtp";
      } catch (e) {
        console.warn("Gmail SMTP error:", e);
      }
    }

    // 2. Secondary: Resend API
    if (!delivered && process.env.RESEND_API_KEY) {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: [targetEmail],
          reply_to: email,
          subject: `New Portfolio Message from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        }),
      });

      if (resendRes.ok) {
        delivered = true;
        deliveryMethod = "resend";
      }
    }

    // 3. Fallback: Web3Forms API (using user's key from dashboard)
    const web3Key = process.env.WEB3FORMS_ACCESS_KEY || "1a0fae38-6e0a-4cf5-855c-c90366f8e2cb";
    if (!delivered && web3Key) {
      try {
        const web3Res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: web3Key,
            name,
            email,
            message,
            subject: `New Portfolio Message from ${name}`,
            from_name: name,
          }),
        });

        const contentType = web3Res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const web3Data = await web3Res.json();
          if (web3Data.success) {
            delivered = true;
            deliveryMethod = "web3forms";
          }
        }
      } catch (err) {
        console.warn("Web3Forms dispatch error:", err);
      }
    }

    if (delivered) {
      return NextResponse.json({
        success: true,
        message: "Message delivered successfully to your Gmail.",
        method: deliveryMethod,
      });
    }

    // If no provider keys are configured yet, notify the user with actionable instructions
    return NextResponse.json(
      {
        success: false,
        error:
          "Email service not yet configured. Please add GMAIL_APP_PASSWORD or WEB3FORMS_ACCESS_KEY to your environment variables.",
      },
      { status: 503 }
    );
  } catch (error: any) {
    console.error("Error sending contact message:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send message." },
      { status: 500 }
    );
  }
}

