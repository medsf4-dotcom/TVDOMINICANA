process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const currentDir = typeof __dirname !== "undefined" ? __dirname : process.cwd();

const app = express();
// In Google Cloud Run and production containers, PORT is passed dynamically via process.env.PORT
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Enable CORS for all API endpoints
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Range, Origin, Accept, Content-Type, User-Agent, Referer"
  );
  res.header(
    "Access-Control-Expose-Headers",
    "Content-Length, Content-Range, Accept-Ranges, Content-Type"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// API health endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "RD TV - Canales Dominicanos",
    time: new Date().toISOString(),
  });
});

// Dominican Channels Definition for M3U playlist export (USB / Smart TV IPTV)
interface M3UChannel {
  name: string;
  tvgId: string;
  group: string;
  logo: string;
  stream: string;
  referer?: string;
}

const M3U_CHANNELS: M3UChannel[] = [
  {
    name: "Telemicro (Canal 5)",
    tvgId: "telemicro",
    group: "Nacionales Populares",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Telemicro_logo.svg/320px-Telemicro_logo.svg.png",
    stream: "https://live2.telemicro.com.do/live/55/playlist.m3u8",
    referer: "https://telemicro.com.do/players/5tv/index_pc.php",
  },
  {
    name: "Color Visión (Canal 9)",
    tvgId: "colorvision",
    group: "Nacionales Populares",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Color_Visi%C3%B3n_logo.png/320px-Color_Visi%C3%B3n_logo.png",
    stream: "https://hls.tvabierta.net/hls/009.m3u8",
  },
  {
    name: "CDN 37 (Noticias 24H)",
    tvgId: "cdn37",
    group: "Noticias",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/CDN_37_logo.png/320px-CDN_37_logo.png",
    stream: "https://hls.tvabierta.net/hls/037.m3u8",
  },
  {
    name: "Telesistema (Canal 11)",
    tvgId: "telesistema",
    group: "Nacionales Populares",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Telesistema_logo.png/320px-Telesistema_logo.png",
    stream: "https://hls.tvabierta.net/hls/011.m3u8",
  },
  {
    name: "Teleantillas (Canal 2)",
    tvgId: "teleantillas",
    group: "Variedades & Series",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Teleantillas_logo.png/320px-Teleantillas_logo.png",
    stream: "https://cdn4.wind.do/streams/teleantillas/teleantillas_720.m3u8",
  },
  {
    name: "Telecentro (Canal 13)",
    tvgId: "telecentro",
    group: "Variedades & Pelota",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Telecentro_logo.png/320px-Telecentro_logo.png",
    stream: "https://live2.telemicro.com.do/live/telecentrocast_1080p/playlist.m3u8",
    referer: "https://telemicro.com.do/players/13tv/index_pc.php",
  },
  {
    name: "Digital 15",
    tvgId: "digital15",
    group: "Comedia & Deportes",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Digital_15_logo.png/320px-Digital_15_logo.png",
    stream: "https://live2.telemicro.com.do/live/digital15cast_1080p/playlist.m3u8",
    referer: "https://telemicro.com.do/players/15tv/index_pc.php",
  },
  {
    name: "CDN Deportes (LIDOM / Pelota)",
    tvgId: "cdndeportes",
    group: "Deportes",
    logo: "https://cdn.tvabierta.net/logos/036.png",
    stream: "https://hls.tvabierta.net/hls/036.m3u8",
  },
  {
    name: "Super Canal 33 (Diáspora)",
    tvgId: "supercanal33",
    group: "Variedades & Diáspora",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Super_Canal_logo.png/320px-Super_Canal_logo.png",
    stream: "https://cnn.hostlagarto.com/supercanalhd/tracks-v1a1/mono.m3u8",
  },
  {
    name: "Teleuniverso (Canal 29 Santiago)",
    tvgId: "teleuniverso",
    group: "Cibao & Santiago",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Teleuniverso_logo.png/320px-Teleuniverso_logo.png",
    stream: "https://cdn4.wind.do/streams/teleuniverso/teleuniverso_720.m3u8",
  },
  {
    name: "Luna TV (Canal 53 Santiago)",
    tvgId: "lunatv",
    group: "Cibao & Santiago",
    logo: "https://cdn.tvabierta.net/logos/053.png",
    stream: "https://stream.lunatv.do:1936/lunatv/live/playlist.m3u8",
  },
  {
    name: "Coral 39 (Cultura & Telenovelas)",
    tvgId: "coral39",
    group: "Cultura & Cine",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Coral_39_logo.png/320px-Coral_39_logo.png",
    stream: "https://cdn4.wind.do/streams/coral/coral_720.m3u8",
  },
  {
    name: "Canal 4 RTVD (Estatal Oficial)",
    tvgId: "rtvd4",
    group: "Canal Estatal",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/RTVD_4_logo.png/320px-RTVD_4_logo.png",
    stream: "https://cdn.protvradiostream.com/rtvd/ngrp:rtvd_all/playlist.m3u8",
  },
  {
    name: "Quisqueya 17 RTVD (Cultural)",
    tvgId: "rtvd17",
    group: "Canal Estatal",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/RTVD_4_logo.png/320px-RTVD_4_logo.png",
    stream: "https://cdn.protvradiostream.com/rtvd17/ngrp:rtvd17_all/playlist.m3u8",
  },
  {
    name: "La Tora TV (Canal 69)",
    tvgId: "latoratv",
    group: "Opinión & Debate",
    logo: "https://latoratv.com/wp-content/uploads/2021/08/logo-tora.png",
    stream: "https://streaming.latoratv.com/live/latoratv.m3u8",
  },
];

