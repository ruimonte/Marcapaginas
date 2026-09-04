export async function generateBookmarkPdf(payload) {
  const response = await fetch("/api/bookmark/pdf", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let message = "No se pudo generar el PDF.";
    try {
      const body = await response.json();
      if (body?.error) {
        message = body.error;
      }
    } catch {
      // Ignore parse errors and fallback to generic message.
    }
    throw new Error(message);
  }

  return response.blob();
}
