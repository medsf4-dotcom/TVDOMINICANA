import React, { useState } from "react";
import {
  Play,
  Info,
  Plus,
  Check,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  Tv,
  ChevronRight,
  Flame,
} from "lucide-react";
import { TVChannel } from "../types";

interface HeroBillboardProps {
  channel: TVChannel;
  featuredChannels: TVChannel[];
  onSelectFeatured: (channel: TVChannel) => void;
  onPlayChannel: (channel: TVChannel) => void;
  onOpenDetails: (channel: TVChannel) => void;
  isFavorite: boolean;
  onToggleFavorite: (channelId: string) => void;
}

export const HeroBillboard: React.FC<HeroBillboardProps> = ({
  channel,
  featuredChannels,
  onSelectFeatured,
  onPlayChannel,
  onOpenDetails,
  isFavorite,
  onToggleFavorite,
}) => {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className="relative w-full h-[78vh] sm:h-[82vh] lg:h-[86vh] min-h-[520px] max-h-[820px] bg-black overflow-hidden select-none">
      {/* Background Media with Vignette Gradients */}
      <div className="absolute inset-0">
        <img
          src={channel.bannerImage}
          alt={channel.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-70 transform scale-105 transition-all duration-1000"
        />

        {/* Cinematic Netflix Gradients */}
        {/* Left-to-Right shadow for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d10] via-[#0d0d10]/75 to-transparent w-full md:w-3/4 z-10" />
        {/* Bottom fade to content canvas */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11] via-[#0f0f11]/40 to-transparent z-10" />
        {/* Top subtle fade for navbar contrast */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/80 to-transparent z-10" />
      </div>

      {/* Hero Content Information */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 h-full flex flex-col justify-end pb-16 sm:pb-20">
        <div className="max-w-2xl space-y-3 sm:space-y-4">
          {/* Live Status & Category Pill */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-600 text-white shadow-lg shadow-red-900/50 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span>En Vivo</span>
            </span>

            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-800/90 text-zinc-300 border border-zinc-700">
              Canal {channel.channelNumber} &bull; {channel.city}
            </span>

            <span className="px-2 py-0.5 rounded text-[11px] font-mono text-zinc-400 bg-black/60 border border-zinc-800">
              {channel.resolution}
            </span>
          </div>

          {/* Channel Name Brand */}
          <div className="flex items-center gap-3">
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-['Bebas_Neue',sans-serif]">
              {channel.name}
            </h2>
            <span className="text-xs sm:text-sm font-medium text-red-500 italic bg-red-950/40 px-2.5 py-1 rounded-md border border-red-900/50">
              &ldquo;{channel.slogan}&rdquo;
            </span>
          </div>

          {/* Current Live Program */}
          <div className="bg-zinc-900/60 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-zinc-800/80">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Tv className="w-3.5 h-3.5 text-red-500" />
              <span>Transmitiendo Ahora:</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
              {channel.currentProgram}
            </h3>
            {channel.currentProgramHost && (
              <p className="text-xs sm:text-sm text-red-400 font-medium mt-0.5">
                Con: {channel.currentProgramHost}
              </p>
            )}
            <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 mt-1.5 leading-relaxed">
              {channel.currentProgramDesc}
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <button
              type="button"
              id="hero-btn-play"
              onClick={() => onPlayChannel(channel)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-zinc-950 font-bold text-sm sm:text-base hover:bg-zinc-200 transition-all transform hover:scale-105 active:scale-95 shadow-xl cursor-pointer"
            >
              <Play className="w-5 h-5 fill-zinc-950" />
              <span>Ver En Vivo</span>
            </button>

            <button
              type="button"
              id="hero-btn-info"
              onClick={() => onOpenDetails(channel)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 text-white font-semibold text-sm sm:text-base backdrop-blur-sm border border-zinc-700 transition-all cursor-pointer"
            >
              <Info className="w-5 h-5 text-zinc-300" />
              <span>Guía &amp; Horarios</span>
            </button>

            <button
              type="button"
              id="hero-btn-favorite"
              onClick={() => onToggleFavorite(channel.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                isFavorite
                  ? "bg-red-600 border-red-500 text-white shadow-lg"
                  : "bg-zinc-900/70 border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
              }`}
              title={isFavorite ? "Quitar de Mi Lista" : "Añadir a Mi Lista"}
            >
              {isFavorite ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Bottom Right: Quick Switcher for Featured Dominican Channels */}
        <div className="absolute bottom-6 right-4 sm:right-6 z-30 hidden md:flex flex-col items-end gap-2">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
            Destacados Dominicanos
          </span>
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-zinc-800">
            {featuredChannels.map((feat) => (
              <button
                key={feat.id}
                type="button"
                onClick={() => onSelectFeatured(feat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  feat.id === channel.id
                    ? "bg-red-600 text-white shadow-md scale-105"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                <span>C{feat.channelNumber}</span>
                <span className="font-normal truncate max-w-[90px]">{feat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
