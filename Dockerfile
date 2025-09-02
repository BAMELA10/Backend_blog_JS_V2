#!/bin/sh
FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./ 

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm","run","start:dev"]