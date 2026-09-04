import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, "..", "public", "images");

const pairs = [
  { src: "2 Odisea marcapáginas.tiff", dest: "odisea.jpg" },
  { src: "5 Safo marcapaginas.tiff", dest: "safo.jpg" },
  { src: "13 Medea marcapaginas.tiff", dest: "medea.jpg" },
  { src: "15 Gorgias marcapaginas.tiff", dest: "gorgias.jpg" },
  { src: "16 Pericles marcapaginas.tiff", dest: "pericles.jpg" },
  { src: "23 Epicteto marcapaginas.tiff", dest: "epicteto.jpg" },
  { src: "24 Longo marcapaginas.tiff", dest: "longo.jpg" }
];

for (const { src, dest } of pairs) {
  const inputPath = path.join(imagesDir, src);
  const outputPath = path.join(imagesDir, dest);
  await sharp(inputPath).jpeg({ quality: 90, mozjpeg: true }).toFile(outputPath);
  console.log(`${src} -> ${dest}`);
}
