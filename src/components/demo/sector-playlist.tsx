import { copy } from "@/content/copy";
import { AudioDemoCard } from "./audio-demo-card";
import type { DemoItem, SectorOption } from "@/types/demo";

type PlaylistSectorId = Exclude<SectorOption["id"], "all">;

type SectorPlaylistProps = {
  sector: SectorOption & { id: PlaylistSectorId };
  demos: readonly DemoItem[];
  index: number;
};

export function SectorPlaylist({ sector, demos, index }: SectorPlaylistProps) {
  return (
    <section className="playlistCard" aria-labelledby={`playlist-${sector.id}`}>
      <div className="playlistCard__header">
        <div className="playlistCard__titleBlock">
          <p className="eyebrow">Playlist {String(index + 1).padStart(2, "0")}</p>
          <h3 id={`playlist-${sector.id}`}>{copy.playlists.titles[sector.id]}</h3>
          <p className="playlistCard__intro">{copy.playlists[sector.id]}</p>
        </div>
        <div className="playlistCard__meta">
          <span>{demos.length} audios</span>
        </div>
      </div>

      <div className="playlistCard__tracks">
        {demos.map((demo, trackIndex) => (
          <AudioDemoCard
            key={demo.id}
            demo={demo}
            trackNumber={String(trackIndex + 1).padStart(2, "0")}
            compact
          />
        ))}
      </div>
    </section>
  );
}
