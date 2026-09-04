const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";

export const catalog = {
  images: [
    { id: "odisea", name: "Odisea", url: `${FRONTEND_ORIGIN}/images/odisea.jpg`, textPosition: "center" },
    { id: "safo", name: "Safo", url: `${FRONTEND_ORIGIN}/images/safo.jpg`, textPosition: "center" },
    { id: "medea", name: "Medea", url: `${FRONTEND_ORIGIN}/images/medea.jpg`, textPosition: "bottom" },
    { id: "gorgias", name: "Gorgias", url: `${FRONTEND_ORIGIN}/images/gorgias.jpg`, textPosition: "top" },
    { id: "pericles", name: "Pericles", url: `${FRONTEND_ORIGIN}/images/pericles.jpg`, textPosition: "bottom" },
    { id: "epicteto", name: "Epicteto", url: `${FRONTEND_ORIGIN}/images/epicteto.jpg`, textPosition: "bottom" },
    { id: "longo", name: "Longo", url: `${FRONTEND_ORIGIN}/images/longo.jpg`, textPosition: "top" }
  ],
  phrases: [
    { id: "odisea_es", text: "Justo en ese momento, al sentir a Odiseo cercano saludando la cola movió y agachó las orejas" },
    { id: "odisea_gr", text: "δὴ τότε γ᾽, ὡς ἐνόησεν Ὀδυσσέα ἐγγὺς ἐόντα, οὐρῇ μέν ῥ᾽ ὅ γ᾽ ἔσηνε καὶ οὔατα κάββαλεν ἄμφω" },
    { id: "safo_es", text: "Pero ¡hay que atreverse a todo!" },
    { id: "safo_gr", text: "ἀλλὰ πᾶν τόλματον" },
    { id: "medea_es", text: "¡Prefiero estar tres veces tras un escudo a parir una sola!" },
    { id: "medea_gr", text: "ὡς τρὶς ἂν παρ᾽ ἀσπίδα στῆναι θέλοιμ᾽ ἂν μᾶλλον ἢ τεκεῖν ἅπαξ" },
    { id: "gorgias_es", text: "La palabra es un gran señor que con un cuerpo muy pequeño y discreto realiza acciones propias de un dios." },
    { id: "gorgias_gr", text: "λόγος δυνάστης μέγας ἐστίν, ὃς σμικροτάτῳ σώματι καὶ ἀφανεστάτῳ θειότατα ἔργα ἀποτελεῖ" },
    { id: "pericles_es", text: "Amamos la belleza sin derroche y amamos el saber sin debilidad." },
    { id: "pericles_gr", text: "φιλοκαλοῦμέν τε γὰρ μετ᾽ εὐτελείας καὶ φιλοσοφοῦμεν ἄνευ μαλακίας" },
    { id: "epicteto_es", text: "Lo que preocupa a los hombres no son los hechos, sino las opiniones sobre los hechos." },
    { id: "epicteto_gr", text: "ταράσσει τοὺς ἀνθρώπους οὐ τὰ πράγματα, ἀλλὰ τὰ περὶ τῶν πραγμάτων δόγματα" },
    { id: "longo_es", text: "Nadie escapó ni escapará a Eros mientras exista la belleza y los ojos la vean." },
    { id: "longo_gr", text: "Πάντως γὰρ οὐδεὶς ἔρωτα ἔφυγεν ἢ φεύξεται, μέχρι ἂν κάλλος ᾖ καὶ ὀφθαλμοὶ βλέπωσιν" }
  ]
};

export function resolveBookmarkSelection(imageId, phraseId) {
  const image = catalog.images.find((item) => item.id === imageId);
  const phrase = catalog.phrases.find((item) => item.id === phraseId);

  if (!image || !phrase) {
    return null;
  }

  return {
    imageUrl: image.url,
    textPosition: image.textPosition,
    phraseText: phrase.text
  };
}
