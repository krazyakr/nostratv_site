FROM node:alpine

WORKDIR /usr/app

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN cd /tmp/ && \
    git clone https://github.com/krazyakr/nostratv_site.git && \
    cp -r /tmp/nostratv_site/src/* /usr/app/ && \
    cd /usr/app

RUN npm install