FROM oven/bun:1.0.28-debian

RUN mkdir -p /usr/server

WORKDIR /usr/server

COPY  apps/linkos/package.json package.json
COPY  apps/linkos/bun.lockb bun.lockb

RUN bun install

COPY apps/linkos/* .

EXPOSE 3000

ENTRYPOINT ["bun", "index.ts","--serve"]