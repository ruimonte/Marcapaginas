import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const templatePath = join(currentDir, "template.html");
const template = readFileSync(templatePath, "utf-8");

const VALID_TEXT_POSITIONS = new Set(["top", "center", "bottom"]);

export function createBookmarkHtml({ imageUrl, phraseImageUrl, textPosition = "bottom" }) {
  const safeTextPosition = VALID_TEXT_POSITIONS.has(textPosition) ? textPosition : "bottom";

  return template
    .replace("{{IMAGE_URL}}", imageUrl)
    .replace("{{PHRASE_IMAGE_URL}}", phraseImageUrl)
    .replace("{{TEXT_POSITION}}", safeTextPosition)
}
