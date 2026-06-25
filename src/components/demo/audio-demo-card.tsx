"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from "react";
import type { DemoItem } from "@/types/demo";

let activeAudio: HTMLAudioElement | null = null;

type AudioDemoCardProps = {
  demo: DemoItem;
  trackNumber?: string;
  compact?: boolean;
};

type AudioGraph = {
  context: AudioContext;
  source: MediaElementAudioSourceNode;
  highPass: BiquadFilterNode;
  presence: BiquadFilterNode;
  compressor: DynamicsCompressorNode;
  output: GainNode;
};

const playbackRates = [0.9, 1, 1.1, 1.25, 1.3] as const;

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function formatRate(rate: number): string {
  return `${rate.toFixed(rate % 1 === 0 ? 0 : 1)}x`;
}

function applyAudioSettings(
  audio: HTMLAudioElement,
  graph: AudioGraph | null,
  enabled: boolean,
  volume: number,
  playbackRate: number,
) {
  if (graph) {
    graph.highPass.frequency.value = enabled ? 82 : 24;
    graph.highPass.Q.value = 0.68;
    graph.presence.frequency.value = 3300;
    graph.presence.Q.value = 0.9;
    graph.presence.gain.value = enabled ? 3.4 : 0;
    graph.compressor.threshold.value = enabled ? -16 : -30;
    graph.compressor.knee.value = enabled ? 12 : 0;
    graph.compressor.ratio.value = enabled ? 2.8 : 1;
    graph.compressor.attack.value = enabled ? 0.002 : 0.003;
    graph.compressor.release.value = enabled ? 0.12 : 0.1;
    graph.output.gain.value = Math.min(volume * (enabled ? 1.55 : 1), 2.5);
    audio.volume = 1;
    audio.playbackRate = playbackRate;
    audio.preservesPitch = true;
    return;
  }

  audio.volume = Math.min(volume, 1);
  audio.playbackRate = playbackRate;
  audio.preservesPitch = true;
}

