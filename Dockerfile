FROM node:18-alpine

RUN apk add ffmpeg python3=3.13 opus g++ make libtool
RUN apk add --no-cache libc6-compat build-base gcc

WORKDIR /usr/src/bot
COPY package.json ./
COPY yarn.lock ./
# --ignore-optional --ignore-engines --production
RUN yarn install || \
  ((if [ -f yarn-error.log ]; then \
      cat yarn-error.log; \
    fi) && false)

COPY . .

RUN yarn build

RUN yarn prisma:generate

CMD node dist/index.js
