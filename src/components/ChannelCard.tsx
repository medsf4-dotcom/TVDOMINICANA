import React from "react";
import { Play, Plus, Check, Info, Tv, Radio, Sparkles } from "lucide-react";
import { TVChannel } from "../types";

interface ChannelCardProps {
  channel: TVChannel;
  onPlay: (channel: TVChannel) => void;
  onOpenDetails: (channel: TVChannel) => void;
  isFavorite: boolean;
  onToggleFavorite: (channelId: string) => void;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  onPlay,
  onOpenDetails,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <div
      className="group relative flex-shrink-0 w-[270px] sm:w-[320px] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800/80 hover:border-red-500/60 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-red-950/30 cursor-pointer flex flex-col"
      onClick={() => onPlay(channel)}
    >
      {/* Thumbnail Banner */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
        <img
          src={channel.bannerImage}
          alt={channel.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
          {/* En Vivo Pulse Badge */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white shadow-md shadow-red-950">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
            <span>En Vivo</span>
          </span>

          {/* Channel Frequency Badge */}
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-black/75 text-amber-400 backdrop-blur-xs border border-amber-500/30">
            Canal {channel.channelNumber}
          </span>
        </div>

        {/* Play Overlay Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </div>
        </div>

        {/* Channel Name Brand Overlay at bottom of image */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between">
          <h4 className="text-sm font-bold text-white tracking-tight drop-shadow-md">
            {channel.name}
          </h4>
          <span className="text-[10px] text-zinc-400 font-medium">
            {channel.city}
          </span>
        </div>
      </div>

      {/* Card Body Details */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between bg-zinc-900/95 space-y-2">
        {/* Current Show */}
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-red-500 mb-0.5">
            <Tv className="w-3 h-3" />
            <span>Al Aire Ahora:</span>
          </div>
          <h5 className="text-xs sm:text-sm font-semibold text-zinc-100 line-clamp-1 group-hover:text-red-400 transition-colors">
            {channel.currentProgram}
          </h5>
          <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
            {channel.currentProgramDesc}
          </p>
        </div>

        {/* Next Show Teaser */}
        <div className="text-[10px] text-zinc-500 pt-1.5 border-t border-zinc-800/80 truncate">
          <span className="text-zinc-400 font-medium">Siguiente:</span> {channel.nextProgram}
        </div>

        {/* Interactive Action Row */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              id={`card-play-${channel.id}`}
              onClick={() => onPlay(channel)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-zinc-950 hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              <Play className="w-3 h-3 fill-zinc-950" />
              <span>Ver</span>
            </button>

            <button
              type="button"
              id={`card-fav-${channel.id}`}
              onClick={() => onToggleFavorite(channel.id)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isFavorite
                  ? "bg-red-600/30 border-red-500 text-red-400"
                  : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white"
              }`}
              title={isFavorite ? "Quitar de Mi Lista" : "Añadir a Mi Lista"}
            >
              {isFavorite ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            type="button"
            id={`card-info-${channel.id}`}
            onClick={() => onOpenDetails(channel)}
            className="flex items-center gap-1 text-[11px] font-medium text-zinc-400 hover:text-white p-1 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-zinc-400" />
            <span>Guía</span>
          </button>
        </div>
      </div>
    </div>
  );
};
