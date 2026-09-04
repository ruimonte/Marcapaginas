# Marcapaginas PDF

Aplicacion web sencilla para crear marcapaginas en PDF a partir de una imagen y una frase prefijadas.

## Arquitectura

- `frontend`: React + Vite para seleccionar opciones y mostrar preview.
- `backend`: Node.js + Express + Puppeteer para generar el PDF.

## Requisitos

- Node.js 18+ y npm.

## Ejecutar en local

### 1) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend en `http://localhost:5173`.

Para acceder desde otro dispositivo con ngrok, usa solo el tunel del frontend.
El frontend envia peticiones a `/api` y Vite las redirige al backend local por proxy.

### 2) Backend

```bash
cd backend
npm install
npm run dev
```

Backend en `http://localhost:3001`.

El backend escucha tambien en red local (`0.0.0.0`) para aceptar peticiones desde movil.

## Publicar sin depender del portátil (Render)

El proyecto ya incluye un `Dockerfile` que construye la web y la API como un único servicio,
con Chromium incluido para generar los PDF. Puedes publicarlo en [Render](https://render.com)
siguiendo estos pasos:

1. Sube esta carpeta a un repositorio de GitHub.
2. En Render, elige **New +** → **Blueprint** y conecta el repositorio.
3. Render detectará `render.yaml`. Confirma la creación y espera al primer despliegue.
4. Al terminar, Render mostrará una URL pública (`https://...onrender.com`) que puedes compartir.

No configures un *build command* ni un *start command*: el `Dockerfile` se ocupa de ambos.
Cada cambio que subas a la rama conectada se publicará automáticamente.

> El plan gratuito de Render puede poner el servicio en reposo tras un periodo sin visitas;
> la primera visita posterior tardará unos segundos en responder. Para disponibilidad sin
> esperas, usa un plan de pago de Render o Railway con el mismo `Dockerfile`.

### Generacion del PDF y ngrok

Para el PDF, el backend lee las imagenes desde `frontend/public/images/` y las incrusta como data URL, asi que **no hace falta** que Puppeteer pueda abrir Vite ni ngrok para cargar el `<img>`.

Opcional: `FRONTEND_ORIGIN` solo afecta a las URLs del catalogo expuesto por la API; el preview del navegador sigue usando rutas relativas `/images/...`.

Las portadas estan en JPG en `frontend/public/images/`. Si anades nuevos TIFF, colocalos en esa carpeta, actualiza `frontend/scripts/convert-tiff-to-jpg.mjs` y ejecuta `npm run convert:tiff` en `frontend`.

## Cambiar imagenes, frases y posicion del texto

### Posicion del texto

La posicion del texto se configura con la propiedad `textPosition` de cada imagen.

Valores permitidos:

- `top`: texto arriba.
- `center`: texto centrado verticalmente.
- `bottom`: texto abajo.

Hay que cambiarlo en dos sitios para que preview y PDF coincidan:

- Preview frontend: `frontend/src/data/bookmarks.json`
- PDF backend: `backend/src/catalog.js`

Ejemplo en el frontend:

```json
{
  "id": "odisea",
  "name": "Odisea",
  "url": "/images/odisea.jpg",
  "textPosition": "center",
  "phraseIds": ["odisea_es", "odisea_gr"]
}
```

Ejemplo equivalente en el backend:

```js
{ id: "odisea", name: "Odisea", url: `${FRONTEND_ORIGIN}/images/odisea.jpg`, textPosition: "center" }
```

Si cambias `backend/src/catalog.js`, reinicia el backend para que el PDF use el cambio.

### Asociar frases a cada imagen

Las frases disponibles para cada imagen en el selector del frontend se configuran solo en `frontend/src/data/bookmarks.json`, con la propiedad `phraseIds`.

Cada valor de `phraseIds` debe coincidir con el `id` de una frase de la seccion `phrases`.

Ejemplo:

```json
{
  "id": "safo",
  "name": "Safo",
  "url": "/images/safo.jpg",
  "textPosition": "top",
  "phraseIds": ["safo_es", "safo_gr"]
}
```

Con esa configuracion, al seleccionar Safo solo se podran elegir las frases `safo_es` y `safo_gr`.

Para anadir o quitar frases de una imagen, edita esa lista:

```json
"phraseIds": ["safo_es", "safo_gr", "otra_frase"]
```

Si una imagen no tiene `phraseIds`, el frontend mostrara todas las frases como fallback.

### URL del libro descargable

El boton `Descarga gratuita del libro` usa la constante `BOOK_DOWNLOAD_URL` de `frontend/src/App.jsx`.

Para cambiar la URL del PDF del libro, edita esta linea:

```js
const BOOK_DOWNLOAD_URL = "https://example.com/libro.pdf";
```

Sustituye `https://example.com/libro.pdf` por la URL real del PDF.

## Endpoints backend

- `GET /api/bookmark/options`: devuelve catalogo de imagenes y frases.
- `POST /api/bookmark/pdf`: recibe:

```json
{
  "imageId": "montana",
  "phraseId": "pagina-viaje"
}
```

Devuelve un `application/pdf` descargable/imprimible.
