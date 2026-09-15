export interface ProgramItem {
  id: string;
  title: string;
  time: string; // e.g. "12:00 PM - 02:00 PM"
  description: string;
  host?: string;
  isLiveNow?: boolean;
}

export interface TVChannel {
  id: string;
  name: string;
  channelNumber: number;
  slug: string;
  category: "populares" | "noticias" | "variedades" | "cibao" | "deportes" | "estatal";
  categoryLabel: string;
  slogan: string;
  description: string;
  city: string;
  logo: string;
  bannerImage: string;
  streamType: "hls" | "embed";
  hlsUrl?: string;
  backupHlsUrl?: string;
  embedUrl?: string;
  currentProgram: string;
  currentProgramDesc: string;
  currentProgramHost?: string;
  nextProgram: string;
  schedule: ProgramItem[];
  resolution: string; // "1080p Full HD" | "720p HD"
  isTrending?: boolean;
  isFeatured?: boolean;
  tags: string[];
}

export type CategoryFilter = "todos" | "populares" | "noticias" | "variedades" | "cibao" | "deportes" | "estatal" | "favoritos";

export type DeviceFormat = "auto" | "mobile" | "tablet" | "tv";
