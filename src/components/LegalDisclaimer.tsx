import React, { useState } from "react";
import { ShieldAlert, ChevronDown, ChevronUp, Scale, Info } from "lucide-react";

export const LegalDisclaimer: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section aria-label="Aviso Legal y Descargo de Responsabilidad" className="w-full mt-8 pt-6 border-t border-zinc-800/80">
      <div className="rounded-2xl bg-zinc-950/80 border border-zinc-800/90 p-4 sm:p-5 text-zinc-400">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0 mt-0.5 sm:mt-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-black text-zinc-200 tracking-wide uppercase">
                  Aviso Legal &amp; Descargo de Responsabilidad (Disclaimer)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                  Transmisión Abierta
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                ELITVRD es un reproductor e indexador de enlaces públicos de señal abierta por internet. No aloja, almacena, retransmite ni cobra por contenidos protegidos.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold border border-zinc-700/80 transition-colors cursor-pointer shrink-0"
          >
            <span>{isExpanded ? "Ocultar términos" : "Leer exención completa"}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Short Summary always visible */}
        <div className="mt-3 pt-3 border-t border-zinc-900/80 text-[11px] sm:text-xs text-zinc-400 leading-relaxed">
          <p>
            <strong>Exención de responsabilidad:</strong> Esta plataforma y sus desarrolladores quedan totalmente eximidos de cualquier responsabilidad legal, civil, penal o comercial derivada del uso, contenido, caídas de señal o modificaciones de las transmisiones emitidas por los canales de televisión. Cada logotipo, marca comercial y señal en directo es propiedad exclusiva de su respectiva cadena televisiva.
          </p>
        </div>

        {/* Collapsible detailed legal clauses */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-zinc-800/80 space-y-3 text-[11px] sm:text-xs text-zinc-400 leading-relaxed animate-fade-in">
            <div className="p-3 rounded-xl bg-black/50 border border-zinc-800/80 space-y-2">
              <div className="font-bold text-zinc-200 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>1. Naturaleza Técnica de la Plataforma</span>
              </div>
              <p>
                ELITVRD funciona estrictamente como un cliente web y reproductor multimedia de uso personal. Esta aplicación no posee servidores de transmisión, no realiza retransmisiones (re-streaming), no altera la señal de origen y no almacena copias de audio, video o transmisiones en vivo. Todos los flujos de video provienen de los enlaces oficiales de señal abierta (HLS / m3u8 / embeds) que las propias cadenas emisoras ponen a disposición pública en la web de forma gratuita.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-black/50 border border-zinc-800/80 space-y-2">
              <div className="font-bold text-zinc-200 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span>2. Propiedad Intelectual y Derechos de Autor (Copyright)</span>
              </div>
              <p>
                Todos los derechos de autor, marcas registradas, nombres de canales, logotipos y contenidos audiovisuales pertenecen de forma exclusiva y soberana a sus respectivos propietarios legales y concesionarios (como Color Visión Canal 9, Telemicro Canal 5, Telesistema Canal 11, CDN Canal 37, Teleantillas Canal 2, etc.). La inclusión de sus identificadores visuales responde únicamente a fines informativos y de identificación para el espectador final.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-black/50 border border-zinc-800/80 space-y-2">
              <div className="font-bold text-zinc-200 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>3. Exoneración Total de Responsabilidad del Creador / Administrador</span>
              </div>
              <p>
                El usuario acepta que el uso de esta aplicación es bajo su exclusiva y propia responsabilidad. El creador, titular, desarrollador y cualquier persona física o jurídica vinculada con la creación técnica de este software queda <strong>100% EXENTO Y LIBERADO DE CUALQUIER RECLAMO, DEMANDA, DAÑO DIRECTO O INDIRECTO, SANCIÓN O RESPONSABILIDAD LEGAL</strong> ante tribunales o autoridades competentes relativo a:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-zinc-400">
                <li>La disponibilidad, calidad, censura o interrupción repentina de cualquiera de las señales.</li>
                <li>Los contenidos, noticias, comerciales, comentarios u opiniones vertidas durante las transmisiones en vivo de los canales.</li>
                <li>El uso indebido que terceros o usuarios den a los enlaces o listas de reproducción.</li>
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-black/50 border border-zinc-800/80 space-y-1">
              <div className="font-bold text-zinc-200">4. Retiro de Contenido (Aviso DMCA / Contacto)</div>
              <p>
                Si usted es el titular de los derechos de autor de alguna de las señales o marcas y desea que el enlace público sea retirado inmediatamente de este índice, puede solicitar su remoción formal y será procesada a la brevedad conforme a los estándares de notificación y retirada.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
