"use client";

import { useState } from "react";
import { copy } from "@/content/copy";
import { demos } from "@/data/demos";
import { sectors } from "@/data/sectors";
import { AudioDemoCard } from "./audio-demo-card";
import type { SectorOption } from "@/types/demo";

const sectorIcons: Record<string, string> = {
  health: "♥",
  "finance-insurance": "◈",
  "retail-ecommerce": "◉",
  "real-estate": "⬡",
  "public-service": "◎",
  fashion: "✦",
  travel: "◈",
  hotel: "⬟",
  restaurant: "◉",
  education: "◈",
};

export function DemoGallery() {
  const playlists = sectors
    .filter((s): s is SectorOption & { id: Exclude<SectorOption["id"], "all"> } => s.id !== "all")
    .map((sector) => ({
      sector,
      demos: demos.filter((d) => d.sectorId === sector.id),
    }))
    .filter((p) => p.demos.length > 0);

  const [activeId, setActiveId] = useState(playlists[0]?.sector.id ?? "health");

  const active = playlists.find((p) => p.sector.id === activeId) ?? playlists[0];
  const playlistTitles = copy.playlists.titles as unknown as Record<string, string>;
  const playlistBodies = copy.playlists as unknown as Record<string, string>;

  return (
    <section className="section gallerySection" id="demos">
      <div className="gallerySection__heading">
        <div className="section__kicker">
          <span className="section__rule" />
          <p className="eyebrow">{copy.gallery.eyebrow}</p>
        </div>
        <h2>{copy.gallery.title}</h2>
        <p className="gallerySection__lead">{copy.gallery.body}</p>
      </div>

      <div className="galleryShell">
        {/* Sidebar */}
        <nav className="gallerySidebar" aria-label="Sectores">
          <p className="gallerySidebar__label">Sectores</p>
          {playlists.map(({ sector, demos: d }) => (
            <button
              key={sector.id}
              type="button"
              className={`gallerySidebar__item${activeId === sector.id ? " is-active" : ""}`}
              onClick={() => setActiveId(sector.id)}
              aria-current={activeId === sector.id ? "true" : undefined}
            >
              <span className="gallerySidebar__icon">
                {sectorIcons[sector.id] ?? "◎"}
              </span>
              <span className="gallerySidebar__text">
                <span className="gallerySidebar__name">{sector.label}</span>
                <span className="gallerySidebar__count">{d.length} {d.length === 1 ? "demo" : "demos"}</span>
              </span>
            </button>
          ))}
        </nav>

        {/* Content panel */}
        <div className="galleryPanel" key={activeId}>
          <div className="galleryPanel__header">
            <div
              className="galleryPanel__accent"
              style={{ background: active.demos[0]?.accent ?? "linear-gradient(135deg,#43a5ff,#8b5cf6)" }}
            />
            <div className="galleryPanel__meta">
              <span className="eyebrow">{active.sector.label}</span>
              <h3 className="galleryPanel__title">
                {playlistTitles[activeId] ?? active.sector.label}
              </h3>
              <p className="galleryPanel__body">
                {playlistBodies[activeId] ?? ""}
              </p>
            </div>
          </div>

          <div className="galleryPanel__tracks">
            {active.demos.map((demo, i) => (
              <AudioDemoCard
                key={demo.id}
                demo={demo}
                trackNumber={String(i + 1).padStart(2, "0")}
                compact
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
