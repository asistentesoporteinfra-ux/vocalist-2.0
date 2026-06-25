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

const playbackRates = [0.9, 1, 1.1, 1.25] as const;

// Volumen inicial alto — los archivos de voz IA salen normalizados a -14 LUFS,
// necesitan boost agresivo para sonar a nivel de conversación normal.
const INITIAL_VOLUME = 1.0;

// Makeup gain para compensar la reducción del compresor y el ReplayGain
// embebido en los MP3 generados por herramientas TTS (ElevenLabs, etc.).
// Con ratio 2.0 y threshold -10dB la reducción máxima es ~6dB → necesitamos
// al menos 2.0x de makeup gain para estar por encima del nivel original.
const MAKEUP_GAIN_ENHANCED = 3.2;
const MAKEUP_GAIN_NORMAL   = 2.5;

// El slider de volumen va de 0 a 1 en la UI pero internamente se mapea
// a 0..MAX_GAIN para que "al máximo" realmente suene máximo.
const MAX_GAIN = 3.5;

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function formatRate(rate: number): string {
  return `${rate.toFixed(rate % 1 === 0 ? 0 : 1)}x`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function applyAudioSettings(
  audio: HTMLAudioElement,
  graph: AudioGraph | null,
  enabled: boolean,
  volume: number,
  playbackRate: number,
) {
  if (graph) {
    // ── High-pass: elimina rumble de fondo en voz IA ──────────────────────
    graph.highPass.type = "highpass";
    graph.highPass.frequency.value = enabled ? 80 : 20;
    graph.highPass.Q.value = 0.7;

    // ── Presence boost: claridad en frecuencias de voz (2-4 kHz) ─────────
    graph.presence.type = "peaking";
    graph.presence.frequency.value = 3000;
    graph.presence.Q.value = 0.85;
    graph.presence.gain.value = enabled ? 4.5 : 0;

    // ── Compresor: suaviza picos pero con threshold alto para no aplastar ─
    // ANTES era threshold -20dB ratio 3.2 → aplastaba todo el cuerpo de voz
    // AHORA threshold -10dB ratio 2.0 → solo recorta picos reales
    graph.compressor.threshold.value = enabled ? -10 : -6;
    graph.compressor.knee.value      = enabled ? 18  : 6;
    graph.compressor.ratio.value     = enabled ? 2.0 : 1.1;
    graph.compressor.attack.value    = enabled ? 0.004 : 0.01;
    graph.compressor.release.value   = enabled ? 0.15  : 0.25;

    // ── Output gain: makeup gain agresivo + volumen del usuario ───────────
    // volume (0-1 de la UI) × MAKEUP_GAIN × MAX_GAIN
    // Ejemplo al 100% con mejora: 1.0 × 3.2 × 3.5 = 11.2 → clamp a 4.0
    // Ejemplo al 50%: 0.5 × 3.2 × 3.5 = 5.6 → clamp a 4.0
    // clamp a 4.0 para evitar distorsión digital en parlantes normales
    const makeup = enabled ? MAKEUP_GAIN_ENHANCED : MAKEUP_GAIN_NORMAL;
    graph.output.gain.value = clamp(volume * makeup * MAX_GAIN, 0, 4.0);

    // El elemento <audio> siempre a 1 — todo el control va por el GainNode
    audio.volume = 1;
    audio.playbackRate = playbackRate;
    // Preservar pitch al cambiar velocidad (evita efecto chipmunk)
    (audio as HTMLAudioElement & { preservesPitch?: boolean; webkitPreservePitch?: boolean }).preservesPitch = true;
    (audio as HTMLAudioElement & { preservesPitch?: boolean; webkitPreservePitch?: boolean }).webkitPreservePitch = true;
    return;
  }

  // Fallback sin Web Audio API: subir volume del elemento directamente al máximo
  audio.volume = clamp(volume * 1.0, 0, 1); // sin grafo, el máximo es 1
  audio.playbackRate = playbackRate;
}

export function AudioDemoCard({
  demo,
  trackNumber,
  compact = false,
}: AudioDemoCardProps) {
  const audioRef   = useRef<HTMLAudioElement>(null);
  const graphRef   = useRef<AudioGraph | null>(null);
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [currentTime,  setCurrentTime]  = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [volume,       setVolume]       = useState(INITIAL_VOLUME);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isEnhanced,   setIsEnhanced]   = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const accentStyle = { "--demo-gradient": demo.accent } as CSSProperties;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const ensureGraph = async () => {
    const audio = audioRef.current;
    if (!audio || graphRef.current || typeof window.AudioContext === "undefined") {
      return null;
    }

    const context    = new window.AudioContext();
    const source     = context.createMediaElementSource(audio);
    const highPass   = context.createBiquadFilter();
    const presence   = context.createBiquadFilter();
    const compressor = context.createDynamicsCompressor();
    const output     = context.createGain();

    source.connect(highPass);
    highPass.connect(presence);
    presence.connect(compressor);
    compressor.connect(output);
    output.connect(context.destination);

    graphRef.current = { context, source, highPass, presence, compressor, output };
    applyAudioSettings(audio, graphRef.current, isEnhanced, volume, playbackRate);
    return graphRef.current;
  };

  // Re-aplicar settings cada vez que cambia volumen, velocidad o modo
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    applyAudioSettings(audio, graphRef.current, isEnhanced, volume, playbackRate);
  }, [isEnhanced, playbackRate, volume]);

  // Eventos del elemento <audio>
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onMeta  = () => setDuration(audio.duration || 0);
    const onTime  = () => setCurrentTime(audio.currentTime || 0);
    const onPlay  = () => {
      setIsPlaying(true);
      setError(null);
      if (activeAudio && activeAudio !== audio) {
        activeAudio.pause();
      }
      activeAudio = audio;
    };
    const onPause = () => {
      setIsPlaying(false);
      if (activeAudio === audio) activeAudio = null;
    };
    const onEnd   = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (activeAudio === audio) activeAudio = null;
    };
    const onError = () => {
      setError("No se pudo cargar esta demo.");
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("timeupdate",     onTime);
    audio.addEventListener("play",           onPlay);
    audio.addEventListener("pause",          onPause);
    audio.addEventListener("ended",          onEnd);
    audio.addEventListener("error",          onError);
    return () => {
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("timeupdate",     onTime);
      audio.removeEventListener("play",           onPlay);
      audio.removeEventListener("pause",          onPause);
      audio.removeEventListener("ended",          onEnd);
      audio.removeEventListener("error",          onError);
    };
  }, []);

  // Cleanup al desmontar
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
      if (activeAudio === audio) activeAudio = null;
      graphRef.current?.context.close().catch(() => undefined);
      graphRef.current = null;
    };
  }, []);

  const handleToggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      // Siempre crear el grafo al dar play — garantiza que el boost esté activo
      const graph = await ensureGraph();
      if (graph?.context.state === "suspended") {
        await graph.context.resume();
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
    const audio    = audioRef.current;
    const nextTime = Number(e.target.value);
    if (audio) audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleVolume = (e: ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  const handleRate = (e: ChangeEvent<HTMLSelectElement>) => {
    setPlaybackRate(Number(e.target.value));
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
              max={1}
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

      <audio
        ref={audioRef}
        preload="metadata"
        playsInline
        crossOrigin="anonymous"
        src={demo.audioUrl}
      />
    </article>
  );
}
