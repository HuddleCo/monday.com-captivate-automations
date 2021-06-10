FROM node:14-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production --no-progress --non-interactive

COPY ./ ./

CMD ["yarn", "start"]

HEALTHCHECK --interval=10s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1