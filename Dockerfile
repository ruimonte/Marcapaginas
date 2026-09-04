# Imagen oficial de Puppeteer: incluye Chromium y las dependencias necesarias
# para generar PDFs en un proveedor cloud.
FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /app

COPY --chown=pptruser:pptruser frontend/package*.json ./frontend/
COPY --chown=pptruser:pptruser backend/package*.json ./backend/

USER pptruser
RUN cd frontend && npm ci
RUN cd backend && npm ci --omit=dev

COPY --chown=pptruser:pptruser frontend ./frontend
COPY --chown=pptruser:pptruser backend ./backend

RUN cd frontend && npm run build
RUN mv frontend/dist backend/frontend-dist

ENV NODE_ENV=production
ENV PORT=10000
EXPOSE 10000

CMD ["node", "backend/src/server.js"]
