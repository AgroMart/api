# Estágio 1: Build
FROM node:18 AS build
# Installing libvips-dev for sharp Compatibility
RUN apt-get update && apt-get install -y --no-install-recommends \
    autoconf \
    automake \
    bash \
    build-essential \
    gcc \
    libpng-dev \
    libvips-dev \
    nasm \
    zlib1g-dev && \
    rm -rf /var/lib/apt/lists/*
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY package.json package-lock.json* yarn.lock* ./
RUN npm ci --ignore-scripts

WORKDIR /opt/app
COPY . .
RUN npm run build

# Estágio 2: Produção
FROM node:18-alpine3.18 AS production
# Installing libvips-dev for sharp Compatibility on Alpine
RUN apk update && apk add --no-cache \
    autoconf \
    automake \
    bash \
    build-base \
    gcc \
    libpng-dev \
    nasm \
    vips-dev \
    zlib-dev
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY --from=build /opt/package.json ./
COPY --from=build /opt/package-lock.json* ./
COPY --from=build /opt/yarn.lock* ./
RUN npm ci --only=production --ignore-scripts

WORKDIR /opt/app
COPY --from=build --chown=node:node /opt/app/build ./build
COPY --from=build --chown=node:node /opt/app/config ./config
COPY --from=build --chown=node:node /opt/app/src ./src
COPY --from=build --chown=node:node /opt/app/public ./public
RUN mkdir -p /opt/app/public/uploads && chown -R node:node /opt/app
COPY --from=build --chown=node:node /opt/app/package.json ./package.json

ENV PATH=/opt/node_modules/.bin:$PATH

USER node

EXPOSE 1337
CMD ["npm", "run", "start"]