// Endpoint to generate M3U IPTV Playlist file for Smart TVs / USB media players
app.get(["/api/playlist.m3u", "/api/canales.m3u"], (req, res) => {
  const host = req.headers.host || "localhost:3000";
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const baseUrl = `${protocol}://${host}`;
  const isDirect = req.query.mode === "direct";
  const forceDownload = req.query.download === "true" || req.query.download === "1";

  const lines = [
    `#EXTM3U x-tvg-url="https://epg.dominicana.tv/epg.xml" name="RD TV Dominicana"`,
  ];

  for (const ch of M3U_CHANNELS) {
    lines.push(
      `#EXTINF:-1 tvg-id="${ch.tvgId}" tvg-name="${ch.name}" tvg-logo="${ch.logo}" group-title="${ch.group}",${ch.name}`
    );

    if (isDirect) {
      lines.push(ch.stream);
    } else {
      const refParam = ch.referer ? `&referer=${encodeURIComponent(ch.referer)}` : "";
      lines.push(`${baseUrl}/api/hls-proxy?url=${encodeURIComponent(ch.stream)}${refParam}`);
    }
  }

  const content = lines.join("\n");

  res.setHeader("Content-Type", "application/x-mpegurl; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (forceDownload) {
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="rd_tv_canales_dominicanos.m3u"'
    );
  }

  res.send(content);
});

// Robust HLS & IPTV Proxy for Dominican TV Streams
app.all("/api/hls-proxy", async (req, res) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  const targetUrl = req.query.url as string;
  const customReferer = req.query.referer as string | undefined;

  if (!targetUrl) {
    return res.status(400).send("Missing url parameter");
  }

  try {
    const headers: Record<string, string> = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    };

    if (customReferer) {
      headers["Referer"] = customReferer;
    } else {
      try {
        const parsed = new URL(targetUrl);
        headers["Referer"] = `${parsed.protocol}//${parsed.host}/`;
        headers["Origin"] = `${parsed.protocol}//${parsed.host}`;
      } catch {
        // Ignore URL parse error
      }
    }

    // Forward range header for video streaming
    if (req.headers.range) {
      headers["Range"] = req.headers.range;
    }

    const response = await fetch(targetUrl, {
      method: req.method === "HEAD" ? "HEAD" : "GET",
      headers,
      signal: AbortSignal.timeout(14000),
    });

    // Set CORS headers immediately
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    res.setHeader(
      "Access-Control-Expose-Headers",
      "Content-Length, Content-Range, Accept-Ranges"
    );

    if (!response.ok && response.status !== 206) {
      return res
        .status(response.status)
        .send(`Upstream error: ${response.statusText} (${response.status})`);
    }

    // Forward relevant streaming headers
    res.status(response.status);

    const contentType = response.headers.get("content-type") || "";
    const contentRange = response.headers.get("content-range");
    if (contentRange) res.setHeader("Content-Range", contentRange);

    const acceptRanges = response.headers.get("accept-ranges");
    if (acceptRanges) res.setHeader("Accept-Ranges", acceptRanges);

    // If client requested HEAD, return headers only
    if (req.method === "HEAD") {
      res.setHeader("Content-Type", contentType || "video/mp2t");
      return res.end();
    }

    // Check if it's an M3U8 playlist
    if (
      targetUrl.includes(".m3u8") ||
      contentType.includes("mpegurl") ||
      contentType.includes("application/x-mpegurl") ||
      contentType.includes("text/plain")
    ) {
      const text = await response.text();

      // If it has m3u8 headers, rewrite relative and absolute paths
      if (text.includes("#EXTM3U") || text.includes("#EXTINF")) {
        const baseUrl = new URL(targetUrl);
        const lines = text.split("\n");
        const rewrittenLines = lines.map((line) => {
          const trimmed = line.trim();
          if (!trimmed) return line;

          if (trimmed.startsWith("#")) {
            // Rewrite URI tags such as #EXT-X-MAP:URI="init.mp4" or #EXT-X-KEY:URI="key"
            if (trimmed.includes('URI="')) {
              return line.replace(/URI="([^"]+)"/g, (_m, uri) => {
                try {
                  const resolved = new URL(uri, baseUrl).toString();
                  const refParam = customReferer
                    ? `&referer=${encodeURIComponent(customReferer)}`
                    : "";
                  return `URI="/api/hls-proxy?url=${encodeURIComponent(
                    resolved
                  )}${refParam}"`;
                } catch {
                  return `URI="${uri}"`;
                }
              });
            }
            return line;
          }

          // Resolve relative or absolute chunk or sub-playlist URL
          let resolvedUrl = trimmed;
          try {
            resolvedUrl = new URL(trimmed, baseUrl).toString();
          } catch {
            // Keep as is if invalid
          }

          const refererParam = customReferer
            ? `&referer=${encodeURIComponent(customReferer)}`
            : "";
          return `/api/hls-proxy?url=${encodeURIComponent(
            resolvedUrl
          )}${refererParam}`;
        });

        res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        return res.send(rewrittenLines.join("\n"));
      }
    }

    // Binary video stream chunk (.ts, audio, fmp4)
    res.setHeader("Content-Type", contentType || "video/mp2t");
    res.setHeader("Cache-Control", "public, max-age=3600");

    if (response.body) {
      const arrayBuffer = await response.arrayBuffer();
      res.setHeader("Content-Length", arrayBuffer.byteLength.toString());
      return res.send(Buffer.from(arrayBuffer));
    }

    res.sendStatus(200);
  } catch (err: unknown) {
    console.error("HLS proxy error for:", targetUrl, err);
    res.status(502).send("Error streaming channel source");
  }
});

// Vite middleware or production static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RD TV Dominicana server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
