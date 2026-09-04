const PHRASE_IMAGE_PADDING = "0.8mm";

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function renderPhraseImage(browser, phraseText) {
  const page = await browser.newPage();

  try {
    await page.setViewport({
      width: 700,
      height: 500,
      deviceScaleFactor: 3
    });

    const safePhrase = escapeHtml(phraseText ?? "");
    await page.setContent(
      `<!doctype html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700&display=block" rel="stylesheet">
          <style>
            html,
            body {
              margin: 0;
              padding: 0;
              background: transparent;
            }
            .capture {
              display: inline-block;
              width: 42mm;
              padding: ${PHRASE_IMAGE_PADDING};
              box-sizing: content-box;
            }
            .phrase {
              color: #ffffff;
              font-family: "Noto Serif", serif;
              font-size: 4.76mm;
              font-weight: 700;
              line-height: 1.35;
              letter-spacing: 0.11mm;
              text-align: center;
              width: 100%;
              margin: 0;
              text-shadow:
                0 0 0.35mm #000,
                0.18mm 0.18mm 0.25mm #000,
                -0.18mm 0.18mm 0.25mm #000,
                0.18mm -0.18mm 0.25mm #000,
                -0.18mm -0.18mm 0.25mm #000;
            }
          </style>
        </head>
        <body>
          <div class="capture">
            <p class="phrase">${safePhrase}</p>
          </div>
        </body>
      </html>`,
      { waitUntil: "load" }
    );

    await page.evaluateHandle("document.fonts.ready");

    const capture = await page.$(".capture");
    const imageBytes = await capture.screenshot({ omitBackground: true });

    return `data:image/png;base64,${Buffer.from(imageBytes).toString("base64")}`;
  } finally {
    await page.close();
  }
}
