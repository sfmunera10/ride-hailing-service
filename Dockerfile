FROM node:lts-alpine

ADD . /app

WORKDIR /app

RUN npm install && \
    npm run clean && npm run build

RUN npx prisma generate

EXPOSE 8080

CMD ["node", "./dist/src/main.js"]