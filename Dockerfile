FROM node:14-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY ./ ./

RUN npm run build

FROM node:14-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --production

COPY --from=build /app/dist ./dist

CMD ["npm", "run", "production"]

HEALTHCHECK --interval=10s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1
