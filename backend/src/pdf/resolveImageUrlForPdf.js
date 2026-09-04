import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const pdfDir = dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = join(pdfDir, "..", "..", "..", "frontend", "public", "images");

function mimeForExt(ext) {
  const e = ext.toLowerCase();
  if (e === ".jpg" || e === ".jpeg") return "image/jpeg";
  if (e === ".png") return "image/png";
  if (e === ".svg") return "image/svg+xml";
  if (e === ".webp") return "image/webp";
  if (e === ".gif") return "image/gif";
  return "application/octet-stream";
}

/**
 * Convierte URLs de /images/... en data URLs leyendo el fichero del disco,
 * para que Puppeteer no dependa de Vite, localhost ni ngrok.
 */
export function resolveImageUrlForPdf(imageUrl) {
  if (!imageUrl || imageUrl.startsWith("data:")) {
    return imageUrl;
  }

  let pathname;
  try {
    pathname = new URL(imageUrl).pathname;
  } catch {
    return imageUrl;
  }

  const prefix = "/images/";
  if (!pathname.startsWith(prefix)) {
    return imageUrl;
  }

  const rawSegment = pathname.slice(prefix.length);
  const fileName = basename(decodeURIComponent(rawSegment));
  if (!fileName || fileName === "." || fileName === "..") {
    return imageUrl;
  }

  const filePath = join(IMAGES_DIR, fileName);
  if (!existsSync(filePath)) {
    console.warn(`PDF: imagen no encontrada en disco: ${filePath}`);
    return imageUrl;
  }

  const buf = readFileSync(filePath);
  const mime = mimeForExt(extname(fileName));
  return `data:${mime};base64,${buf.toString("base64")}`;
}
