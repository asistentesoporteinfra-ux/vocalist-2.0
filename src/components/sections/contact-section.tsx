"use client";

import { useState, type FormEvent } from "react";
import { copy } from "@/content/copy";

const contactEmail = "b.morgado@calldomdelcaribe.com";

type FormState = "idle" | "sending" | "success" | "error";

export function ContactSection() {
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setState("sending");
    setMessage("");

    const payload = {
      company: String(formData.get("company") ?? "").trim(),
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      sector: String(formData.get("sector") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        throw new Error(data?.message || "No se pudo enviar el mensaje.");
      }

      form.reset();
      setState("success");
      setMessage(data?.message || "Mensaje enviado. Te contactaremos pronto.");
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error ? error.message : "No se pudo enviar el mensaje.",
      );
    }
  };

  return (
    <section className="section contactSection" id="contacto">
      <div className="section__heading contactSection__heading">
        <div className="section__kicker">
          <span className="section__rule" />
          <p className="eyebrow">{copy.contact.eyebrow}</p>
        </div>
        <h2>{copy.contact.title}</h2>
        <p>{copy.contact.body}</p>
      </div>

      <div className="contactSection__grid">
        <aside className="contactInfoCard">
          <p className="contactInfoCard__label">{copy.contact.directLabel}</p>
          <a className="contactInfoCard__email" href={`mailto:${contactEmail}`}>
            {contactEmail}
          </a>
          <p className="contactInfoCard__note">{copy.contact.note}</p>
          <div className="contactInfoCard__steps">
            <span>1. Cuéntanos proceso</span>
            <span>2. Elige sector</span>
            <span>3. Recibes respuesta</span>
          </div>
        </aside>

        <form className="contactForm" onSubmit={handleSubmit}>
          <div className="contactForm__grid">
            <label>
              Empresa
              <input type="text" name="company" placeholder="Nombre de la empresa" />
            </label>
            <label>
              Nombre
              <input type="text" name="name" placeholder="Tu nombre" required />
            </label>
            <label>
              Correo
              <input type="email" name="email" placeholder="correo@empresa.com" required />
            </label>
            <label>
              Sector
              <input type="text" name="sector" placeholder="Salud, retail, finanzas..." />
            </label>
          </div>

          <label className="contactForm__message">
            Mensaje
            <textarea
              name="message"
              rows={6}
              placeholder="Cuéntanos qué proceso quieres automatizar"
              required
            />
          </label>

          <div className="contactForm__footer">
            <p>
              {state === "success" || state === "error" ? message : copy.contact.note}
            </p>
            <button type="submit" className="button button--primary" disabled={state === "sending"}>
              {state === "sending" ? "Enviando..." : copy.contact.button}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
