import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { TVChannel } from "../types";
import { ChannelCard } from "./ChannelCard";

interface ChannelRowProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  channels: TVChannel[];
  onPlayChannel: (channel: TVChannel) => void;
  onOpenDetails: (channel: TVChannel) => void;
  favorites: string[];
  onToggleFavorite: (channelId: string) => void;
}

export const ChannelRow: React.FC<ChannelRowProps> = ({
  title,
  subtitle,
  icon,
  channels,
  onPlayChannel,
  onOpenDetails,
  favorites,
  onToggleFavorite,
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!channels || channels.length === 0) {
    return null;
  }

  return (
    <div className="relative group/row my-6 sm:my-8 px-4 sm:px-6">
      {/* Row Header */}
      <div className="flex items-baseline justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon && <span className="text-red-500">{icon}</span>}
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <span className="hidden sm:inline text-xs text-zinc-400 font-normal">
              &bull; {subtitle}
            </span>
          )}
        </div>
        <span className="text-xs font-semibold text-zinc-500">
          {channels.length} {channels.length === 1 ? "canal" : "canales"}
        </span>
      </div>

      {/* Horizontal Carousel Container */}
      <div className="relative">
        {/* Left Navigation Arrow */}
        <button
          type="button"
          onClick={() => handleScroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 sm:-ml-4 z-20 w-9 h-14 sm:w-11 sm:h-20 bg-black/80 hover:bg-black text-white rounded-r-lg flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity backdrop-blur-xs border border-zinc-700/50 shadow-2xl cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Scrollable Track */}
        <div
          ref={rowRef}
          className="flex items-stretch gap-3 sm:gap-4 overflow-x-auto py-2 scroll-smooth scrollbar-none"
        >
          {channels.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              onPlay={onPlayChannel}
              onOpenDetails={onOpenDetails}
              isFavorite={favorites.includes(channel.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>

        {/* Right Navigation Arrow */}
        <button
          type="button"
          onClick={() => handleScroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-2 sm:-mr-4 z-20 w-9 h-14 sm:w-11 sm:h-20 bg-black/80 hover:bg-black text-white rounded-l-lg flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity backdrop-blur-xs border border-zinc-700/50 shadow-2xl cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
