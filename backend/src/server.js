import cors from "cors";
import express from "express";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { catalog, resolveBookmarkSelection } from "./catalog.js";
import { generateBookmarkPdf } from "./pdf/generatePdf.js";

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const HOST = "0.0.0.0";
const serverDir = dirname(fileURLToPath(import.meta.url));
const frontendDistDir = join(serverDir, "..", "..", "frontend-dist");

app.use(cors());
app.use(express.json());

app.get("/api/bookmark/options", (_req, res) => {
  res.json(catalog);
});

app.post("/api/bookmark/pdf", async (req, res) => {
  const { imageId, phraseId } = req.body ?? {};

  if (!imageId || !phraseId) {
    return res.status(400).json({
      error: "Debes enviar imageId y phraseId."
    });
  }

  const selection = resolveBookmarkSelection(imageId, phraseId);
  if (!selection) {
    return res.status(400).json({
      error: "La imagen o la frase seleccionada no son validas."
    });
  }

  try {
    const pdfBytes = await generateBookmarkPdf(selection);
    const pdfBuffer = Buffer.from(pdfBytes);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="marcapáginas.pdf"');
    res.setHeader("Content-Length", pdfBuffer.length);
    return res.end(pdfBuffer);
  } catch (error) {
    console.error("Error al generar PDF:", error);
    return res.status(500).json({
      error: "Error interno al generar el PDF."
    });
  }
});

// En producción el mismo servicio entrega la web React y la API.
app.use(express.static(frontendDistDir));
app.get("*", (_req, res) => {
  res.sendFile(join(frontendDistDir, "index.html"));
});

app.listen(PORT, HOST, () => {
  console.log(`Aplicación disponible en http://localhost:${PORT}`);
});
