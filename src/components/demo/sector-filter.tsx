"use client";

import type { SectorOption } from "@/types/demo";

type SectorFilterProps = {
  sectors: readonly SectorOption[];
  activeSector: SectorOption["id"];
  onChange: (sectorId: SectorOption["id"]) => void;
};

export function SectorFilter({
  sectors,
  activeSector,
  onChange,
}: SectorFilterProps) {
  return (
    <div className="sectorFilter" role="tablist" aria-label="Filtrar demos por sector">
      {sectors.map((sector) => {
        const isActive = sector.id === activeSector;

        return (
          <button
            key={sector.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`sectorFilter__chip ${isActive ? "is-active" : ""}`}
            onClick={() => onChange(sector.id)}
          >
            {sector.label}
          </button>
        );
      })}
    </div>
  );
}
