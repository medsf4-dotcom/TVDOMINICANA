import React, { useState, useEffect, useCallback, useRef } from "react";
import Hls from "hls.js";
import {
  Tv,
  Radio,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Maximize2,
  Calendar,
  Heart,
  Check,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Power,
  RotateCcw,
  Sparkles,
  Layers,
  Clock,
  Flame,
  Usb,
} from "lucide-react";
import { TVChannel } from "../types";

interface SmartTVViewProps {
  channels: TVChannel[];
  favorites: string[];
  onToggleFavorite: (channelId: string) => void;
  onExitTVMode: () => void;
  onOpenInstall?: () => void;
}

export const SmartTVView: React.FC<SmartTVViewProps> = ({
  channels,
  favorites,
  onToggleFavorite,
  onExitTVMode,
  onOpenInstall,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [showRemote, setShowRemote] = useState(false);
  const [showOSD, setShowOSD] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [numericBuffer, setNumericBuffer] = useState("");
  const [osdTimeoutId, setOsdTimeoutId] = useState<number | null>(null);
  const [activeSourceIndex, setActiveSourceIndex] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const numericTimerRef = useRef<number | null>(null);

  const currentChannel = channels[selectedIndex] || channels[0];
  const isFav = favorites.includes(currentChannel.id);

  // Compute available sources for the current channel
  const sources = React.useMemo(() => {
    if (!currentChannel) return [];
    const list: { id: string; label: string; url: string; type: "hls" | "embed" }[] = [];
    if (currentChannel.hlsUrl) {
      list.push({ id: "hls-primary", label: "Señal 1 (HD)", url: currentChannel.hlsUrl, type: "hls" });
    }
    if (currentChannel.backupHlsUrl) {
      list.push({ id: "hls-backup", label: "Señal 2 (Respaldo)", url: currentChannel.backupHlsUrl, type: "hls" });
    }
    if (currentChannel.embedUrl) {
      list.push({ id: "embed-web", label: "Señal Web Oficial", url: currentChannel.embedUrl, type: "embed" });
    }
    return list;
  }, [currentChannel]);

  // Reset active source when channel changes
  useEffect(() => {
    setActiveSourceIndex(0);
  }, [currentChannel.id]);

  const currentSource = sources[activeSourceIndex] || sources[0];

  // Dominican Clock (AST / UTC-4)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("es-DO", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Show OSD banner with auto-hide after 4.5s
  const triggerOSD = useCallback(() => {
    setShowOSD(true);
    if (osdTimeoutId) clearTimeout(osdTimeoutId);
    const id = window.setTimeout(() => {
      setShowOSD(false);
    }, 4500);
    setOsdTimeoutId(id);
  }, [osdTimeoutId]);

  // Setup playback for selected channel & active source
  useEffect(() => {
    if (!currentChannel || !currentSource) return;

    triggerOSD();

    if (currentSource.type === "embed") {
      // Embed iframe handles its own playback
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const streamUrl = currentSource.url;
    if (!streamUrl) return;

    video.volume = volume;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 45,
        manifestLoadingTimeOut: 10000,
        levelLoadingTimeOut: 10000,
      });
      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.volume = volume;
        video.play().catch(() => {
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {});
        });
      });

      hls.on(Hls.Events.ERROR, (_evt, data) => {
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      video.volume = volume;
      video.play().catch(() => {
        video.muted = true;
        setIsMuted(true);
        video.play().catch(() => {});
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentChannel?.id, currentSource?.url, activeSourceIndex, sources.length, triggerOSD]);

  // Handle Channel Jump from Numeric input
  const handleNumericInput = useCallback(
    (digit: string) => {
      const newBuffer = numericBuffer + digit;
      setNumericBuffer(newBuffer);
      triggerOSD();

      if (numericTimerRef.current) clearTimeout(numericTimerRef.current);
      numericTimerRef.current = window.setTimeout(() => {
        const num = parseInt(newBuffer, 10);
        const matchIndex = channels.findIndex((c) => c.channelNumber === num);
        if (matchIndex !== -1) {
          setSelectedIndex(matchIndex);
        }
        setNumericBuffer("");
      }, 1200);
    },
    [numericBuffer, channels, triggerOSD]
  );

  // TV Remote / Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Numbers 0-9
      if (/^[0-9]$/.test(e.key)) {
        handleNumericInput(e.key);
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case "ChannelUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % channels.length);
          break;
        case "ArrowLeft":
        case "ChannelDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + channels.length) % channels.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          if (videoRef.current) {
            const newVol = Math.min(1, Math.round((volume + 0.1) * 10) / 10);
            setVolume(newVol);
            videoRef.current.volume = newVol;
            videoRef.current.muted = false;
            setIsMuted(false);
            triggerOSD();
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (videoRef.current) {
            const newVol = Math.max(0, Math.round((volume - 0.1) * 10) / 10);
            setVolume(newVol);
            videoRef.current.volume = newVol;
            if (newVol === 0) {
              videoRef.current.muted = true;
              setIsMuted(true);
            }
            triggerOSD();
          }
          break;
        case "m":
        case "M":
          if (videoRef.current) {
            const newMuted = !videoRef.current.muted;
            videoRef.current.muted = newMuted;
            setIsMuted(newMuted);
            if (!newMuted) {
              const targetVol = volume > 0 ? volume : 0.5;
              videoRef.current.volume = targetVol;
              setVolume(targetVol);
            }
            triggerOSD();
          }
          break;
        case " ":
        case "Enter":
          if (videoRef.current) {
            if (videoRef.current.paused) {
              videoRef.current.play();
              setIsPlaying(true);
            } else {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
          break;
        case "i":
        case "I":
          triggerOSD();
          break;
        case "r":
        case "R":
          setShowRemote((prev) => !prev);
          break;
        case "s":
        case "S":
          if (sources.length > 1) {
            setActiveSourceIndex((prev) => (prev + 1) % sources.length);
            triggerOSD();
          }
          break;
        case "f":
        case "F":
          onToggleFavorite(currentChannel.id);
          triggerOSD();
          break;
        case "Escape":
          onExitTVMode();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [channels.length, handleNumericInput, volume, triggerOSD, currentChannel.id, onToggleFavorite, onExitTVMode]);

  const channelUp = () => {
    setSelectedIndex((prev) => (prev + 1) % channels.length);
    triggerOSD();
  };
  const channelDown = () => {
    setSelectedIndex((prev) => (prev - 1 + channels.length) % channels.length);
    triggerOSD();
  };

  // Touch Swipe Gesture for Smart TV / Mobile touch screens
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
    if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        channelUp();
      } else {
        channelDown();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !videoRef.current.muted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      if (!newMuted) {
        const targetVol = volume > 0 ? volume : 0.5;
        videoRef.current.volume = targetVol;
        setVolume(targetVol);
      }
      triggerOSD();
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black text-white flex flex-col overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Smart TV Fullscreen Video Stage */}
      <div className="relative flex-1 w-full h-full bg-black flex items-center justify-center overflow-hidden group">
        {/* Left Side Channel Switch Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            channelDown();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-black/60 hover:bg-red-600 text-white/70 hover:text-white border border-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-2xl hover:scale-110"
          title="Canal Anterior (Flecha Izquierda)"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        {/* Right Side Channel Switch Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            channelUp();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full bg-black/60 hover:bg-red-600 text-white/70 hover:text-white border border-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-2xl hover:scale-110"
          title="Siguiente Canal (Flecha Derecha)"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        {currentSource?.type === "embed" ? (
          <iframe
            src={currentSource.url}
            title={currentChannel.name}
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            className="w-full h-full border-0"
          />
        ) : (
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted={isMuted}
            className="w-full h-full object-contain"
            onClick={triggerOSD}
          />
        )}

        {/* TV Top Status Bar */}
        <div className="absolute top-0 inset-x-0 p-6 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent z-20 pointer-events-none">
          <div className="flex items-center gap-3">
            <span className="font-['Bebas_Neue',sans-serif] text-3xl sm:text-4xl text-red-600 tracking-wider font-black drop-shadow-md">
              ELITVRD <span className="text-white text-xl sm:text-2xl font-bold ml-1">SMART TV</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-widest animate-pulse">
              EN VIVO
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm font-bold text-zinc-300 pointer-events-auto">
            {/* Clock */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-zinc-900/80 border border-zinc-700/80 backdrop-blur-md">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{currentTime || "ELITVRD"}</span>
            </div>

            {/* Virtual Remote Button */}
            <button
              type="button"
              onClick={() => setShowRemote((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-lg ${
                showRemote
                  ? "bg-red-600 border-red-500 text-white"
                  : "bg-zinc-900/90 border-zinc-700 hover:bg-zinc-800 text-zinc-200"
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>Control Remoto</span>
            </button>

            {/* Install / USB Button */}
            {onOpenInstall && (
              <button
                type="button"
                onClick={onOpenInstall}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-bold transition-all cursor-pointer shadow-lg"
              >
                <Usb className="w-4 h-4 text-red-400" />
                <span>Instalar / USB</span>
              </button>
            )}

            {/* Exit TV Mode Button */}
            <button
              type="button"
              onClick={onExitTVMode}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold transition-all cursor-pointer"
            >
              Salir de Modo TV (Esc)
            </button>
          </div>
        </div>

        {/* Unmute prompt if video starts muted */}
        {isMuted && (
          <button
            type="button"
            onClick={toggleMute}
            className="absolute top-20 left-6 z-30 flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/80 hover:bg-red-600 text-white text-sm font-bold backdrop-blur-md border border-white/20 shadow-2xl transition-all cursor-pointer"
          >
            <VolumeX className="w-5 h-5 text-red-400" />
            <span>Audio en Silencio &bull; Presiona [M] o Haz Clic para Activar</span>
          </button>
        )}

        {/* Numeric Channel Buffer Overlay (When user presses numbers) */}
        {numericBuffer && (
          <div className="absolute top-24 right-8 z-30 px-6 py-3 rounded-2xl bg-black/90 border-2 border-amber-500 text-amber-400 font-['Bebas_Neue',sans-serif] text-5xl tracking-widest shadow-2xl animate-pulse">
            CANAL {numericBuffer}
          </div>
        )}

        {/* TV On Screen Display (OSD) Banner at Bottom */}
        <div
          className={`absolute bottom-0 inset-x-0 p-6 sm:p-8 bg-gradient-to-t from-black via-black/85 to-transparent z-20 transition-all duration-300 ${
            showOSD ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
          }`}
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            {/* Channel Info */}
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 rounded-2xl bg-red-600 text-white font-['Bebas_Neue',sans-serif] text-3xl sm:text-4xl font-black shadow-xl shrink-0">
                CH {currentChannel.channelNumber}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {currentChannel.name}
                  </h2>
                  <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-amber-400 text-xs font-bold border border-zinc-700">
                    {currentChannel.city}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 text-xs font-bold border border-zinc-700">
                    {currentChannel.resolution}
                  </span>
                  {isFav && (
                    <span className="px-2 py-0.5 rounded-md bg-red-950 text-red-400 text-xs font-bold border border-red-800">
                      ★ Favorito
                    </span>
                  )}
                </div>

                <p className="text-base sm:text-lg text-red-400 font-bold">
                  {currentChannel.currentProgram}
                </p>
                <p className="text-xs sm:text-sm text-zinc-300 line-clamp-1 max-w-2xl">
                  {currentChannel.currentProgramDesc}
                </p>
                {currentChannel.currentProgramHost && (
                  <p className="text-xs text-amber-400 mt-0.5">
                    Conducción: {currentChannel.currentProgramHost}
                  </p>
                )}

                {/* Source / Signal Selector Pills */}
                {sources.length > 1 && (
                  <div className="flex items-center gap-2 mt-2 pointer-events-auto">
                    <span className="text-xs text-zinc-400 font-semibold">Señal:</span>
                    {sources.map((src, sIdx) => (
                      <button
                        key={src.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSourceIndex(sIdx);
                          triggerOSD();
                        }}
                        className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          activeSourceIndex === sIdx
                            ? "bg-red-600 text-white shadow-md"
                            : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
                        }`}
                      >
                        {src.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Navigation Help Bar */}
            <div className="hidden lg:flex flex-col items-end text-xs text-zinc-400 space-y-1 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 backdrop-blur-xs">
              <div className="flex items-center gap-3">
                <span>[◄ / ►] Cambiar Canal</span>
                <span>[▲ / ▼] Volumen</span>
                <span>[Espacio] Play/Pausa</span>
              </div>
              <div className="flex items-center gap-3">
                <span>[0-9] Marcar Canal</span>
                <span>[S] Cambiar Señal</span>
                <span>[F] Favorito</span>
                <span>[R] Control Remoto</span>
              </div>
            </div>
          </div>

          {/* Quick TV Channel Carousel Strip */}
          <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center gap-3 overflow-x-auto scrollbar-none py-1">
            {channels.map((c, idx) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  idx === selectedIndex
                    ? "bg-red-600 text-white ring-2 ring-white shadow-xl scale-105"
                    : "bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border border-zinc-800"
                }`}
              >
                <span className="text-amber-400 font-black">#{c.channelNumber}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Virtual Dominican Remote Control (Control Remoto Dominicano) */}
      {showRemote && (
        <div className="fixed top-20 right-6 z-50 w-72 bg-[#16161d] rounded-3xl border-2 border-zinc-700 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] p-5 flex flex-col items-center select-none animate-in slide-in-from-right duration-200">
          {/* Remote Brand */}
          <div className="w-full flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
            <span className="font-['Bebas_Neue',sans-serif] text-xl text-red-500 font-bold">
              CONTROL ELITVRD
            </span>
            <button
              type="button"
              onClick={() => setShowRemote(false)}
              className="text-zinc-400 hover:text-white p-1"
            >
              &times;
            </button>
          </div>

          {/* Power & Mute */}
          <div className="w-full flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={onExitTVMode}
              className="p-3 rounded-full bg-red-700 hover:bg-red-600 text-white shadow-lg cursor-pointer"
              title="Salir"
            >
              <Power className="w-4 h-4" />
            </button>
            <div className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
              {currentChannel.name} ({currentChannel.channelNumber})
            </div>
            <button
              type="button"
              onClick={toggleMute}
              className={`p-3 rounded-full border cursor-pointer ${
                isMuted ? "bg-red-600 border-red-500 text-white" : "bg-zinc-800 border-zinc-700 text-zinc-300"
              }`}
              title="Silencio"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Directional Pad / D-Pad */}
          <div className="relative w-44 h-44 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-5 shadow-inner">
            {/* UP (Vol +) */}
            <button
              type="button"
              onClick={() => {
                if (videoRef.current) {
                  const newVol = Math.min(1, volume + 0.1);
                  setVolume(newVol);
                  videoRef.current.volume = newVol;
                  videoRef.current.muted = false;
                  setIsMuted(false);
                }
              }}
              className="absolute top-2 inset-x-0 mx-auto w-10 h-8 flex flex-col items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
              title="Volumen +"
            >
              <ChevronUp className="w-5 h-5" />
              <span className="text-[8px] font-bold">VOL+</span>
            </button>

            {/* DOWN (Vol -) */}
            <button
              type="button"
              onClick={() => {
                if (videoRef.current) {
                  const newVol = Math.max(0, volume - 0.1);
                  setVolume(newVol);
                  videoRef.current.volume = newVol;
                }
              }}
              className="absolute bottom-2 inset-x-0 mx-auto w-10 h-8 flex flex-col items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
              title="Volumen -"
            >
              <span className="text-[8px] font-bold">VOL-</span>
              <ChevronDown className="w-5 h-5" />
            </button>

            {/* LEFT (CH -) */}
            <button
              type="button"
              onClick={channelDown}
              className="absolute left-2 inset-y-0 my-auto w-8 h-10 flex flex-row items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
              title="Canal Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* RIGHT (CH +) */}
            <button
              type="button"
              onClick={channelUp}
              className="absolute right-2 inset-y-0 my-auto w-8 h-10 flex flex-row items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
              title="Canal Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* CENTER OK / PLAY PAUSE */}
            <button
              type="button"
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg font-bold text-xs cursor-pointer active:scale-95 transition-transform"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
            </button>
          </div>

          {/* Numeric Numpad for direct tuning */}
          <div className="grid grid-cols-3 gap-2 w-full mb-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "Fav", 0, "Info"].map((btn) => (
              <button
                key={String(btn)}
                type="button"
                onClick={() => {
                  if (typeof btn === "number") {
                    handleNumericInput(String(btn));
                  } else if (btn === "Fav") {
                    onToggleFavorite(currentChannel.id);
                  } else if (btn === "Info") {
                    triggerOSD();
                  }
                }}
                className="py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 active:bg-red-600 text-zinc-200 font-bold text-sm transition-colors cursor-pointer text-center"
              >
                {btn}
              </button>
            ))}
          </div>

          <div className="w-full text-center text-[10px] text-zinc-500 pt-2 border-t border-zinc-800">
            Presiona números o flechas en tu teclado
          </div>
        </div>
      )}
    </div>
  );
};
