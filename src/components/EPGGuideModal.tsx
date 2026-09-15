import React, { useState } from "react";
import { X, Play, Calendar, Clock, Tv, Search, Radio } from "lucide-react";
import { TVChannel } from "../types";

interface EPGGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  channels: TVChannel[];
  onPlayChannel: (channel: TVChannel) => void;
}

export const EPGGuideModal: React.FC<EPGGuideModalProps> = ({
  isOpen,
  onClose,
  channels,
  onPlayChannel,
}) => {
  const [filterText, setFilterText] = useState("");

  if (!isOpen) return null;

  const filteredChannels = channels.filter((c) =>
    c.name.toLowerCase().includes(filterText.toLowerCase()) ||
    c.currentProgram.toLowerCase().includes(filterText.toLowerCase()) ||
    c.schedule.some((s) => s.title.toLowerCase().includes(filterText.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#111115] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#17171e] border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600 text-white shadow-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Guía de Televisión Dominicana</span>
                <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-normal">
                  Hoy en Vivo
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                Horarios y parrilla de programación de las principales cadenas de República Dominicana
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filtrar por programa o canal..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Channels Schedule Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {filteredChannels.map((channel) => (
            <div
              key={channel.id}
              className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              {/* Channel Header in EPG */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded bg-red-600 text-white text-xs font-bold">
                    C{channel.channelNumber}
                  </span>
                  <h4 className="text-base font-bold text-white">
                    {channel.name}
                  </h4>
                  <span className="text-xs text-zinc-400">
                    &bull; {channel.city}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onPlayChannel(channel);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-zinc-950" />
                  <span>Sintonizar Ahora</span>
                </button>
              </div>

              {/* Schedule Timeline Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {channel.schedule.map((prog) => (
                  <div
                    key={prog.id}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      prog.isLiveNow
                        ? "bg-red-950/40 border-red-600/70 shadow-md ring-1 ring-red-600/30"
                        : "bg-zinc-950/40 border-zinc-800/70"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-mono text-zinc-400">
                        {prog.time}
                      </span>
                      {prog.isLiveNow && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-red-600 text-white animate-pulse">
                          Al Aire
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-white line-clamp-1">
                      {prog.title}
                    </div>
                    {prog.host && (
                      <div className="text-[10px] text-red-400 truncate mt-0.5">
                        Con {prog.host}
                      </div>
                    )}
                    <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-snug">
                      {prog.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
