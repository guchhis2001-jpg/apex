import { Resend } from "resend";

export const config = { runtime: "edge" };

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export default async function handler(req: Request) {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  if (body.website && body.website.trim() !== "") return json({ ok: true });

  const { name, company, email, phone, interest, message } = body;
  if (!name || !company || !email || !interest) {
    return json({ error: "Missing required fields" }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return json({ error: "Server misconfigured" }, 500);

  const resend = new Resend(apiKey);
  const subject = `New enquiry: ${name} (${company}) — ${interest}`;

  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
      <h2 style="border-bottom: 2px solid #d4232c; padding-bottom: 8px;">New Contact Form Submission</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
        <tr><td style="padding: 8px 0; color: #666; width: 120px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Company</td><td style="padding: 8px 0; font-weight: 600;">${escapeHtml(company)}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Email</td><td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Phone</td><td style="padding: 8px 0;">${escapeHtml(phone || "—")}</td></tr>
        <tr><td style="padding: 8px 0; color: #666;">Interest</td><td style="padding: 8px 0;">${escapeHtml(interest)}</td></tr>
      </table>
      ${
        message
          ? `<div style="margin-top: 24px;"><div style="color: #666; margin-bottom: 8px;">Message</div><div style="background: #f8f8f8; padding: 16px; border-left: 3px solid #d4232c; white-space: pre-wrap;">${escapeHtml(message)}</div></div>`
          : ""
      }
    </div>
  `;

  const text = [
    `New Contact Form Submission`,
    ``,
    `Name: ${name}`,
    `Company: ${company}`,
    `Email: ${email}`,
    `Phone: ${phone || "—"}`,
    `Interest: ${interest}`,
    message ? `\nMessage:\n${message}` : "",
  ].join("\n");

  try {
    const { error } = await resend.emails.send({
      from: "Apex Website <noreply@apex-marcom.com>",
      to: "connect@apex-marcom.com",
      replyTo: email,
      subject,
      html,
      text,
    });
    if (error) {
      console.error("Resend error:", error);
      return json({ error: "Email send failed" }, 500);
    }
    return json({ ok: true });
  } catch (err) {
    console.error("Send error:", err);
    return json({ error: "Email send failed" }, 500);
  }
}
