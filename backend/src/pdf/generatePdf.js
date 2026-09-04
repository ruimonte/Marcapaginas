import puppeteer from "puppeteer";
import { createBookmarkHtml } from "./template.js";
import { renderPhraseImage } from "./renderPhraseImage.js";
import { resolveImageUrlForPdf } from "./resolveImageUrlForPdf.js";

export async function generateBookmarkPdf({ imageUrl, phraseText, textPosition }) {
  const browser = await puppeteer.launch({
    headless: true
  });

  try {
    const page = await browser.newPage();
    const embeddedImageUrl = resolveImageUrlForPdf(imageUrl);
    const phraseImageUrl = await renderPhraseImage(browser, phraseText);
    const html = createBookmarkHtml({ imageUrl: embeddedImageUrl, phraseImageUrl, textPosition });
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluateHandle("document.fonts.ready");
    return await page.pdf({
      printBackground: true,
      width: "50mm",
      height: "180mm",
      preferCSSPageSize: true,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm"
      },
      scale: 1
    });
  } finally {
    await browser.close();
  }
}
