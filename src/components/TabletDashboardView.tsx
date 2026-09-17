import React, { useState, useEffect, useRef } from "react";
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
  Search,
  Sparkles,
  Flame,
  Clock,
  Layers,
  Activity,
  SlidersHorizontal,
  RefreshCw,
} from "lucide-react";
import { TVChannel, CategoryFilter } from "../types";
import { LegalDisclaimer } from "./LegalDisclaimer";

interface TabletDashboardViewProps {
  channels: TVChannel[];
  favorites: string[];
  onToggleFavorite: (channelId: string) => void;
  onOpenFullPlayer: (channel: TVChannel) => void;
  onOpenDetails: (channel: TVChannel) => void;
}

export const TabletDashboardView: React.FC<TabletDashboardViewProps> = ({
  channels,
  favorites,
  onToggleFavorite,
  onOpenFullPlayer,
  onOpenDetails,
}) => {
  const [selectedChannel, setSelectedChannel] = useState<TVChannel>(channels[0]);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSourceIndex, setActiveSourceIndex] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Available sources for selected channel
  const sources = React.useMemo(() => {
    if (!selectedChannel) return [];
    const list: { id: string; label: string; url: string; type: "hls" | "embed" }[] = [];
    if (selectedChannel.hlsUrl) {
      list.push({ id: "hls-1", label: "Señal 1 HD", url: selectedChannel.hlsUrl, type: "hls" });
    }
    if (selectedChannel.backupHlsUrl) {
      list.push({ id: "hls-2", label: "Señal 2 Respaldo", url: selectedChannel.backupHlsUrl, type: "hls" });
    }
    if (selectedChannel.embedUrl) {
      list.push({ id: "embed", label: "Señal Web Oficial", url: selectedChannel.embedUrl, type: "embed" });
    }
    return list;
  }, [selectedChannel]);

  // Reset source on channel change
  useEffect(() => {
    setActiveSourceIndex(0);
  }, [selectedChannel?.id]);

  const currentSource = sources[activeSourceIndex] || sources[0];

  // Setup playback for the embedded tablet player
  useEffect(() => {
    if (!selectedChannel || !currentSource) return;

    if (currentSource.type === "embed") {
      setIsLoading(false);
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    setIsLoading(true);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const streamUrl = currentSource.url;
    if (!streamUrl) {
      setIsLoading(false);
      return;
    }

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
          } else {
            setIsLoading(false);
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
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
    } else {
      setIsLoading(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [selectedChannel?.id, currentSource?.url, activeSourceIndex, sources.length]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const newMuted = !v.muted;
    v.muted = newMuted;
    setIsMuted(newMuted);
    if (!newMuted) {
      const targetVol = volume > 0 ? volume : 0.5;
      v.volume = targetVol;
      setVolume(targetVol);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    const v = videoRef.current;
    if (v) {
      v.volume = val;
      if (val === 0) {
        v.muted = true;
        setIsMuted(true);
      } else {
        v.muted = false;
        setIsMuted(false);
      }
    }
  };

  const filteredChannels = channels.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.channelNumber.toString().includes(q) ||
        c.city.toLowerCase().includes(q)
      );
    }
    if (activeCategory === "favoritos") return favorites.includes(c.id);
    if (activeCategory !== "todos") return c.category === activeCategory;
    return true;
  });

  const isFav = favorites.includes(selectedChannel.id);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-24 pb-16 space-y-6">
      {/* Tablero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#171720] via-[#121216] to-[#171720] border border-zinc-800 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shadow-lg">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Tablero de Control Dominicano</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white animate-pulse">
                EN VIVO
              </span>
            </h1>
            <p className="text-xs text-zinc-400">
              Vista multitarea con monitor satelital activo, parrilla de programación y sintonización rápida
            </p>
          </div>
        </div>

        {/* Live Channel Stats */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
            <div className="text-[10px] text-zinc-400 uppercase font-semibold">Canales Activos</div>
            <div className="text-base font-bold text-white">{channels.length} Señales HD</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
            <div className="text-[10px] text-zinc-400 uppercase font-semibold">Favoritos</div>
            <div className="text-base font-bold text-red-500">{favorites.length} Guardados</div>
          </div>
        </div>
      </div>

      {/* Main Split Stage: Left Embedded Monitor, Right Live Program Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Embedded Live Player (7 Cols on desktop/tablet) */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-2xl group">
            {currentSource?.type === "embed" ? (
              <iframe
                src={currentSource.url}
                title={selectedChannel.name}
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                className="w-full h-full border-0"
              />
            ) : (
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted={isMuted}
                className="w-full h-full object-contain cursor-pointer"
                onClick={togglePlay}
              />
            )}

            {/* Loading Indicator */}
            {isLoading && currentSource?.type !== "embed" && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 z-20 pointer-events-none">
                <div className="w-10 h-10 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
                <span className="text-xs font-bold text-white">Sintonizando señal satelital...</span>
              </div>
            )}

            {/* Unmute Pill */}
            {isMuted && !isLoading && (
              <button
                type="button"
                onClick={toggleMute}
                className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 hover:bg-red-600 text-white text-xs font-bold backdrop-blur-md border border-white/20 shadow-lg transition-all cursor-pointer"
              >
                <VolumeX className="w-4 h-4 text-red-400" />
                <span>Activar Audio</span>
              </button>
            )}

            {/* Top Right Channel Badge */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-xl bg-black/75 border border-zinc-700 text-amber-400 font-['Bebas_Neue',sans-serif] text-lg tracking-wider backdrop-blur-md">
                CH {selectedChannel.channelNumber}
              </span>
              <button
                type="button"
                onClick={() => onOpenFullPlayer(selectedChannel)}
                className="p-2 rounded-xl bg-black/75 hover:bg-red-600 text-white border border-zinc-700 transition-colors cursor-pointer backdrop-blur-md"
                title="Abrir en Pantalla Completa"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Floating Control Strip */}
            <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between z-20">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title={isMuted ? "Activar audio" : "Silenciar"}
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
                    className="w-16 sm:w-20 accent-red-600 h-1.5 bg-zinc-700 rounded-lg cursor-pointer"
                    title={`Volumen: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                  />
                </div>
                <span className="text-xs font-bold text-white drop-shadow-sm truncate max-w-[180px] hidden sm:inline">
                  {selectedChannel.name} &bull; {selectedChannel.city}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onToggleFavorite(selectedChannel.id)}
                  className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                    isFav
                      ? "bg-red-600/30 border-red-500 text-red-400"
                      : "bg-black/60 border-zinc-700 text-zinc-300 hover:text-white"
                  }`}
                  title={isFav ? "En Favoritos" : "Agregar a Favoritos"}
                >
                  {isFav ? <Check className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => onOpenFullPlayer(selectedChannel)}
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Pantalla Completa
                </button>
              </div>
            </div>
          </div>

          {/* Signal / Source Selector Bar */}
          {sources.length > 1 && (
            <div className="flex items-center gap-2 px-1">
              <span className="text-xs text-zinc-400 font-semibold">Fuente de señal:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {sources.map((src, sIdx) => (
                  <button
                    key={src.id}
                    type="button"
                    onClick={() => setActiveSourceIndex(sIdx)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeSourceIndex === sIdx
                        ? "bg-red-600 text-white shadow-md shadow-red-900/30"
                        : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700"
                    }`}
                  >
                    {src.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Current Program Details Bar */}
          <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase text-red-500 tracking-wider">
                  En Transmisión:
                </span>
                <span className="text-xs text-zinc-400">&bull; {selectedChannel.resolution}</span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                {selectedChannel.currentProgram}
              </h3>
              <p className="text-xs text-zinc-400 line-clamp-1">
                {selectedChannel.currentProgramDesc}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenDetails(selectedChannel)}
              className="text-xs text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors shrink-0"
            >
              Ver Detalles
            </button>
          </div>
        </div>

        {/* Right: Live EPG Guide Panel (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col rounded-2xl bg-[#14141a] border border-zinc-800 shadow-xl overflow-hidden h-[420px] lg:h-auto">
          <div className="px-4 py-3 bg-[#181822] border-b border-zinc-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-500" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Parrilla &bull; {selectedChannel.name}
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 font-semibold">Horario Dominicano</span>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2.5 divide-y divide-zinc-800/60">
            {selectedChannel.schedule.map((item) => (
              <div
                key={item.id}
                className={`pt-2.5 first:pt-0 ${
                  item.isLiveNow ? "p-2.5 rounded-xl bg-red-950/30 border border-red-500/40" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-amber-400">{item.time}</span>
                  {item.isLiveNow && (
                    <span className="px-2 py-0.5 rounded bg-red-600 text-[10px] font-black text-white uppercase tracking-wide animate-pulse">
                      Ahora En Vivo
                    </span>
                  )}
                </div>
                <h5 className="text-xs font-bold text-white mt-1">{item.title}</h5>
                <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-2">{item.description}</p>
                {item.host && (
                  <p className="text-[10px] text-zinc-500 mt-1">Conduce: {item.host}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Channel Grid / Matrix Section with Category Filters */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            {(
              [
                { id: "todos", label: "Todos los Canales" },
                { id: "populares", label: "Cadenas Populares" },
                { id: "noticias", label: "Noticias 24/7" },
                { id: "cibao", label: "Cibao & Santiago" },
                { id: "deportes", label: "Pelota / LIDOM" },
                { id: "variedades", label: "Variedades" },
                { id: "favoritos", label: `Favoritos (${favorites.length})` },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-red-600 text-white shadow-lg shadow-red-950"
                    : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick Search inside Tablero */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar canal o ciudad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Tablero Channel Matrix Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredChannels.map((channel) => {
            const isCurrent = selectedChannel.id === channel.id;
            const fav = favorites.includes(channel.id);
            return (
              <div
                key={channel.id}
                onClick={() => setSelectedChannel(channel)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? "bg-zinc-900 border-red-500 ring-2 ring-red-500/40 shadow-xl"
                    : "bg-zinc-950/80 hover:bg-zinc-900/90 border-zinc-800/90 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shrink-0">
                      <img
                        src={channel.logo}
                        alt={channel.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="truncate">
                      <h4 className="text-sm font-bold text-white tracking-tight truncate">
                        {channel.name}
                      </h4>
                      <p className="text-[11px] text-zinc-400 truncate">{channel.city}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400 font-['Bebas_Neue',sans-serif] text-sm tracking-wider shrink-0">
                    CH {channel.channelNumber}
                  </span>
                </div>

                <div className="bg-zinc-900/60 rounded-xl p-2.5 mb-3 border border-zinc-800/60">
                  <div className="text-[10px] text-red-400 font-bold uppercase tracking-wider">
                    Ahora:
                  </div>
                  <div className="text-xs font-bold text-zinc-200 truncate mt-0.5">
                    {channel.currentProgram}
                  </div>
                  <div className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                    {channel.currentProgramDesc}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-800/80">
                  <span className="text-[10px] text-zinc-500 font-semibold">
                    {channel.resolution}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(channel.id);
                      }}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        fav
                          ? "bg-red-600/30 border-red-500 text-red-400"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {fav ? <Check className="w-3.5 h-3.5" /> : <Heart className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenFullPlayer(channel);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Ver En Vivo
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legal Disclaimer & Limitation of Liability */}
        <LegalDisclaimer />
      </div>
    </div>
  );
};
