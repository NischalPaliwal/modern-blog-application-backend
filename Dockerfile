FROM node:latest

WORKDIR /app

COPY package* .
COPY ./prisma .

RUN npm install
RUN prisma generate

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "node", "dist/server.js" ]