const VALID_TEXT_POSITIONS = new Set(["top", "center", "bottom"]);

function BookmarkPreview({ imageUrl, phrase, textPosition = "bottom" }) {
  const safeTextPosition = VALID_TEXT_POSITIONS.has(textPosition) ? textPosition : "bottom";

  return (
    <article className={`bookmark-preview position-${safeTextPosition}`}>
      <img src={imageUrl} alt="Fondo del marcapáginas" />
      <div className="overlay">
        <p className="phrase">{phrase}</p>
      </div>
    </article>
  );
}

export default BookmarkPreview;
