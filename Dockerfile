FROM node:14-alpine

WORKDIR /api-mini

RUN apk add git

COPY package*.json ./

RUN npm install

COPY . .
EXPOSE 1200
CMD [ "npm", "start" ]