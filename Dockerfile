FROM node:alpine

WORKDIR /usr/app

COPY src/package.json .
RUN npm install --quiet

COPY ./src .