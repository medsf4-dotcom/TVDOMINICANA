import React, { useState, useEffect, useRef, useCallback } from "react";
import Hls from "hls.js";
import {
  X,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Radio,
  Tv,
  Info,
  Calendar,
  Heart,
  Check,
  ChevronRight,
  ChevronLeft,
  Flame,
  MessageSquare,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Play,
  Pause,
  AlertCircle,
  Layers,
} from "lucide-react";
import { TVChannel } from "../types";

interface LivePlayerModalProps {
  channel: TVChannel | null;
  allChannels: TVChannel[];
  onClose: () => void;
  onSelectChannel: (channel: TVChannel) => void;
  isFavorite: boolean;
  onToggleFavorite: (channelId: string) => void;
}

interface LiveReaction {
  id: number;
  emoji: string;
  x: number;
}

interface StreamSource {
  id: string;
  label: string;
  type: "hls" | "embed";
  url: string;
}

export const LivePlayerModal: React.FC<LivePlayerModalProps> = ({
  channel,
  allChannels,
  onClose,
  onSelectChannel,
  isFavorite,
  onToggleFavorite,
}) => {
  const [showSchedule, setShowSchedule] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeSourceIndex, setActiveSourceIndex] = useState(0);
  const [reactions, setReactions] = useState<LiveReaction[]>([]);
  const [reactionCount, setReactionCount] = useState({ "🇩🇴": 64, "🔥": 128, "⚾": 45, "👏": 92 });

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Compute available sources for this channel
  const sources: StreamSource[] = React.useMemo(() => {
    if (!channel) return [];
    const list: StreamSource[] = [];
    if (channel.hlsUrl) {
      list.push({ id: "hls-primary", label: "Señal Principal HD", type: "hls", url: channel.hlsUrl });
    }
    if (channel.backupHlsUrl) {
      list.push({ id: "hls-backup", label: "Señal Respaldo", type: "hls", url: channel.backupHlsUrl });
    }
    if (channel.embedUrl) {
      list.push({ id: "embed", label: "Señal Web Oficial", type: "embed", url: channel.embedUrl });
    }
    // Fallback if no sources defined
    if (list.length === 0 && channel.hlsUrl) {
      list.push({ id: "hls-primary", label: "Señal HD", type: "hls", url: channel.hlsUrl });
    }
    return list;
  }, [channel]);

  // Reset state when channel changes
  useEffect(() => {
    setActiveSourceIndex(0);
    setHasError(false);
    setErrorMessage("");
    setIsLoading(true);
    setIsPlaying(true);
  }, [channel?.id]);

  const currentSource = sources[activeSourceIndex] || sources[0];

  // Set up HLS or HTML5 Video
  useEffect(() => {
    if (!currentSource || currentSource.type !== "hls") {
      setIsLoading(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    setIsLoading(true);
    setHasError(false);
    setErrorMessage("");

    // Destroy previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const streamUrl = currentSource.url;
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
        setIsLoading(false);
        video.volume = volume;
        video.play().catch(() => {
          // Autoplay policy prevented playback, keep muted
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {});
        });
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.warn("HLS error:", data.type, data.details, data.fatal);
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            setHasError(true);
            setErrorMessage("Señal temporalmente no disponible.");
            setIsLoading(false);
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native Safari / iOS support
      video.src = streamUrl;
      video.volume = volume;
      video.addEventListener("loadedmetadata", () => {
        setIsLoading(false);
        video.volume = volume;
        video.play().catch(() => {
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {});
        });
      });
      video.addEventListener("error", () => {
        setHasError(true);
        setErrorMessage("Error de reproducción en el dispositivo.");
        setIsLoading(false);
      });
    } else {
      setHasError(true);
      setErrorMessage("Tu navegador no soporta streaming HLS directo.");
      setIsLoading(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentSource, sources.length, activeSourceIndex]);

  // Fullscreen state listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Channel sequence switching (Next / Previous channel)
  const currentChannelIndex = React.useMemo(() => {
    if (!channel || allChannels.length === 0) return 0;
    const idx = allChannels.findIndex((c) => c.id === channel.id);
    return idx !== -1 ? idx : 0;
  }, [channel, allChannels]);

  const [channelSwitchFeedback, setChannelSwitchFeedback] = useState<{
    name: string;
    channelNumber: number;
    direction: "next" | "prev";
  } | null>(null);

  const goToNextChannel = useCallback(() => {
    if (allChannels.length === 0) return;
    const nextIdx = (currentChannelIndex + 1) % allChannels.length;
    const nextChan = allChannels[nextIdx];
    setChannelSwitchFeedback({
      name: nextChan.name,
      channelNumber: nextChan.channelNumber,
      direction: "next",
    });
    onSelectChannel(nextChan);
    setTimeout(() => setChannelSwitchFeedback(null), 2500);
  }, [allChannels, currentChannelIndex, onSelectChannel]);

  const goToPrevChannel = useCallback(() => {
    if (allChannels.length === 0) return;
    const prevIdx = (currentChannelIndex - 1 + allChannels.length) % allChannels.length;
    const prevChan = allChannels[prevIdx];
    setChannelSwitchFeedback({
      name: prevChan.name,
      channelNumber: prevChan.channelNumber,
      direction: "prev",
    });
    onSelectChannel(prevChan);
    setTimeout(() => setChannelSwitchFeedback(null), 2500);
  }, [allChannels, currentChannelIndex, onSelectChannel]);

  // Touch Swipe Gesture for full screen channel flipping on mobile & tablets
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

    // Minimum swipe threshold of 50px horizontal and more horizontal than vertical
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        // Deslizar a la izquierda -> siguiente canal
        goToNextChannel();
      } else {
        // Deslizar a la derecha -> canal anterior
        goToPrevChannel();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  // Keyboard navigation & Smart TV Remote control keys (ArrowRight / ArrowLeft / ChannelUp / ChannelDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === "Escape") {
        if (isFullscreen) {
          document.exitFullscreen?.().catch(() => {});
          setIsFullscreen(false);
        } else {
          onClose();
        }
        return;
      }

      // Next channel with Right Arrow or ChannelUp
      if (e.key === "ArrowRight" || e.key === "ChannelUp" || e.key === "PageDown") {
        e.preventDefault();
        goToNextChannel();
        return;
      }

      // Previous channel with Left Arrow or ChannelDown
      if (e.key === "ArrowLeft" || e.key === "ChannelDown" || e.key === "PageUp") {
        e.preventDefault();
        goToPrevChannel();
        return;
      }

      // Toggle fullscreen with 'f' or 'F'
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
        return;
      }

      // Space or Enter to toggle play/pause
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        togglePlay();
        return;
      }

      // 'm' or 'M' to mute/unmute
      if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        toggleMute();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, onClose, goToNextChannel, goToPrevChannel]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const newMuted = !video.muted;
    video.muted = newMuted;
    setIsMuted(newMuted);
    if (!newMuted) {
      const targetVol = volume > 0 ? volume : 0.5;
      video.volume = targetVol;
      setVolume(targetVol);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      if (val === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else if (isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleReload = () => {
    setIsLoading(true);
    setHasError(false);
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    const current = activeSourceIndex;
    setActiveSourceIndex(-1);
    setTimeout(() => setActiveSourceIndex(current), 100);
  };

  const handleAddReaction = (emoji: string) => {
    const newReaction: LiveReaction = {
      id: Date.now() + Math.random(),
      emoji,
      x: 15 + Math.random() * 70,
    };
    setReactions((prev) => [...prev.slice(-15), newReaction]);
    setReactionCount((prev) => ({
      ...prev,
      [emoji as keyof typeof prev]: (prev[emoji as keyof typeof prev] || 0) + 1,
    }));

    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 2500);
  };

  if (!channel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div
        ref={containerRef}
        className="relative w-full max-w-6xl max-h-[96vh] bg-[#0c0c0f] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 bg-[#131318] border-b border-zinc-800/80 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {/* Live Indicator */}
            <span className="flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-red-600 text-white shadow-md shadow-red-950 animate-pulse shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              <span>En Vivo</span>
            </span>

            {/* Channel Title & Number */}
            <div className="flex items-center gap-2 truncate">
              <span className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                {channel.name}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-amber-400 font-bold border border-zinc-700 shrink-0">
                Canal {channel.channelNumber}
              </span>
              <span className="hidden md:inline text-xs text-zinc-400 truncate">
                &bull; {channel.city}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Source Switcher Pill */}
            {sources.length > 1 && (
              <div className="hidden sm:flex items-center bg-zinc-900 border border-zinc-700/80 rounded-xl p-0.5">
                {sources.map((src, idx) => (
                  <button
                    key={src.id}
                    type="button"
                    onClick={() => setActiveSourceIndex(idx)}
                    className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
                      activeSourceIndex === idx
                        ? "bg-red-600 text-white shadow"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {src.label}
                  </button>
                ))}
              </div>
            )}

            {/* Toggle Favorite */}
            <button
              type="button"
              id="player-toggle-fav"
              onClick={() => onToggleFavorite(channel.id)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isFavorite
                  ? "bg-red-600/20 border-red-500 text-red-400"
                  : "bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:text-white"
              }`}
              title={isFavorite ? "En Mi Lista" : "Añadir a Mi Lista"}
            >
              {isFavorite ? <Check className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
            </button>

            {/* Toggle Schedule Drawer */}
            <button
              type="button"
              id="player-toggle-schedule"
              onClick={() => setShowSchedule(!showSchedule)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                showSchedule
                  ? "bg-red-600 border-red-500 text-white"
                  : "bg-zinc-800/80 border-zinc-700 text-zinc-300 hover:text-white"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Guía</span>
            </button>

            {/* Reload Button */}
            <button
              type="button"
              onClick={handleReload}
              className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
              title="Reconectar señal"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
              title="Pantalla Completa"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              id="player-btn-close"
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-800/80 hover:bg-red-600 text-zinc-300 hover:text-white border border-zinc-700 transition-colors cursor-pointer ml-0.5"
              title="Cerrar reproductor"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Player Stage & Schedule Split */}
        <div
          className="relative flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden bg-black"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Video Player Box */}
          <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden aspect-video group">
            {/* Previous Channel Side Button (Hover / Touch on screen edge) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevChannel();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-40 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-red-600/90 text-white/80 hover:text-white border border-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 sm:opacity-40 transition-all cursor-pointer shadow-xl hover:scale-110"
              title="Canal Anterior (Flecha Izquierda)"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Next Channel Side Button (Hover / Touch on screen edge) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToNextChannel();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-40 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-red-600/90 text-white/80 hover:text-white border border-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 sm:opacity-40 transition-all cursor-pointer shadow-xl hover:scale-110"
              title="Siguiente Canal (Flecha Derecha)"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Channel Change Floating OSD HUD (Feedback al cambiar con flechas o toques) */}
            {channelSwitchFeedback && (
              <div className="absolute top-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-black/85 backdrop-blur-md border border-red-500/50 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-600 text-white font-extrabold text-sm">
                  {channelSwitchFeedback.channelNumber}
                </span>
                <div className="text-left">
                  <div className="text-[10px] uppercase font-bold text-red-400 tracking-wider flex items-center gap-1">
                    {channelSwitchFeedback.direction === "next" ? "▶ Siguiente Canal" : "◀ Canal Anterior"}
                  </div>
                  <div className="text-sm font-black text-white truncate max-w-xs">
                    {channelSwitchFeedback.name}
                  </div>
                </div>
              </div>
            )}

            {/* 1. HLS Video Player */}
            {currentSource?.type === "hls" && (
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted={isMuted}
                onWaiting={() => setIsLoading(true)}
                onPlaying={() => {
                  setIsLoading(false);
                  setIsPlaying(true);
                  setHasError(false);
                }}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full object-contain cursor-pointer"
                onClick={togglePlay}
              />
            )}

            {/* 2. Web Embed Player (Dailymotion / Official iframe) */}
            {currentSource?.type === "embed" && (
              <iframe
                title={`Transmisión en vivo de ${channel.name}`}
                src={currentSource.url}
                className="w-full h-full border-0 absolute inset-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}

            {/* Buffering / Connecting Spinner */}
            {isLoading && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 z-30 pointer-events-none">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-3 border-zinc-700 border-t-red-500 animate-spin" />
                  <Radio className="w-5 h-5 text-red-500 absolute inset-0 m-auto animate-pulse" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">Conectando señal de {channel.name}...</p>
                  <p className="text-xs text-zinc-400 mt-0.5">Sintonizando señal en vivo desde República Dominicana</p>
                </div>
              </div>
            )}

            {/* Error Message & Source Fallback Helper */}
            {hasError && (
              <div className="absolute inset-0 bg-zinc-950/90 flex flex-col items-center justify-center p-6 text-center z-30">
                <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
                <h4 className="text-lg font-bold text-white mb-1">Interrupción en la señal</h4>
                <p className="text-sm text-zinc-400 max-w-md mb-5">
                  {errorMessage || "La señal en directo de este canal está experimentando intermitencia."}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleReload}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reintentar Conexión</span>
                  </button>
                  {sources.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setActiveSourceIndex((prev) => (prev + 1) % sources.length)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold border border-zinc-700 transition-colors cursor-pointer"
                    >
                      <Layers className="w-4 h-4" />
                      <span>Probar Señal Alterna ({sources[(activeSourceIndex + 1) % sources.length].label})</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Floating Unmute Banner if audio is muted */}
            {isMuted && currentSource?.type === "hls" && !isLoading && !hasError && (
              <button
                type="button"
                onClick={toggleMute}
                className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 hover:bg-red-600 text-white text-xs font-bold backdrop-blur-md border border-white/20 shadow-lg transition-all cursor-pointer"
              >
                <VolumeX className="w-4 h-4 text-red-400" />
                <span>Audio Silenciado &bull; Toca para Activar</span>
              </button>
            )}

            {/* Floating Live Reactions (Emojis) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
              {reactions.map((reaction) => (
                <span
                  key={reaction.id}
                  style={{ left: `${reaction.x}%` }}
                  className="absolute bottom-16 text-3xl animate-bounce-float select-none drop-shadow-md"
                >
                  {reaction.emoji}
                </span>
              ))}
            </div>

            {/* Player Controls Bar (Overlaid at bottom for HLS) */}
            {currentSource?.type === "hls" && (
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between z-30 opacity-90 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-3">
                  {/* Play / Pause */}
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  {/* Audio / Volume Control */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 sm:w-20 accent-red-600 cursor-pointer h-1.5 bg-zinc-700 rounded-lg"
                    />
                  </div>

                  {/* Resolution Badge */}
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700 text-[10px] font-bold text-zinc-300">
                    {channel.resolution}
                  </span>
                </div>

                {/* Mobile Source Switcher */}
                {sources.length > 1 && (
                  <div className="flex sm:hidden items-center gap-1">
                    {sources.map((src, idx) => (
                      <button
                        key={src.id}
                        type="button"
                        onClick={() => setActiveSourceIndex(idx)}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          activeSourceIndex === idx ? "bg-red-600 text-white" : "bg-zinc-800 text-zinc-400"
                        }`}
                      >
                        S{idx + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Schedule / Guía Drawer */}
          {showSchedule && (
            <div className="w-full lg:w-80 bg-[#101014] border-t lg:border-t-0 lg:border-l border-zinc-800/80 flex flex-col h-64 lg:h-auto overflow-hidden animate-in slide-in-from-right duration-200">
              <div className="px-4 py-3 bg-[#131318] border-b border-zinc-800/80 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Programación de Hoy
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSchedule(false)}
                  className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-zinc-800/40">
                {channel.schedule.map((item) => (
                  <div
                    key={item.id}
                    className={`pt-2.5 first:pt-0 ${
                      item.isLiveNow ? "p-2 rounded-xl bg-red-950/20 border border-red-500/30" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-zinc-400">
                        {item.time}
                      </span>
                      {item.isLiveNow && (
                        <span className="px-1.5 py-0.2 rounded bg-red-600 text-[10px] font-extrabold text-white uppercase tracking-wide">
                          Ahora
                        </span>
                      )}
                    </div>
                    <h5 className="text-xs font-bold text-white mt-0.5">{item.title}</h5>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">
                      {item.description}
                    </p>
                    {item.host && (
                      <p className="text-[10px] text-amber-400/90 font-medium mt-1">
                        Con: {item.host}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Interactive Bar: Program Info + Quisqueya Reactions */}
        <div className="px-3 sm:px-5 py-3 bg-[#111116] border-t border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          {/* Current Program Details */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700 shrink-0 hidden sm:block">
              <img
                src={channel.logo}
                alt={channel.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-red-400">
                  Transmitiendo ahora:
                </span>
                <span className="text-xs text-zinc-400 hidden md:inline">
                  &bull; Siguiente: {channel.nextProgram}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white truncate">
                {channel.currentProgram}
              </h4>
              <p className="text-xs text-zinc-400 line-clamp-1">
                {channel.currentProgramDesc}
              </p>
            </div>
          </div>

          {/* Quisqueya Live Reactions */}
          <div className="flex items-center gap-1.5 sm:gap-2 self-end sm:self-center shrink-0">
            <span className="text-[11px] text-zinc-500 font-semibold hidden md:inline">
              Reaccionar:
            </span>
            {(["🇩🇴", "🔥", "⚾", "👏"] as const).map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleAddReaction(emoji)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-zinc-800/90 hover:bg-zinc-700 active:scale-95 border border-zinc-700/80 text-xs font-bold text-white transition-all cursor-pointer shadow-sm"
              >
                <span className="text-sm">{emoji}</span>
                <span className="text-[11px] text-zinc-300 font-medium">
                  {reactionCount[emoji]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Zapping Dominicano Channel Strip (Quick Switcher) */}
        <div className="px-3 sm:px-4 py-2 bg-[#0d0d10] border-t border-zinc-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Tv className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden sm:inline">Zapping:</span>
          </span>
          {allChannels.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectChannel(c)}
              className={`flex items-center gap-2 px-3 py-1 rounded-xl border text-xs font-bold transition-all shrink-0 cursor-pointer ${
                c.id === channel.id
                  ? "bg-red-600 border-red-500 text-white shadow-md shadow-red-950/40"
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              <span>{c.name}</span>
              <span className="text-[10px] opacity-75">#{c.channelNumber}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
