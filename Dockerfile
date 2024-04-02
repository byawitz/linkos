FROM node:21-bookworm as dashboardBuild

RUN mkdir -p /tmp/frontend

WORKDIR /tmp/frontend

COPY apps/dashboard  /tmp/frontend
COPY apps/models /tmp/models

RUN npm ci

RUN npm run build

FROM oven/bun:1.1.0-debian as backendBuild

RUN mkdir -p /tmp/backend

WORKDIR /tmp/backend

COPY  apps/linkos/ /tmp/backend
COPY apps/models /tmp/models

RUN bun install

FROM oven/bun:1.1.0-debian

RUN mkdir -p /usr/server/app

COPY --from=backendBuild /tmp/backend /usr/server/app/
COPY --from=backendBuild /tmp/models /usr/server/models/

RUN mkdir -p /usr/server/app/frontend/dashboard
COPY --from=dashboardBuild /tmp/frontend/dist /usr/server/app/frontend/dashboard

COPY ./apps/linkos/bin /usr/local/bin

RUN chmod +x /usr/local/bin/serve && \
    chmod +x /usr/local/bin/serve-watch &&  \
    chmod +x /usr/local/bin/serve-links && \
    chmod +x /usr/local/bin/serve-links-watch &&  \
    chmod +x /usr/local/bin/analytics && \
    chmod +x /usr/local/bin/analytics-watch &&  \
    chmod +x /usr/local/bin/scheduler && \
    chmod +x /usr/local/bin/scheduler-watch &&  \
    chmod +x /usr/local/bin/webhooks && \
    chmod +x /usr/local/bin/webhooks-watch

WORKDIR /usr/server/app/

EXPOSE 3000

CMD serve