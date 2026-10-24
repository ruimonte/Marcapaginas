# Node.js 24.22.1 incluye las correcciones de seguridad de octubre de 2026.
FROM node:24.22.1-bookworm

ENV PUPPETEER_CACHE_DIR=/home/pptruser/.cache/puppeteer

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        fonts-ipafont-gothic \
        fonts-wqy-zenhei \
        fonts-thai-tlwg \
        fonts-khmeros \
        fonts-kacst \
        fonts-freefont-ttf \
        dbus \
        dbus-x11 \
    && groupadd -r pptruser \
    && useradd -r -g pptruser -m -d /home/pptruser pptruser \
    && mkdir -p /app \
    && mkdir -p /home/pptruser/.cache \
    && chown pptruser:pptruser /app /home/pptruser/.cache

WORKDIR /app

COPY --chown=pptruser:pptruser frontend/package*.json ./frontend/
COPY --chown=pptruser:pptruser backend/package*.json ./backend/

USER pptruser
RUN cd frontend && npm ci
RUN cd backend && npm ci --omit=dev

USER root
RUN cd backend \
    && npx puppeteer browsers install chrome --install-deps \
    && rm -rf /var/lib/apt/lists/*

COPY --chown=pptruser:pptruser frontend ./frontend
COPY --chown=pptruser:pptruser backend ./backend

RUN cd frontend && npm run build
RUN mv frontend/dist backend/frontend-dist

ENV NODE_ENV=production
ENV PORT=10000
EXPOSE 10000

CMD ["node", "backend/src/server.js"]
