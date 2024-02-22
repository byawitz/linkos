FROM node:21-bookworm as build

RUN mkdir -p /tmp/frontend

WORKDIR /tmp/frontend

COPY apps/dashboard  /tmp/frontend

RUN npm ci

RUN npm run build

FROM nginx:1.25.4-bookworm

RUN sed -i'' -e 's#/usr/share/nginx/html;#/usr/share/nginx/html; try_files $uri $uri/ /dashboard/index.html;#g' /etc/nginx/conf.d/default.conf

COPY --from=build /tmp/frontend/dist /usr/share/nginx/html/dashboard