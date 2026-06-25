import Image from "next/image";
import { copy } from "@/content/copy";

const contactEmail = "b.morgado@calldomdelcaribe.com";

export function SiteHeader() {
  return (
    <header className="siteHeader">
      <div className="siteHeader__brand">
        <div className="brandLogoSlot brandLogoSlot--header" aria-hidden="true">
          <Image
            src="/brand/header-logo/logoheader.png"
            alt=""
            fill
            priority
            sizes="56px"
            className="brandLogoSlot__image"
          />
        </div>
        <div className="siteHeader__brandText">
          <p className="eyebrow">{copy.header.brand}</p>
          <strong>Voice demos B2B</strong>
        </div>
      </div>

      <nav className="siteHeader__actions" aria-label="Acciones principales">
        <a className="button button--ghost" href="#demos">
          {copy.header.demos}
        </a>
        <a
          className="button button--primary"
          href={`mailto:${contactEmail}?subject=${encodeURIComponent("Contacto Vocalis AI")}`}
        >
          {copy.header.contact}
        </a>
      </nav>
    </header>
  );
}
