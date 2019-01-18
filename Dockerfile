FROM node:alpine

WORKDIR /usr/app/nostratv_site

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN cd /tmp/ && \
    git clone https://github.com/krazyakr/nostratv_site.git && \
    cp -r /tmp/nostratv_site/src/* /usr/app/nostratv_site/ && \
    cd /usr/app/nostratv_site

RUN npm install

CMD ["npm", "start"]