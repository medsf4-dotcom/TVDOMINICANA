import React from "react";
import {
  X,
  Play,
  Heart,
  Check,
  Calendar,
  Clock,
  Radio,
  MapPin,
  Tv,
  Share2,
  Sparkles,
} from "lucide-react";
import { TVChannel } from "../types";

interface ChannelDetailModalProps {
  channel: TVChannel | null;
  onClose: () => void;
  onPlayChannel: (channel: TVChannel) => void;
  isFavorite: boolean;
  onToggleFavorite: (channelId: string) => void;
}

export const ChannelDetailModal: React.FC<ChannelDetailModalProps> = ({
  channel,
  onClose,
  onPlayChannel,
  isFavorite,
  onToggleFavorite,
}) => {
  if (!channel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#121217] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col">
        {/* Header Media Banner */}
        <div className="relative aspect-video sm:aspect-21/9 w-full overflow-hidden bg-black shrink-0">
          <img
            src={channel.bannerImage}
            alt={channel.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121217] via-[#121217]/60 to-transparent" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/70 hover:bg-zinc-800 text-white border border-zinc-700 transition-colors cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Banner Details */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white">
                  Canal {channel.channelNumber}
                </span>
                <span className="px-2 py-0.5 rounded text-xs bg-black/70 text-zinc-300 border border-zinc-700">
                  {channel.city}
                </span>
                <span className="px-2 py-0.5 rounded text-xs bg-black/70 text-zinc-300 border border-zinc-700">
                  {channel.categoryLabel}
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-['Bebas_Neue',sans-serif] tracking-wide">
                {channel.name}
              </h2>
              <p className="text-xs sm:text-sm text-red-400 font-medium italic">
                &ldquo;{channel.slogan}&rdquo;
              </p>
            </div>

            {/* Quick Play CTA */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onPlayChannel(channel);
              }}
              className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-xl transition-all cursor-pointer shrink-0"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Ver Señal</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Action Row for Mobile */}
          <div className="sm:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onPlayChannel(channel);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Ver En Vivo</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleFavorite(channel.id)}
              className={`p-2.5 rounded-xl border cursor-pointer ${
                isFavorite
                  ? "bg-red-600/30 border-red-500 text-red-400"
                  : "bg-zinc-800 border-zinc-700 text-zinc-300"
              }`}
            >
              {isFavorite ? <Check className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
            </button>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
              Sobre el Canal
            </h4>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {channel.description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {channel.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-lg text-xs bg-zinc-800 text-zinc-300 border border-zinc-700"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Today's Broadcast Schedule (EPG) */}
          <div className="pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-red-500" />
                <span>Guía de Programación para Hoy</span>
              </h4>
              <span className="text-xs text-zinc-500">Hora local RD (GMT-4)</span>
            </div>

            <div className="space-y-2.5">
              {channel.schedule.map((prog) => (
                <div
                  key={prog.id}
                  className={`p-3 rounded-xl border transition-all ${
                    prog.isLiveNow
                      ? "bg-red-950/40 border-red-600/70 shadow-md"
                      : "bg-zinc-900/60 border-zinc-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="text-xs font-bold text-zinc-300">
                        {prog.time}
                      </span>
                    </div>
                    {prog.isLiveNow && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white">
                        Transmitiendo Ahora
                      </span>
                    )}
                  </div>

                  <h5 className="text-sm font-bold text-white">
                    {prog.title}
                  </h5>

                  {prog.host && (
                    <span className="text-xs text-red-400 block mt-0.5 font-medium">
                      Conducción: {prog.host}
                    </span>
                  )}

                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {prog.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical and Broadcast Info */}
          <div className="pt-2 border-t border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 block uppercase">Canal Físico</span>
              <span className="text-sm font-bold text-amber-400">Canal {channel.channelNumber}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 block uppercase">Resolución</span>
              <span className="text-sm font-bold text-zinc-200">{channel.resolution}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 block uppercase">Ciudad Matriz</span>
              <span className="text-sm font-bold text-zinc-200">{channel.city}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
              <span className="text-[10px] text-zinc-500 block uppercase">Cobertura</span>
              <span className="text-sm font-bold text-zinc-200">Nacional &amp; Diáspora</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
