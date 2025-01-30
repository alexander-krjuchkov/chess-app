FROM node:23.5.0-alpine3.20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

ENV NODE_ENV=production
RUN npm ci --omit=dev


FROM ubuntu:24.04

RUN apt-get update && apt-get install -y \
    wget \
    nodejs \
    && rm -rf /var/lib/apt/lists/*

RUN wget -O /stockfish.tar https://github.com/official-stockfish/Stockfish/releases/download/sf_17/stockfish-ubuntu-x86-64-avx2.tar && \
    tar -xf /stockfish.tar && \
    rm /stockfish.tar && \
    mv /stockfish/stockfish-ubuntu-x86-64-avx2 /usr/local/bin/stockfish && \
    rm -rf /stockfish && \
    chmod +x /usr/local/bin/stockfish

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

CMD ["node", "dist/app"]
