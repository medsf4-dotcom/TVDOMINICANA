/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { Navbar } from "./components/Navbar";
import { HeroBillboard } from "./components/HeroBillboard";
import { ChannelRow } from "./components/ChannelRow";
import { ChannelCard } from "./components/ChannelCard";
import { LivePlayerModal } from "./components/LivePlayerModal";
import { ChannelDetailModal } from "./components/ChannelDetailModal";
import { EPGGuideModal } from "./components/EPGGuideModal";
import { InstallModal } from "./components/InstallModal";
import { SmartTVView } from "./components/SmartTVView";
import { TabletDashboardView } from "./components/TabletDashboardView";
import { MobileView } from "./components/MobileView";
import { DOMINICAN_CHANNELS } from "./data/channels";
import { LegalDisclaimer } from "./components/LegalDisclaimer";
import { CategoryFilter, TVChannel, DeviceFormat } from "./types";
import {
  Flame,
  Tv,
  Radio,
  Sparkles,
  Heart,
  Calendar,
  Search,
  CheckCircle,
  HelpCircle,
  Info,
} from "lucide-react";

export default function App() {
  // Favorites persistence
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("rd_tv_favorites");
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default favorites
    return ["color-vision-9", "telemicro-5", "cdn-37", "telesistema-11"];
  });

  useEffect(() => {
    try {
      localStorage.setItem("rd_tv_favorites", JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  // Active Category & Search Filter
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("todos");
  const [searchQuery, setSearchQuery] = useState("");

  // Hero Featured Channel (defaults to Color Visión Canal 9)
  const [featuredChannel, setFeaturedChannel] = useState<TVChannel>(
    DOMINICAN_CHANNELS[0]
  );

  // Modals & Player State
  const [playingChannel, setPlayingChannel] = useState<TVChannel | null>(null);
  const [detailChannel, setDetailChannel] = useState<TVChannel | null>(null);
  const [isEPGOpen, setIsEPGOpen] = useState(false);
  const [isInstallOpen, setIsInstallOpen] = useState(false);

  // View Format: "auto" | "mobile" | "tablet" | "tv"
  const [deviceFormat, setDeviceFormat] = useState<DeviceFormat>(() => {
    try {
      const saved = localStorage.getItem("rd_tv_device_format");
      if (saved && ["auto", "mobile", "tablet", "tv"].includes(saved)) {
        return saved as DeviceFormat;
      }
    } catch {
      // ignore
    }
    return "auto";
  });

  const handleSelectDeviceFormat = (format: DeviceFormat) => {
    setDeviceFormat(format);
    try {
      localStorage.setItem("rd_tv_device_format", format);
    } catch {
      // ignore
    }
  };

  // Featured channels for quick switcher on Hero
  const topFeaturedChannels = useMemo(
    () => DOMINICAN_CHANNELS.filter((c) => c.isFeatured || c.isTrending).slice(0, 5),
    []
  );

  // Toggle Favorite
  const handleToggleFavorite = (channelId: string) => {
    setFavorites((prev) =>
      prev.includes(channelId)
        ? prev.filter((id) => id !== channelId)
        : [...prev, channelId]
    );
  };

  // Filtered Channels for Search or Category Mode
  const filteredChannels = useMemo(() => {
    let result = DOMINICAN_CHANNELS;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.channelNumber.toString() === q ||
          c.city.toLowerCase().includes(q) ||
          c.currentProgram.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (activeCategory === "favoritos") {
      return result.filter((c) => favorites.includes(c.id));
    }

    if (activeCategory !== "todos") {
      return result.filter((c) => c.category === activeCategory);
    }

    return result;
  }, [searchQuery, activeCategory, favorites]);

  // Grouped Channels for the Home View
  const popularChannels = useMemo(
    () => DOMINICAN_CHANNELS.filter((c) => c.category === "populares"),
    []
  );
  const newsChannels = useMemo(
    () => DOMINICAN_CHANNELS.filter((c) => c.category === "noticias"),
    []
  );
  const cibaoChannels = useMemo(
    () => DOMINICAN_CHANNELS.filter((c) => c.category === "cibao"),
    []
  );
  const sportsChannels = useMemo(
    () => DOMINICAN_CHANNELS.filter((c) => c.category === "deportes"),
    []
  );
  const varietyChannels = useMemo(
    () => DOMINICAN_CHANNELS.filter((c) => c.category === "variedades"),
    []
  );
  const publicChannels = useMemo(
    () => DOMINICAN_CHANNELS.filter((c) => c.category === "estatal"),
    []
  );
  const favoriteChannels = useMemo(
    () => DOMINICAN_CHANNELS.filter((c) => favorites.includes(c.id)),
    [favorites]
  );

  const isBrowsingAll = activeCategory === "todos" && !searchQuery.trim();

  // Smart TV View (Pantalla Grande / 10-foot UI)
  if (deviceFormat === "tv") {
    return (
      <>
        <SmartTVView
          channels={DOMINICAN_CHANNELS}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onExitTVMode={() => handleSelectDeviceFormat("auto")}
          onOpenInstall={() => setIsInstallOpen(true)}
        />
        <InstallModal
          isOpen={isInstallOpen}
          onClose={() => setIsInstallOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f11] text-zinc-100 flex flex-col selection:bg-red-600 selection:text-white font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Netflix-style Top Sticky Navigation */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSearchQuery("");
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoritesCount={favorites.length}
        onOpenEPG={() => setIsEPGOpen(true)}
        onOpenInstall={() => setIsInstallOpen(true)}
        deviceFormat={deviceFormat}
        onSelectDeviceFormat={handleSelectDeviceFormat}
      />

      {/* Format Content Dispatcher */}
      {deviceFormat === "tablet" ? (
        <TabletDashboardView
          channels={DOMINICAN_CHANNELS}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onOpenFullPlayer={setPlayingChannel}
          onOpenDetails={setDetailChannel}
        />
      ) : deviceFormat === "mobile" ? (
        <MobileView
          channels={DOMINICAN_CHANNELS}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          onPlayChannel={setPlayingChannel}
          onOpenDetails={setDetailChannel}
          onOpenEPG={() => setIsEPGOpen(true)}
        />
      ) : (
        /* Main Streaming Area (Desktop / Cinema / Auto) */
        <main className="flex-1 pb-16">
          {/* Cinematic Hero Billboard (Only on Home view without active search) */}
          {isBrowsingAll && (
            <HeroBillboard
              channel={featuredChannel}
              featuredChannels={topFeaturedChannels}
              onSelectFeatured={setFeaturedChannel}
              onPlayChannel={setPlayingChannel}
              onOpenDetails={setDetailChannel}
              isFavorite={favorites.includes(featuredChannel.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {/* Content Section */}
          <div className={`w-full ${isBrowsingAll ? "-mt-12 sm:-mt-16 relative z-20" : "pt-24 px-4 sm:px-6 max-w-7xl mx-auto"}`}>
            {/* Active Search or Specific Category Filter View */}
            {!isBrowsingAll ? (
              <div>
                {/* Filter Header */}
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-800">
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                      {searchQuery ? (
                        <>
                          <Search className="w-5 h-5 text-red-500" />
                          <span>Resultados para: &ldquo;{searchQuery}&rdquo;</span>
                        </>
                      ) : activeCategory === "favoritos" ? (
                        <>
                          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                          <span>Mi Lista de Canales Favoritos</span>
                        </>
                      ) : (
                        <>
                          <Tv className="w-5 h-5 text-red-500" />
                          <span className="capitalize">
                            {activeCategory === "cibao"
                              ? "Canales del Cibao & Santiago"
                              : activeCategory === "deportes"
                              ? "Pelota & Deportes Dominicanos"
                              : activeCategory === "noticias"
                              ? "Noticias 24/7 de República Dominicana"
                              : `Categoría: ${activeCategory}`}
                          </span>
                        </>
                      )}
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1">
                      Se encontraron {filteredChannels.length} canales disponibles en vivo
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategory("todos");
                      setSearchQuery("");
                    }}
                    className="text-xs text-red-400 hover:text-red-300 font-semibold px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
                  >
                    Volver al Inicio
                  </button>
                </div>

                {/* Grid of Channels */}
                {filteredChannels.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                    {filteredChannels.map((channel) => (
                      <ChannelCard
                        key={channel.id}
                        channel={channel}
                        onPlay={setPlayingChannel}
                        onOpenDetails={setDetailChannel}
                        isFavorite={favorites.includes(channel.id)}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center bg-zinc-900/40 rounded-2xl border border-zinc-800">
                    <Tv className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-white">
                      No se encontraron canales dominicanos
                    </h3>
                    <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1">
                      {activeCategory === "favoritos"
                        ? "Aún no tienes canales en tu lista. Explora la programación y pulsa el botón (+) para agregarlos a tus favoritos."
                        : "Intenta con otro término de búsqueda como 'Color Visión', 'Telemicro', 'Noticias' o 'Santiago'."}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCategory("todos");
                        setSearchQuery("");
                      }}
                      className="mt-4 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Ver Todos los Canales
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Netflix-Style Home Carousel Rows */
              <div className="space-y-2">
                {/* Mi Lista Row (If user has favorites) */}
                {favoriteChannels.length > 0 && (
                  <ChannelRow
                    title="Mi Lista"
                    subtitle="Tus canales dominicanos preferidos"
                    icon={<Heart className="w-5 h-5 fill-red-500 text-red-500" />}
                    channels={favoriteChannels}
                    onPlayChannel={setPlayingChannel}
                    onOpenDetails={setDetailChannel}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                )}

                {/* Populares de República Dominicana */}
                <ChannelRow
                  title="Populares de República Dominicana"
                  subtitle="Las cadenas nacionales con mayor sintonía"
                  icon={<Flame className="w-5 h-5" />}
                  channels={popularChannels}
                  onPlayChannel={setPlayingChannel}
                  onOpenDetails={setDetailChannel}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />

                {/* Noticias 24/7 */}
                <ChannelRow
                  title="Noticias e Información 24/7"
                  subtitle="El acontecer nacional minuto a minuto"
                  icon={<Radio className="w-5 h-5" />}
                  channels={newsChannels}
                  onPlayChannel={setPlayingChannel}
                  onOpenDetails={setDetailChannel}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />

                {/* Cibao & Santiago */}
                <ChannelRow
                  title="Cibao & Santiago de los Caballeros"
                  subtitle="La señal de la Ciudad Corazón y la región norte"
                  icon={<Tv className="w-5 h-5 text-amber-500" />}
                  channels={cibaoChannels}
                  onPlayChannel={setPlayingChannel}
                  onOpenDetails={setDetailChannel}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />

                {/* Deportes & Pelota LIDOM */}
                <ChannelRow
                  title="Deportes & Pelota Invernal"
                  subtitle="Béisbol de Grandes Ligas, LIDOM y pasión deportiva"
                  icon={<Sparkles className="w-5 h-5 text-emerald-500" />}
                  channels={sportsChannels}
                  onPlayChannel={setPlayingChannel}
                  onOpenDetails={setDetailChannel}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />

                {/* Variedades & Comedia */}
                <ChannelRow
                  title="Variedades, Humor & Entretenimiento"
                  subtitle="Comedia dominicana, música y series"
                  icon={<Tv className="w-5 h-5" />}
                  channels={varietyChannels}
                  onPlayChannel={setPlayingChannel}
                  onOpenDetails={setDetailChannel}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />

                {/* Televisión Pública */}
                <ChannelRow
                  title="Televisión Pública & Cultural"
                  subtitle="Corporación Estatal de Radio y Televisión"
                  icon={<Tv className="w-5 h-5 text-blue-500" />}
                  channels={publicChannels}
                  onPlayChannel={setPlayingChannel}
                  onOpenDetails={setDetailChannel}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />
              </div>
            )}
          </div>
        </main>
      )}

      {/* Netflix-Style Dominican Footer */}
      <footer className="bg-[#0b0b0e] border-t border-zinc-800/80 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-black text-2xl text-red-600 font-['Bebas_Neue',sans-serif]">
                ELITVRD
              </span>
              <span className="text-xs text-zinc-400">
                &bull; Plataforma de Streaming de Televisión Dominicana
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-900 border border-zinc-800">
                <span>🇩🇴</span>
                <span>Transmisión Oficial República Dominicana</span>
              </span>
              <span className="hidden sm:inline">&bull;</span>
              <button
                type="button"
                onClick={() => setIsEPGOpen(true)}
                className="hover:text-white transition-colors cursor-pointer text-red-400 font-medium"
              >
                Ver Guía Completa de Canales
              </button>
              <span className="hidden sm:inline">&bull;</span>
              <button
                type="button"
                onClick={() => setIsInstallOpen(true)}
                className="hover:text-white transition-colors cursor-pointer text-amber-400 font-medium flex items-center gap-1"
              >
                <span>Descargar para USB / Instalar en TV</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-zinc-500 pt-4 border-t border-zinc-800/50">
            <div>
              <div className="font-semibold text-zinc-300 mb-1">Cadenas Principales</div>
              <ul className="space-y-1">
                <li>Color Visión (Canal 9)</li>
                <li>Telemicro (Canal 5)</li>
                <li>Telesistema (Canal 11)</li>
                <li>Teleantillas (Canal 2)</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-zinc-300 mb-1">Noticias & Opinión</div>
              <ul className="space-y-1">
                <li>CDN 37 (Noticias 24H)</li>
                <li>Noticias SIN</li>
                <li>RNN (Canal 27)</li>
                <li>Telenoticias Cavada</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-zinc-300 mb-1">Región del Cibao</div>
              <ul className="space-y-1">
                <li>Teleuniverso (Canal 29)</li>
                <li>Luna TV (Canal 53)</li>
                <li>Santiago de los Caballeros</li>
                <li>Cibao Central</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-zinc-300 mb-1">Deportes & Diáspora</div>
              <ul className="space-y-1">
                <li>Pelota Invernal LIDOM</li>
                <li>CDN Deportes</li>
                <li>Super Canal 33 (Diáspora)</li>
                <li>RTVD 4 (Canal Estatal)</li>
              </ul>
            </div>
          </div>

          {/* Legal Disclaimer & Limitation of Liability */}
          <LegalDisclaimer />

          <div className="text-center text-[11px] text-zinc-600 pt-4">
            ELITVRD Dominicana &copy; {new Date().getFullYear()} &mdash; Hecho con orgullo para todos los dominicanos en la isla y en el mundo.
          </div>
        </div>
      </footer>

      {/* Live Video Player Modal */}
      <LivePlayerModal
        channel={playingChannel}
        allChannels={DOMINICAN_CHANNELS}
        onClose={() => setPlayingChannel(null)}
        onSelectChannel={(newChan) => setPlayingChannel(newChan)}
        isFavorite={Boolean(playingChannel && favorites.includes(playingChannel.id))}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Channel Information & Guide Modal */}
      <ChannelDetailModal
        channel={detailChannel}
        onClose={() => setDetailChannel(null)}
        onPlayChannel={setPlayingChannel}
        isFavorite={Boolean(detailChannel && favorites.includes(detailChannel.id))}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Electronic Program Guide Modal (Guía TV) */}
      <EPGGuideModal
        isOpen={isEPGOpen}
        onClose={() => setIsEPGOpen(false)}
        channels={DOMINICAN_CHANNELS}
        onPlayChannel={setPlayingChannel}
      />

      {/* Smart TV & Android Installation Modal */}
      <InstallModal
        isOpen={isInstallOpen}
        onClose={() => setIsInstallOpen(false)}
      />
    </div>
  );
}
