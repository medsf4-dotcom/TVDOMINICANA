import React, { useState } from "react";
import {
  X,
  Tv,
  Download,
  Usb,
  Smartphone,
  CheckCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Terminal,
  FolderOpen,
  ArrowRight,
  Sparkles,
  Info,
  Check,
} from "lucide-react";
import { usePWAInstall } from "../hooks/usePWAInstall";

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"usb" | "pwa" | "downloader" | "dev">("usb");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const { isInstallable, isInstalled, install, isIOS } = usePWAInstall();

  if (!isOpen) return null;

  const currentHost = typeof window !== "undefined" ? window.location.origin : "";
  const playlistUrl = `${currentHost}/api/playlist.m3u`;

  const handleCopyPlaylistUrl = () => {
    navigator.clipboard.writeText(playlistUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in font-['Plus_Jakarta_Sans',sans-serif]">
      <div
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-[#141419] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800/90 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shadow-inner">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight">
                  Instalador para Smart TV y Android
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" /> Uso Personal Libre
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Lleva todos los canales dominicanos a tu televisor por USB, App directa o M3U
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 pt-3 pb-1 border-b border-zinc-800/80 bg-zinc-900/30 overflow-x-auto scrollbar-none text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("usb")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
              activeTab === "usb"
                ? "bg-red-600 text-white shadow-md shadow-red-900/30"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
            }`}
          >
            <Usb className="w-4 h-4" />
            <span>Memoria USB (Lista M3U)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pwa")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
              activeTab === "pwa"
                ? "bg-red-600 text-white shadow-md shadow-red-900/30"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Instalar App Web (PWA)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("downloader")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
              activeTab === "downloader"
                ? "bg-red-600 text-white shadow-md shadow-red-900/30"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
            }`}
          >
            <Download className="w-4 h-4" />
            <span>TV Box / Fire TV / Downloader</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("dev")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
              activeTab === "dev"
                ? "bg-red-600 text-white shadow-md shadow-red-900/30"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Compilar APK (Capacitor)</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-sm text-zinc-300">
          {/* TAB 1: MEMORIA USB (M3U) */}
          {activeTab === "usb" && (
            <div className="space-y-6">
              {/* Important clarification banner */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs">
                <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-amber-300">
                    ¿Por qué este archivo pesa ~10 KB y no se instala solo?
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    Este archivo tiene extensión <strong className="text-white">.m3u</strong> (es una <em>lista de reproducción de canales</em>, no un ejecutable <em>.apk</em>). Por eso no se &ldquo;instala&rdquo; como una app: se <strong>abre directamente dentro de reproductores de TV</strong> como <strong className="text-white">VLC for Android</strong>, <strong className="text-white">TiviMate</strong> o <strong className="text-white">Kodi</strong>.
                  </p>
                  <p className="text-amber-200/90 font-medium">
                    👉 Si lo que quieres es tener la <strong>aplicación completa con su propio icono en la pantalla de tu TV o celular</strong>, ve a la pestaña <button type="button" onClick={() => setActiveTab("pwa")} className="underline font-bold text-white hover:text-amber-300 cursor-pointer">Instalar App Web (PWA)</button>.
                  </p>
                </div>
              </div>

              {/* Highlight Action Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-red-950/40 via-zinc-900 to-zinc-900 border border-red-500/30 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/60">
                      El método más universal y compatible
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white mt-1">
                      Descargar archivo .M3U para memoria USB
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                      Compatible con el 100% de Smart TVs (Android TV, Google TV, Samsung Tizen, LG webOS, Fire TV y TV Boxes).
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                    <a
                      href="/api/playlist.m3u?download=1"
                      download="rd_tv_canales_dominicanos.m3u"
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-900/40 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Descargar M3U para USB</span>
                    </a>
                  </div>
                </div>

                {/* Secondary Option: Direct Streams */}
                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-zinc-400">¿Prefieres señales directas sin intermediario?</span>
                  <a
                    href="/api/playlist.m3u?download=1&mode=direct"
                    download="rd_tv_canales_directos.m3u"
                    className="text-red-400 hover:text-red-300 font-semibold underline underline-offset-2"
                  >
                    Descargar M3U con Enlaces Directos
                  </a>
                </div>
              </div>

              {/* URL Directa para pegar en apps de TV */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>Enlace en vivo de la lista (URL M3U):</span>
                  </div>
                  <code className="text-xs text-zinc-400 break-all select-all font-mono">
                    {playlistUrl}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPlaylistUrl}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold shrink-0 cursor-pointer transition-colors"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Copiar Enlace</span>
                    </>
                  )}
                </button>
              </div>

              {/* 3 Steps Guide for USB */}
              <div>
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Usb className="w-4 h-4 text-red-500" />
                  Instrucciones paso a paso para reproducir desde la USB:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col">
                    <span className="w-6 h-6 rounded-full bg-red-600/20 text-red-500 font-black flex items-center justify-center mb-2 border border-red-500/30">
                      1
                    </span>
                    <div className="font-bold text-white mb-1">Copia el archivo a la USB</div>
                    <p className="text-zinc-400">
                      Conecta una memoria USB común a tu computadora y copia en ella el archivo{" "}
                      <strong className="text-zinc-200">rd_tv_canales_dominicanos.m3u</strong>.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col">
                    <span className="w-6 h-6 rounded-full bg-red-600/20 text-red-500 font-black flex items-center justify-center mb-2 border border-red-500/30">
                      2
                    </span>
                    <div className="font-bold text-white mb-1">Conecta la USB al Televisor</div>
                    <p className="text-zinc-400">
                      Inserta la memoria USB en cualquiera de los puertos USB de tu Smart TV o TV Box.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex flex-col">
                    <span className="w-6 h-6 rounded-full bg-red-600/20 text-red-500 font-black flex items-center justify-center mb-2 border border-red-500/30">
                      3
                    </span>
                    <div className="font-bold text-white mb-1">Abre con tu App favorita</div>
                    <p className="text-zinc-400">
                      Abre en el TV apps gratuitas como <strong className="text-zinc-200">VLC</strong>,{" "}
                      <strong className="text-zinc-200">TiviMate</strong>, <strong className="text-zinc-200">Kodi</strong> o{" "}
                      <strong className="text-zinc-200">Smart IPTV</strong>, selecciona &ldquo;Abrir archivo de lista&rdquo; y sintoniza de inmediato.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INSTALAR APP PWA */}
          {activeTab === "pwa" && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">
                        Instalación Directa como Aplicación (PWA Standalone)
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        192x192 &amp; 512x512 PNG OK
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 max-w-lg">
                      Instala RD TV como una app independiente en tu teléfono Android, tablet, Smart TV o computadora. Se ejecuta en pantalla completa sin barra de direcciones ni bordes.
                    </p>
                  </div>

                  {isInstalled ? (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-bold shrink-0">
                      <CheckCircle className="w-4 h-4" />
                      <span>App Instalada (Modo Standalone)</span>
                    </div>
                  ) : isInstallable ? (
                    <button
                      type="button"
                      onClick={install}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-900/40 transition-all cursor-pointer shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      <span>Instalar en este dispositivo</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={install}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold shrink-0 cursor-pointer"
                    >
                      <Smartphone className="w-4 h-4 text-red-500" />
                      <span>Ver pasos de instalación</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Guía para Navegadores de Smart TV y Móvil */}
              <div>
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Tv className="w-4 h-4 text-red-500" />
                  ¿Cómo instalarla desde el navegador de tu Smart TV o Teléfono?
                </h4>
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3 text-xs">
                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-red-600/20 text-red-500 font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <p className="text-zinc-300">
                      En tu Smart TV o teléfono, abre el navegador web (<strong className="text-white">Google Chrome</strong>,{" "}
                      <strong className="text-white">TV Bro</strong>,{" "}
                      <strong className="text-white">Amazon Silk</strong> o el navegador del TV).
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-red-600/20 text-red-500 font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <p className="text-zinc-300">
                      Toca o haz clic en el menú del navegador (los <strong className="text-white">tres puntos verticales</strong> arriba a la derecha).
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-red-600/20 text-red-500 font-bold flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <p className="text-zinc-300">
                      Selecciona <strong className="text-white">&ldquo;Instalar aplicación&rdquo;</strong> o{" "}
                      <strong className="text-white">&ldquo;Añadir a la pantalla principal&rdquo;</strong>.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-red-600/20 text-red-500 font-bold flex items-center justify-center shrink-0 mt-0.5">
                      4
                    </span>
                    <p className="text-zinc-300">
                      ¡Listo! La app se integrará a tu pantalla de inicio con su icono oficial en alta resolución y se abrirá en modo <strong className="text-red-400">standalone</strong> (pantalla completa sin marcos de navegador).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DOWNLOADER EN SMART TV */}
          {activeTab === "downloader" && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-amber-500" />
                  Instalación en Android TV y Fire TV Stick con &ldquo;Downloader&rdquo;
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  La app gratuita <strong className="text-zinc-200">Downloader by AFTVnews</strong> (ícono naranja disponible en Google Play Store de Android TV y en la tienda de Amazon) permite descargar archivos directamente al televisor sin necesidad de una computadora o USB.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center text-[10px]">
                      A
                    </span>
                    <span>Activar Orígenes Desconocidos</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-zinc-400">
                    <li>En tu TV, ve a <strong className="text-zinc-300">Ajustes &gt; Seguridad y Restricciones</strong>.</li>
                    <li>Busca <strong className="text-zinc-300">Fuentes desconocidas</strong> o <strong className="text-zinc-300">Instalar apps desconocidas</strong>.</li>
                    <li>Activa la casilla para la app <strong className="text-zinc-300">Downloader</strong> o tu explorador de archivos.</li>
                  </ol>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 flex items-center justify-center text-[10px]">
                      B
                    </span>
                    <span>Descargar la Lista o APK</span>
                  </div>
                  <p className="text-zinc-400">
                    Abre <strong className="text-zinc-300">Downloader</strong>, en el cuadro de texto escribe la dirección de la lista:
                  </p>
                  <code className="block p-2 rounded bg-black/60 text-red-400 font-mono text-[11px] break-all select-all">
                    {playlistUrl}
                  </code>
                  <p className="text-zinc-500 text-[11px]">
                    El televisor descargará la lista en segundos para sintonizarla con cualquier reproductor.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COMPILAR APK CON CAPACITOR */}
          {activeTab === "dev" && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  Archivos de Proyecto Android TV Preconfigurados
                </h3>
                <p className="text-zinc-400 mt-1">
                  Hemos generado la configuración oficial de <strong className="text-zinc-200">Capacitor</strong> (`capacitor.config.json`) y la plantilla de <strong className="text-zinc-200">AndroidManifest.xml</strong> con soporte completo de pantalla horizontal y Leanback para control remoto de TV.
                </p>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-white">Comandos para generar tu archivo APK en Android Studio:</div>
                <div className="p-3 rounded-xl bg-black/80 font-mono text-zinc-300 text-[11px] space-y-1.5 overflow-x-auto border border-zinc-800">
                  <div className="text-zinc-500"># 1. Instalar dependencias nativas de Capacitor</div>
                  <div className="text-emerald-400">npm install @capacitor/core @capacitor/android</div>
                  <div className="text-zinc-500 mt-2"># 2. Compilar la aplicación web</div>
                  <div className="text-emerald-400">npm run build</div>
                  <div className="text-zinc-500 mt-2"># 3. Crear el proyecto Android nativo</div>
                  <div className="text-emerald-400">npx cap add android</div>
                  <div className="text-emerald-400">npx cap sync</div>
                  <div className="text-zinc-500 mt-2"># 4. Abrir en Android Studio para generar el archivo .APK</div>
                  <div className="text-emerald-400">npx cap open android</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-zinc-400 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  En Android Studio seleccionas <strong className="text-zinc-300">Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong> y obtendrás el archivo instalable para copiar a tu USB.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between text-xs">
          <div className="text-zinc-500 flex items-center gap-1.5">
            <span className="text-sm">🇩🇴</span>
            <span>Canales de señal abierta de la República Dominicana</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
