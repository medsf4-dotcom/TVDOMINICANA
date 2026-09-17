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
  AlertCircle,
} from "lucide-react";
import { usePWAInstall } from "../hooks/usePWAInstall";

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"pwa" | "usb" | "downloader" | "dev">("pwa");
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
            onClick={() => setActiveTab("pwa")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer shrink-0 ${
              activeTab === "pwa"
                ? "bg-red-600 text-white shadow-md shadow-red-900/30"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Instalar App con Reproductor (PWA)</span>
          </button>

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
            <span>Memoria USB (Lista M3U para VLC / TV)</span>
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
            <span>Publicar en Google Play Store (TV y Android)</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-sm text-zinc-300">
          {/* TAB 1: MEMORIA USB (M3U) */}
          {activeTab === "usb" && (
            <div className="space-y-6">
              {/* Important clarification banner */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <div className="font-bold text-amber-300 text-sm">
                    ¿Por qué tu PC te pide un reproductor al abrir este archivo?
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    Este archivo es una <strong>lista de canales (.m3u)</strong>, no es un instalador o programa ejecutable. Por esa razón, Windows o Mac te preguntan con qué programa abrirlo si no tienes instalado un reproductor como <strong>VLC Media Player</strong>.
                  </p>
                  <p className="text-emerald-300 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/30 font-medium">
                    ✅ <strong>¿Quieres que la aplicación venga con su propio reproductor integrado sin instalar nada más?</strong><br />
                    Haz clic aquí: <button type="button" onClick={() => setActiveTab("pwa")} className="underline font-bold text-white hover:text-emerald-200 cursor-pointer">Ir a &ldquo;Instalar App con Reproductor (PWA)&rdquo;</button>. Esa versión funciona tanto en PC como en Smart TV y celular con todo incluido.
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
              {/* Direct Reality Check for Smart TVs */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <div className="font-bold text-amber-300 text-sm">
                    ¿Por qué en tu Smart TV NO aparece el botón de instalar PWA?
                  </div>
                  <p className="text-zinc-300 leading-relaxed">
                    Los navegadores integrados de la mayoría de Smart TVs (como los de <strong>Samsung Tizen, LG webOS o navegadores básicos de TV Box</strong>) <strong>no admiten instalación de PWA</strong>. Por eso es normal que en la pantalla de tu TV no aparezca ninguna opción de &ldquo;Instalar&rdquo;.
                  </p>
                  <p className="text-zinc-300 leading-relaxed font-medium">
                    No te preocupes: en televisores hay <strong>2 formas sencillas y 100% garantizadas</strong> para ver ELITVRD:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800">
                      <div className="text-emerald-400 font-bold mb-1">Opción A (La más fácil): Guardar en Favoritos del TV</div>
                      <p className="text-zinc-400 text-[11px]">
                        Abre este enlace en el navegador de tu TV y simplemente pulsa en la estrella o <strong>&ldquo;Añadir a Marcadores / Favoritos&rdquo;</strong>. Se abrirá en pantalla completa cada vez que entres con un solo clic.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-zinc-900/90 border border-zinc-800">
                      <div className="text-red-400 font-bold mb-1">Opción B: Lista M3U con VLC / IPTV (Recomendada)</div>
                      <p className="text-zinc-400 text-[11px]">
                        Instala <strong>VLC</strong> o <strong>TiviMate</strong> gratis desde la tienda de tu TV, copia la lista por USB o pon el enlace, y tendrás todos los canales organizados en la pantalla principal de tu TV.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">
                        Instalación Directa como Aplicación (PWA Standalone)
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Reproductor Incluido
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 max-w-lg">
                      Instala ELITVRD como una app independiente en tu computadora, teléfono Android o Smart TV. Se abre directamente en tu escritorio o pantalla de inicio sin depender de otros programas.
                    </p>
                  </div>

                  {isInstalled ? (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-bold shrink-0">
                      <CheckCircle className="w-4 h-4" />
                      <span>¡App ya instalada en este equipo!</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={async () => {
                        const success = await install();
                        if (!success && !isInstallable) {
                          alert(
                            "Para instalarla en tu PC:\n\n1. Mira arriba en la barra de direcciones de Google Chrome o Edge (a la derecha de la URL).\n2. Haz clic en el ícono de pantalla con una flecha hacia abajo ('Instalar ELITVRD').\n3. Haz clic en 'Instalar' y listo, aparecerá el ícono en tu escritorio."
                          );
                        }
                      }}
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-900/40 transition-all cursor-pointer shrink-0 animate-pulse hover:animate-none"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isInstallable ? "¡Hacer clic para Instalar en PC ahora!" : "Instalar en esta PC / Equipo"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Guía según dispositivo: PC y Smart TV / Celular */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* En PC (Windows / Mac / Chrome / Edge) */}
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2.5 text-xs">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Tv className="w-4 h-4 text-red-500" />
                    En tu Computadora (Windows / Mac)
                  </h4>
                  <p className="text-zinc-400 text-[11px]">
                    Si estás viendo esto en tu PC:
                  </p>
                  <ol className="space-y-2 list-decimal list-inside text-zinc-300">
                    <li>
                      Mira la <strong className="text-white">barra de direcciones</strong> arriba en tu navegador (Chrome o Edge).
                    </li>
                    <li>
                      Verás un ícono pequeño de <strong className="text-white">computadora con flecha hacia abajo</strong> o <strong className="text-white">&ldquo;Instalar ELITVRD&rdquo;</strong>.
                    </li>
                    <li>
                      Haz clic en él y pulsa <strong className="text-white">&ldquo;Instalar&rdquo;</strong>. Se creará un acceso directo en tu Escritorio y menú de inicio que abrirá la app con su reproductor propio.
                    </li>
                  </ol>
                </div>

                {/* En Smart TV y Teléfono */}
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2.5 text-xs">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-red-500" />
                    En Smart TV o Teléfono
                  </h4>
                  <p className="text-zinc-400 text-[11px]">
                    Si estás en la tele o en tu celular:
                  </p>
                  <ol className="space-y-2 list-decimal list-inside text-zinc-300">
                    <li>
                      Abre el navegador (<strong className="text-white">Chrome</strong>, <strong className="text-white">Amazon Silk</strong>, <strong className="text-white">TV Bro</strong>).
                    </li>
                    <li>
                      Toca el menú de los <strong className="text-white">3 puntos</strong> arriba a la derecha.
                    </li>
                    <li>
                      Elige <strong className="text-white">&ldquo;Instalar aplicación&rdquo;</strong> o <strong className="text-white">&ldquo;Añadir a pantalla principal&rdquo;</strong>.
                    </li>
                  </ol>
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

          {/* TAB 4: GOOGLE PLAY STORE (ANDROID Y ANDROID TV) */}
          {activeTab === "dev" && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    Cómo publicar ELITVRD en Google Play Store (Para Celulares y Smart TV)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Google Play Oficial
                  </span>
                </div>
                <p className="text-zinc-400 mt-1.5 leading-relaxed">
                  Para que cualquier usuario pueda buscar <strong>&ldquo;ELITVRD&rdquo;</strong> en la Play Store de su teléfono o de su Smart TV y presionar <strong>Instalar</strong>, se debe subir el paquete de la aplicación a Google Play Console.
                </p>
              </div>

              {/* Steps 1 to 4 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-1.5">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-black">1</span>
                    <span>Cuenta en Google Play Console</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-[11px]">
                    Crea tu cuenta de desarrollador en <strong className="text-zinc-200">play.google.com/console</strong>. Google solicita un pago único de registro de $25 USD.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-1.5">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-black">2</span>
                    <span>Generar el paquete .AAB oficial</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-[11px]">
                    Google ya no acepta archivos .APK directos para tiendas; exige el formato <strong className="text-zinc-200">Android App Bundle (.aab)</strong>, el cual empaqueta tanto la versión para teléfonos como para Smart TV.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-1.5">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-black">3</span>
                    <span>Activar la casilla &ldquo;Android TV&rdquo;</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-[11px]">
                    En la consola de Google Play, ve a <strong className="text-zinc-200">Configuración avanzada &gt; Factores de forma</strong> y activa la opción <strong className="text-emerald-400">Android TV</strong> para que aparezca en televisores.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-1.5">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-black">4</span>
                    <span>Revisión y Publicación</span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-[11px]">
                    Subes el archivo, agregas las capturas de pantalla y en 24-48 horas Google aprueba la app para que cualquiera la descargue libremente.
                  </p>
                </div>
              </div>

              {/* Tool Commands */}
              <div className="space-y-2">
                <div className="font-bold text-white">Opción recomendada por Google: Bubblewrap (TWA):</div>
                <div className="p-3 rounded-xl bg-black/80 font-mono text-zinc-300 text-[11px] space-y-1.5 overflow-x-auto border border-zinc-800">
                  <div className="text-zinc-500"># 1. Instalar la herramienta oficial de Google</div>
                  <div className="text-emerald-400">npm install -g @bubblewrap/cli</div>
                  <div className="text-zinc-500 mt-2"># 2. Inicializar con el manifiesto de ELITVRD</div>
                  <div className="text-emerald-400">bubblewrap init --manifest=https://ais-pre-2h5cbz7mjqznoajju7n6mn-697794001347.us-east1.run.app/manifest.json</div>
                  <div className="text-zinc-500 mt-2"># 3. Compilar el archivo listo para Google Play</div>
                  <div className="text-emerald-400">bubblewrap build</div>
                </div>
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
