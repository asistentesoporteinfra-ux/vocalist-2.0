import { copy } from "@/content/copy";
import { DemoGallery } from "@/components/demo/demo-gallery";
import { HeroSection } from "@/components/sections/hero-section";
import { ContactSection } from "@/components/sections/contact-section";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="pageShell">
        <HeroSection />

        <section className="section section--stats" aria-label="Resumen del sitio">
          <div className="statCard">
            <p className="eyebrow">{copy.stats.catalog.eyebrow}</p>
            <h2>{copy.stats.catalog.title}</h2>
            <p>{copy.stats.catalog.body}</p>
          </div>
          <div className="statCard">
            <p className="eyebrow">{copy.stats.ux.eyebrow}</p>
            <h2>{copy.stats.ux.title}</h2>
            <p>{copy.stats.ux.body}</p>
          </div>
        </section>

        <DemoGallery />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}
