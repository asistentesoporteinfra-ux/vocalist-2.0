import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ContactPayload = {
  company?: string;
  name?: string;
  email?: string;
  sector?: string;
  message?: string;
};

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function normalizeHeader(value: string): string {
  return value.replace(/[\r\n]+/g, " ");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { message: "JSON invalido." },
      { status: 400 },
    );
  }

  const to = clean(process.env.CONTACT_TO ?? "b.morgado@calldomdelcaribe.com");
  const host = clean(process.env.SMTP_HOST);
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = clean(process.env.SMTP_USER);
  const pass = clean(process.env.SMTP_PASS);
  const from = clean(process.env.SMTP_FROM);

  const name = clean(payload.name);
  const email = clean(payload.email);
  const company = clean(payload.company);
  const sector = clean(payload.sector);
  const message = clean(payload.message);

  if (!host || !user || !pass || !from || !to) {
    return NextResponse.json(
      {
        message:
          "Faltan variables SMTP. Define SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM y CONTACT_TO.",
      },
      { status: 500 },
    );
  }

  if (!name || !email || !message) {
    return NextResponse.json(
      { message: "Nombre, correo y mensaje son obligatorios." },
      { status: 400 },
    );
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    tls: {
      minVersion: "TLSv1.2",
    },
    auth: {
      user,
      pass,
    },
  });

  const subject = normalizeHeader(`Contacto Vocalis AI${company ? ` - ${company}` : ""}`);
  const text = [
    `Empresa: ${company || "No indicada"}`,
    `Nombre: ${name}`,
    `Correo: ${email}`,
    `Sector: ${sector || "No indicado"}`,
    "",
    "Mensaje:",
    message,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
      <h2>Nuevo contacto Vocalis AI</h2>
      <p><strong>Empresa:</strong> ${escapeHtml(company || "No indicada")}</p>
      <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
      <p><strong>Correo:</strong> ${escapeHtml(email)}</p>
      <p><strong>Sector:</strong> ${escapeHtml(sector || "No indicado")}</p>
      <p><strong>Mensaje:</strong></p>
      <pre style="white-space: pre-wrap; font-family: inherit;">${escapeHtml(message)}</pre>
    </div>
  `;

  try {
    await transporter.sendMail({
      from,
      to,
      replyTo: email,
      subject,
      text,
      html,
    });

    return NextResponse.json({
      message: "Mensaje enviado al buzón del equipo.",
    });
  } catch {
    return NextResponse.json(
      { message: "No se pudo enviar el mensaje. Revisa SMTP y credenciales." },
      { status: 500 },
    );
  }
}
