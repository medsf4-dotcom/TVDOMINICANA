import React, { useState, useEffect } from "react";
import {
  Tv,
  Search,
  Heart,
  Calendar,
  Sparkles,
  X,
  Radio,
  SlidersHorizontal,
  Flame,
  Smartphone,
  Tablet,
  MonitorPlay,
  Monitor,
  Usb,
  Download,
} from "lucide-react";
import { CategoryFilter, DeviceFormat } from "../types";

interface NavbarProps {
  activeCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  favoritesCount: number;
  onOpenEPG: () => void;
  onOpenInstall: () => void;
  deviceFormat: DeviceFormat;
  onSelectDeviceFormat: (format: DeviceFormat) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  favoritesCount,
  onOpenEPG,
  onOpenInstall,
  deviceFormat,
  onSelectDeviceFormat,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0b0b0e]/95 backdrop-blur-md border-b border-zinc-800/80 py-2.5 shadow-2xl"
          : "bg-gradient-to-b from-black/90 via-black/50 to-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Brand & Navigation */}
        <div className="flex items-center gap-6 lg:gap-8">
          {/* ELITVRD Logo */}
          <button
            type="button"
            onClick={() => onSelectCategory("todos")}
            className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none"
          >
            <div className="relative">
              <span className="font-black text-2xl sm:text-3xl tracking-tighter text-red-600 font-['Bebas_Neue',sans-serif] select-none group-hover:scale-105 transition-transform drop-shadow-[0_2px_8px_rgba(229,9,20,0.6)]">
                ELITVRD
              </span>
              <span className="absolute -top-1 -right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-300">
                DOMINICANA
              </span>
              <span className="text-[9px] text-zinc-500 font-medium -mt-1">
                EN VIVO
              </span>
            </div>
          </button>

          {/* Nav Categories */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-medium">
            <button
              type="button"
              id="nav-cat-todos"
              onClick={() => onSelectCategory("todos")}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                activeCategory === "todos"
                  ? "bg-white text-zinc-950 font-bold shadow-sm"
                  : "text-zinc-300 hover:text-white hover:bg-white/10"
              }`}
            >
              Inicio
            </button>

            <button
              type="button"
              id="nav-cat-populares"
              onClick={() => onSelectCategory("populares")}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                activeCategory === "populares"
                  ? "bg-red-600 text-white font-bold shadow-sm"
                  : "text-zinc-300 hover:text-white hover:bg-white/10"
              }`}
            >
              Canales Populares
            </button>

            <button
              type="button"
              id="nav-cat-noticias"
              onClick={() => onSelectCategory("noticias")}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                activeCategory === "noticias"
                  ? "bg-blue-600 text-white font-bold shadow-sm"
                  : "text-zinc-300 hover:text-white hover:bg-white/10"
              }`}
            >
              Noticias 24/7
            </button>

            <button
              type="button"
              id="nav-cat-cibao"
              onClick={() => onSelectCategory("cibao")}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                activeCategory === "cibao"
                  ? "bg-amber-500 text-zinc-950 font-bold shadow-sm"
                  : "text-zinc-300 hover:text-white hover:bg-white/10"
              }`}
            >
              Cibao & Santiago
            </button>

            <button
              type="button"
              id="nav-cat-deportes"
              onClick={() => onSelectCategory("deportes")}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                activeCategory === "deportes"
                  ? "bg-emerald-600 text-white font-bold shadow-sm"
                  : "text-zinc-300 hover:text-white hover:bg-white/10"
              }`}
            >
              Pelota / LIDOM
            </button>

            <button
              type="button"
              id="nav-cat-favoritos"
              onClick={() => onSelectCategory("favoritos")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                activeCategory === "favoritos"
                  ? "bg-red-600/90 text-white font-bold shadow-sm"
                  : "text-zinc-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${favoritesCount > 0 ? "fill-red-500 text-red-500" : ""}`} />
              <span>Mi Lista</span>
              {favoritesCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-red-700 text-white font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Right: Search, EPG Guide & Flag */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Input / Toggle */}
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <div className="flex items-center bg-zinc-900/90 border border-zinc-700 rounded-full px-3 py-1.5 w-48 sm:w-64 transition-all">
                <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar canal, programa o ciudad..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  autoFocus
                  className="bg-transparent text-xs text-white placeholder:text-zinc-500 focus:outline-none w-full"
                />
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange("");
                    setIsSearchOpen(false);
                  }}
                  className="text-zinc-400 hover:text-white p-0.5 cursor-pointer ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                id="btn-open-search"
                onClick={() => setIsSearchOpen(true)}
                title="Buscar canales"
                className="p-2 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>

          {/* Guía TV / EPG Button */}
          <button
            type="button"
            id="btn-epg-guide"
            onClick={onOpenEPG}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 transition-all cursor-pointer shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden sm:inline">Guía de Canales</span>
            <span className="sm:hidden">Guía</span>
          </button>

          {/* Instalar en Smart TV / USB Button */}
          <button
            type="button"
            id="btn-install-tv"
            onClick={onOpenInstall}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-red-600/30 to-zinc-900 hover:from-red-600/50 hover:to-zinc-800 text-white border border-red-500/40 transition-all cursor-pointer shadow-xs group"
          >
            <Usb className="w-3.5 h-3.5 text-red-400 group-hover:text-red-300" />
            <span className="hidden md:inline">Instalar en TV / USB</span>
            <span className="md:hidden">TV / USB</span>
          </button>

          {/* Formato Selector (Móvil / Tablero / TV / Auto) */}
          <div className="flex items-center bg-zinc-900/95 border border-zinc-700/90 rounded-full p-0.5 shadow-md">
            <button
              type="button"
              onClick={() => onSelectDeviceFormat("auto")}
              title="Modo Automático"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                deviceFormat === "auto"
                  ? "bg-red-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Auto</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectDeviceFormat("mobile")}
              title="Formato Móvil (Celular)"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                deviceFormat === "mobile"
                  ? "bg-red-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Móvil</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectDeviceFormat("tablet")}
              title="Formato Tablero / Tableta"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                deviceFormat === "tablet"
                  ? "bg-red-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablero</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectDeviceFormat("tv")}
              title="Formato Smart TV (Pantalla Grande & Control Remoto)"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                deviceFormat === "tv"
                  ? "bg-red-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <MonitorPlay className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Modo TV</span>
            </button>
          </div>

          {/* Dominican Flag Badge */}
          <div
            title="Transmisiones desde República Dominicana"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-300 font-medium"
          >
            <span className="text-sm select-none">🇩🇴</span>
            <span className="hidden lg:inline text-zinc-400">Rep. Dominicana</span>
          </div>

          {/* Profile Avatar (Netflix Style) */}
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-red-600 via-blue-600 to-red-800 flex items-center justify-center font-bold text-xs text-white shadow-md border border-white/20 select-none">
            RD
          </div>
        </div>
      </div>

      {/* Mobile Categories Bar */}
      <div className="md:hidden flex items-center gap-1.5 overflow-x-auto px-4 pt-2 pb-1 scrollbar-none border-t border-zinc-800/50 mt-2">
        <button
          type="button"
          onClick={() => onSelectCategory("todos")}
          className={`px-3 py-1 rounded-full text-xs shrink-0 ${
            activeCategory === "todos"
              ? "bg-white text-zinc-950 font-bold"
              : "text-zinc-400 bg-zinc-900/80"
          }`}
        >
          Todos
        </button>
        <button
          type="button"
          onClick={() => onSelectCategory("populares")}
          className={`px-3 py-1 rounded-full text-xs shrink-0 ${
            activeCategory === "populares"
              ? "bg-red-600 text-white font-bold"
              : "text-zinc-400 bg-zinc-900/80"
          }`}
        >
          Populares
        </button>
        <button
          type="button"
          onClick={() => onSelectCategory("noticias")}
          className={`px-3 py-1 rounded-full text-xs shrink-0 ${
            activeCategory === "noticias"
              ? "bg-blue-600 text-white font-bold"
              : "text-zinc-400 bg-zinc-900/80"
          }`}
        >
          Noticias 24/7
        </button>
        <button
          type="button"
          onClick={() => onSelectCategory("cibao")}
          className={`px-3 py-1 rounded-full text-xs shrink-0 ${
            activeCategory === "cibao"
              ? "bg-amber-500 text-zinc-950 font-bold"
              : "text-zinc-400 bg-zinc-900/80"
          }`}
        >
          Cibao & Santiago
        </button>
        <button
          type="button"
          onClick={() => onSelectCategory("deportes")}
          className={`px-3 py-1 rounded-full text-xs shrink-0 ${
            activeCategory === "deportes"
              ? "bg-emerald-600 text-white font-bold"
              : "text-zinc-400 bg-zinc-900/80"
          }`}
        >
          LIDOM Pelota
        </button>
        <button
          type="button"
          onClick={() => onSelectCategory("favoritos")}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs shrink-0 ${
            activeCategory === "favoritos"
              ? "bg-red-600 text-white font-bold"
              : "text-zinc-400 bg-zinc-900/80"
          }`}
        >
          <Heart className="w-3 h-3" />
          <span>Mi Lista ({favoritesCount})</span>
        </button>
      </div>
    </nav>
  );
};
