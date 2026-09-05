import { useEffect, useMemo, useState } from "react";
import bookmarksData from "./data/bookmarks.json";
import BookmarkPreview from "./components/BookmarkPreview.jsx";
import { generateBookmarkPdf } from "./services/pdfApi.js";

// Cambia aqui la URL del PDF del libro cuando la tengas.
const BOOK_DOWNLOAD_URL = "https://example.com/libro.pdf";

function App() {
  const [selectedImageId, setSelectedImageId] = useState(bookmarksData.images[0]?.id ?? "");
  const [selectedPhraseId, setSelectedPhraseId] = useState(bookmarksData.phrases[0]?.id ?? "");
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [error, setError] = useState("");

  const selectedImage = useMemo(
    () => bookmarksData.images.find((img) => img.id === selectedImageId),
    [selectedImageId]
  );
  const selectedPhrase = useMemo(
    () => bookmarksData.phrases.find((item) => item.id === selectedPhraseId),
    [selectedPhraseId]
  );
  const availablePhrases = useMemo(() => {
    const phraseIds = selectedImage?.phraseIds;

    if (!phraseIds?.length) {
      return bookmarksData.phrases;
    }

    return phraseIds
      .map((phraseId) => bookmarksData.phrases.find((phrase) => phrase.id === phraseId))
      .filter(Boolean);
  }, [selectedImage]);

  useEffect(() => {
    if (!availablePhrases.length) return;

    const selectedPhraseIsAvailable = availablePhrases.some((phrase) => phrase.id === selectedPhraseId);
    if (!selectedPhraseIsAvailable) {
      setSelectedPhraseId(availablePhrases[0].id);
    }
  }, [availablePhrases, selectedPhraseId]);

  const payload = {
    imageId: selectedImageId,
    phraseId: selectedPhraseId
  };

  const createObjectUrl = async () => {
    setError("");
    setLoadingPdf(true);
    try {
      const blob = await generateBookmarkPdf(payload);
      return URL.createObjectURL(blob);
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleDownload = async () => {
    const objectUrl = await createObjectUrl();
    if (!objectUrl) return;

    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = "marcapáginas.pdf";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(objectUrl);
  };

  const handlePrint = async () => {
    // Debe abrirse durante el gesto del usuario; si se hace después de esperar
    // al PDF, los navegadores lo bloquean como una ventana emergente.
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setError("El navegador ha bloqueado la ventana de impresion. Permite las ventanas emergentes e inténtalo de nuevo.");
      return;
    }

    const objectUrl = await createObjectUrl();
    if (!objectUrl) {
      printWindow.close();
      return;
    }

    const revoke = () => URL.revokeObjectURL(objectUrl);
    printWindow.addEventListener("load", () => {
      if (!printWindow.location.href.startsWith("blob:")) return;
      printWindow.focus();
      printWindow.print();
      revoke();
    }, { once: true });
    printWindow.location.replace(objectUrl);
  };

  return (
    <main className="app">
      <h1>El sueño de una sombra</h1>
      <h2>La literatura griega antigua en sus textos</h2>
      <p className="subtitle">Selecciona una imagen y una frase para crear tu marcapáginas listo para imprimir.</p>

      <section className="layout">
        <div className="left-column">
          <div className="controls">
            <label>
              Imagen
              <select
                value={selectedImageId}
                onChange={(event) => setSelectedImageId(event.target.value)}
                disabled={loadingPdf}
              >
                {bookmarksData.images.map((image) => (
                  <option key={image.id} value={image.id}>
                    {image.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Frase
              <select
                value={selectedPhraseId}
                onChange={(event) => setSelectedPhraseId(event.target.value)}
                disabled={loadingPdf}
              >
                {availablePhrases.map((phrase) => (
                  <option key={phrase.id} value={phrase.id}>
                    {phrase.text}
                  </option>
                ))}
              </select>
            </label>

            <div className="actions">
              <button onClick={handleDownload} disabled={loadingPdf}>
                {loadingPdf ? "Generando..." : "Descargar PDF"}
              </button>
              <button onClick={handlePrint} disabled={loadingPdf}>
                Imprimir
              </button>
            </div>

            <div className="book-promo">
              <p>24 textos seleccionados e ilustrados, con actividades para su trabajo en el aula de Griego, Herencia y Pervivencia</p>
              <button className="book-download-button" type="button" disabled title="Próximamente disponible">
                Descarga gratuita del libro
              </button>
            </div>

            {error ? <p className="error">{error}</p> : null}
          </div>

          <img className="project-logo" src="/suenyosombra.jpg" alt="El sueño de una sombra" />
        </div>

        <div className="preview-panel">
          <h2>Preview</h2>
          <BookmarkPreview
            imageUrl={selectedImage?.url}
            phrase={selectedPhrase?.text}
            textPosition={selectedImage?.textPosition}
          />
        </div>
      </section>

      <footer className="site-footer">
        <p>© Francisco J. Pérez Cartagena y Adrián Plaza Salas</p>
        <p>© Consejería de Educación y Cultura de la Región de Murcia</p>
        <p>Licencia CC 3.0</p>
      </footer>
    </main>
  );
}

export default App;
