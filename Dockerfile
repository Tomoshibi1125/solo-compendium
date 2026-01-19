# syntax=docker/dockerfile:1

FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-alpine AS build
WORKDIR /app
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_OAUTH_ENABLED=false
ARG VITE_APP_VERSION
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_OAUTH_ENABLED=$VITE_OAUTH_ENABLED
ENV VITE_APP_VERSION=$VITE_APP_VERSION
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS runtime
RUN printf '%s\n' \
  'server {' \
  '  listen 3000;' \
  '  server_name _;' \
  '  root /usr/share/nginx/html;' \
  '  index index.html;' \
  '' \
  '  location = /healthz { return 200 "ok"; }' \
  '  location /assets/ { try_files $uri =404; add_header Cache-Control "public, max-age=31536000, immutable"; }' \
  '  location /generated/ { try_files $uri =404; add_header Cache-Control "public, max-age=1209600"; }' \
  '  location / { try_files $uri /index.html; }' \
  '}' \
  > /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
ENV NODE_ENV=production
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://localhost:3000/healthz || exit 1
CMD ["nginx", "-g", "daemon off;"]
