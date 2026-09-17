import React, { useState } from "react";
import {
  Tv,
  Radio,
  Heart,
  Check,
  Calendar,
  Play,
  Search,
  Sparkles,
  Flame,
  Clock,
  Info,
  SlidersHorizontal,
} from "lucide-react";
import { TVChannel, CategoryFilter } from "../types";
import { LegalDisclaimer } from "./LegalDisclaimer";

interface MobileViewProps {
  channels: TVChannel[];
  favorites: string[];
  onToggleFavorite: (channelId: string) => void;
  onPlayChannel: (channel: TVChannel) => void;
  onOpenDetails: (channel: TVChannel) => void;
  onOpenEPG: () => void;
}

export const MobileView: React.FC<MobileViewProps> = ({
  channels,
  favorites,
  onToggleFavorite,
  onPlayChannel,
  onOpenDetails,
  onOpenEPG,
}) => {
  const [activeTab, setActiveTab] = useState<"inicio" | "canales" | "favoritos">("inicio");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChannels = channels.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.channelNumber.toString().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.currentProgram.toLowerCase().includes(q)
      );
    }
    if (activeTab === "favoritos") return favorites.includes(c.id);
    if (activeCategory !== "todos") return c.category === activeCategory;
    return true;
  });

  const featuredChannel = channels[0]; // Color Visión or Telemicro

  return (
    <div className="w-full min-h-screen bg-[#0d0d10] text-white pb-24 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Mobile Top Header */}
      <div className="sticky top-0 z-40 px-4 py-3 bg-[#111116]/95 backdrop-blur-md border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-['Bebas_Neue',sans-serif] text-2xl tracking-tight text-red-600 font-black">
            ELITVRD
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 font-bold border border-red-500/30 uppercase tracking-wide">
            Móvil
          </span>
        </div>

        {/* Quick Search */}
        <div className="relative flex-1 max-w-[210px] ml-3">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar canal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700/80 rounded-full pl-8 pr-3 py-1 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Dominican "Historias En Vivo" (Story Circles Bar for quick zapping) */}
      <div className="pt-3 pb-2 px-4 border-b border-zinc-800/60 bg-[#0f0f13]">
        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          <span>Canales En Vivo (Toca para sintonizar)</span>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1">
          {channels.slice(0, 10).map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onPlayChannel(c)}
              className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer focus:outline-none"
            >
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-red-600 via-amber-500 to-blue-600 shadow-md group-active:scale-95 transition-transform">
                <div className="w-13 h-13 rounded-full overflow-hidden bg-black border-2 border-black">
                  <img
                    src={c.logo}
                    alt={c.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-red-600 text-[9px] font-black text-white border border-black shadow">
                  {c.channelNumber}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-zinc-300 max-w-[62px] truncate text-center">
                {c.name.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Hero Banner if on Inicio */}
      {activeTab === "inicio" && !searchQuery.trim() && (
        <div className="relative aspect-16/10 w-full overflow-hidden bg-black">
          <img
            src={featuredChannel.bannerImage}
            alt={featuredChannel.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d10] via-[#0d0d10]/50 to-transparent" />

          <div className="absolute bottom-3 left-4 right-4 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-wider animate-pulse">
                Canal Destacado
              </span>
              <span className="text-xs text-amber-400 font-bold">
                Canal {featuredChannel.channelNumber} &bull; {featuredChannel.city}
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              {featuredChannel.name}
            </h2>
            <p className="text-xs text-zinc-300 line-clamp-1">
              {featuredChannel.currentProgram}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onPlayChannel(featuredChannel)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-600 active:bg-red-700 text-white font-bold text-xs shadow-lg cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Ver En Vivo</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenDetails(featuredChannel)}
                className="px-3.5 py-2.5 rounded-xl bg-zinc-800 active:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 cursor-pointer"
              >
                Detalles
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Pills Slider */}
      <div className="px-4 py-3 flex items-center gap-2 overflow-x-auto scrollbar-none border-b border-zinc-800/80">
        {(
          [
            { id: "todos", label: "Todos" },
            { id: "populares", label: "Populares" },
            { id: "noticias", label: "Noticias" },
            { id: "cibao", label: "Cibao" },
            { id: "deportes", label: "Pelota" },
            { id: "variedades", label: "Variedades" },
          ] as const
        ).map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeCategory === cat.id
                ? "bg-red-600 text-white shadow-md shadow-red-950"
                : "bg-zinc-900 text-zinc-400 border border-zinc-800"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Channel Feed List */}
      <div className="p-4 space-y-3.5">
        <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
          <span className="font-bold uppercase tracking-wider text-zinc-300">
            {activeTab === "favoritos"
              ? `Mis Canales Favoritos (${favorites.length})`
              : `Canales Disponibles (${filteredChannels.length})`}
          </span>
          <span className="text-[11px]">1080p / 720p HD</span>
        </div>

        {filteredChannels.length > 0 ? (
          filteredChannels.map((channel) => {
            const isFav = favorites.includes(channel.id);
            return (
              <div
                key={channel.id}
                className="bg-[#141419] rounded-2xl overflow-hidden border border-zinc-800 shadow-md active:border-red-500/60 transition-all flex flex-col"
              >
                {/* Channel Header Banner */}
                <div
                  className="relative aspect-21/9 w-full bg-zinc-900 cursor-pointer"
                  onClick={() => onPlayChannel(channel)}
                >
                  <img
                    src={channel.bannerImage}
                    alt={channel.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141419] via-[#141419]/40 to-transparent" />

                  {/* Channel Number Badge */}
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-black/80 text-amber-400 font-['Bebas_Neue',sans-serif] text-sm tracking-wider border border-zinc-700 backdrop-blur-xs">
                    CH {channel.channelNumber}
                  </span>

                  {/* Live Badge */}
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow">
                    En Vivo
                  </span>

                  {/* Play Center Icon */}
                  <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Card Info & Actions */}
                <div className="p-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white truncate">
                        {channel.name}
                      </h4>
                      <span className="text-[10px] text-zinc-400 shrink-0">
                        &bull; {channel.city}
                      </span>
                    </div>
                    <p className="text-xs text-red-400 font-semibold truncate mt-0.5">
                      {channel.currentProgram}
                    </p>
                    <p className="text-[11px] text-zinc-400 line-clamp-1">
                      {channel.currentProgramDesc}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(channel.id)}
                      className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                        isFav
                          ? "bg-red-600/20 border-red-500 text-red-400"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {isFav ? <Check className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => onPlayChannel(channel)}
                      className="px-3.5 py-2 rounded-xl bg-red-600 active:bg-red-700 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Ver</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-16 text-center bg-zinc-900/40 rounded-2xl border border-zinc-800 p-4">
            <Tv className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white">No hay canales encontrados</h4>
            <p className="text-xs text-zinc-400 mt-1">Intenta con otra categoría o búsqueda.</p>
          </div>
        )}

        {/* Legal Disclaimer & Limitation of Liability */}
        <div className="pb-4">
          <LegalDisclaimer />
        </div>
      </div>

      {/* Fixed Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-[#101015]/95 backdrop-blur-lg border-t border-zinc-800/90 px-4 py-2 flex items-center justify-around shadow-2xl">
        <button
          type="button"
          onClick={() => {
            setActiveTab("inicio");
            setActiveCategory("todos");
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === "inicio" ? "text-red-500 font-bold" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Tv className="w-5 h-5" />
          <span className="text-[10px]">Inicio</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("canales");
            setActiveCategory("todos");
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === "canales" ? "text-red-500 font-bold" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Radio className="w-5 h-5" />
          <span className="text-[10px]">Canales</span>
        </button>

        <button
          type="button"
          onClick={onOpenEPG}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px]">Guía EPG</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("favoritos")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === "favoritos" ? "text-red-500 font-bold" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Heart className={`w-5 h-5 ${favorites.length > 0 ? "fill-current" : ""}`} />
          <span className="text-[10px]">Mi Lista ({favorites.length})</span>
        </button>
      </div>
    </div>
  );
};
