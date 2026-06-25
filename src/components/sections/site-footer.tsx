import Image from "next/image";
import { copy } from "@/content/copy";

const contactEmail = "b.morgado@calldomdelcaribe.com";

export function SiteFooter() {
  return (
    <footer className="siteFooter">
      <div className="siteFooter__brand">
        <div className="brandLogoSlot brandLogoSlot--footer" aria-hidden="true">
          <Image
            src="/brand/footer-logo/Blanco.png"
            alt=""
            fill
            sizes="92px"
            className="brandLogoSlot__image"
          />
        </div>
        <div className="siteFooter__copy">
          <p className="eyebrow">{copy.footer.eyebrow}</p>
          <h2>{copy.footer.title}</h2>
          <p>{copy.footer.body}</p>
        </div>
      </div>

      <div className="siteFooter__actions">
        <a
          className="button button--ghost"
          href={`mailto:${contactEmail}?subject=${encodeURIComponent("Contacto Vocalis AI")}`}
        >
          {copy.footer.contact}
        </a>
        <a className="button button--primary" href="#contacto">
          {copy.header.contact}
        </a>
      </div>
    </footer>
  );
}