export function AudioDemoCard({
  demo,
  trackNumber,
  compact = false,
}: AudioDemoCardProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const graphRef = useRef<AudioGraph | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => {
    if (typeof window === "undefined") return 1;
    const saved = localStorage.getItem("vocalis_volume");
    return saved !== null ? parseFloat(saved) : 1;
  });
  const [playbackRate, setPlaybackRate] = useState(() => {
    if (typeof window === "undefined") return 1;
    const saved = localStorage.getItem("vocalis_speed");
    return saved !== null ? parseFloat(saved) : 1;
  });
  const [isEnhanced, setIsEnhanced] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const accentStyle = { "--demo-gradient": demo.accent } as CSSProperties;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const ensureGraph = async () => {
    const audio = audioRef.current;
    if (!audio || graphRef.current || typeof window.AudioContext === "undefined") {
      return null;
    }

    const context = new window.AudioContext();
    const source = context.createMediaElementSource(audio);
    const highPass = context.createBiquadFilter();
    const presence = context.createBiquadFilter();
    const compressor = context.createDynamicsCompressor();
    const output = context.createGain();

    source.connect(highPass);
    highPass.connect(presence);
    presence.connect(compressor);
    compressor.connect(output);
    output.connect(context.destination);

    graphRef.current = { context, source, highPass, presence, compressor, output };
    applyAudioSettings(audio, graphRef.current, isEnhanced, volume, playbackRate);
    return graphRef.current;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    applyAudioSettings(audio, graphRef.current, isEnhanced, volume, playbackRate);
  }, [isEnhanced, playbackRate, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onMeta = () => setDuration(audio.duration || 0);
    const onTime = () => setCurrentTime(audio.currentTime || 0);
    const onPlay = () => {
      setIsPlaying(true);
      setError(null);
      if (activeAudio && activeAudio !== audio) {
        activeAudio.pause();
      }
      activeAudio = audio;
    };
    const onPause = () => {
      setIsPlaying(false);
      if (activeAudio === audio) {
        activeAudio = null;
      }
    };
    const onEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (activeAudio === audio) {
        activeAudio = null;
      }
    };
    const onError = () => {
      setError("No se pudo cargar esta demo.");
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("error", onError);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
      if (activeAudio === audio) {
        activeAudio = null;
      }
      graphRef.current?.context.close().catch(() => undefined);
      graphRef.current = null;
    };
  }, []);

  useEffect(() => {
    const handler = () => {
      const g = graphRef.current;
      if (g?.context.state === "suspended") {
        g.context.resume().catch(() => undefined);
      }
    };
    document.addEventListener("click", handler, { once: true });
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleToggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      if (isEnhanced || graphRef.current) {
        const graph = await ensureGraph();
        if (graph?.context.state === "suspended") {
          await graph.context.resume();
        }
      }

      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
  };

  const handleToggleEnhanced = async () => {
    const next = !isEnhanced;
    setIsEnhanced(next);
    if (next) {
      const graph = await ensureGraph();
      if (graph?.context.state === "suspended") {
        await graph.context.resume();
      }
    }
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const nextTime = Number(e.target.value);
    if (audio) audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleVolume = (e: ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    localStorage.setItem("vocalis_volume", v.toString());
  };

  const handleRate = (e: ChangeEvent<HTMLSelectElement>) => {
    const r = Number(e.target.value);
    setPlaybackRate(r);
    localStorage.setItem("vocalis_speed", r.toString());
  };

  return (
    <article className={`trackRow${compact ? " trackRow--compact" : ""}`} style={accentStyle}>
      <button
        type="button"
        className={`trackRow__play${isPlaying ? " is-playing" : ""}`}
        onClick={handleToggle}
        aria-label={isPlaying ? "Pausar" : "Reproducir"}
      >
        {isPlaying ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <rect x="3" y="2" width="4" height="12" rx="1" />
            <rect x="9" y="2" width="4" height="12" rx="1" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 2.5l10 5.5-10 5.5V2.5z" />
          </svg>
        )}
      </button>

      {trackNumber && <span className="trackRow__num">{trackNumber}</span>}

      <div className="trackRow__info">
        <div className="trackRow__headline">
          <span className="trackRow__title">{demo.title}</span>
          <span className={`trackRow__status${isEnhanced ? " is-active" : ""}`}>
            {isEnhanced ? "Voz optimizada" : "Audio original"}
          </span>
        </div>
        <span className="trackRow__desc">{demo.description}</span>
        <div className="trackRow__progress" aria-hidden="true">
          <div className="trackRow__bar">
            <div className="trackRow__fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="trackRow__time">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        <input
          aria-label="Progreso"
          className="trackRow__seek"
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
        />
        <div className="trackRow__tools">
          <label className="trackRow__control">
            <span>Volumen</span>
            <input
              aria-label="Volumen"
              type="range"
              min={0}
              max={2}
              step={0.01}
              value={volume}
              onChange={handleVolume}
            />
          </label>
          <label className="trackRow__control trackRow__control--rate">
            <span>Velocidad</span>
            <select
              aria-label="Velocidad de reproduccion"
              value={playbackRate}
              onChange={handleRate}
            >
              {playbackRates.map((rate) => (
                <option key={rate} value={rate}>
                  {formatRate(rate)}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className={`trackRow__chip${isEnhanced ? " is-active" : ""}`}
            onClick={() => void handleToggleEnhanced()}
            aria-pressed={isEnhanced}
          >
            {isEnhanced ? "Mejora activa" : "Activar mejora"}
          </button>
        </div>
        {error && <p className="trackRow__error">{error}</p>}
      </div>

      <span className="trackRow__duration">{demo.durationLabel}</span>

      <audio ref={audioRef} preload="metadata" playsInline src={demo.audioUrl} />
    </article>
  );
}
