FROM node:alpine

WORKDIR /usr/app/nostratv_site

RUN apk update && apk upgrade && \
    apk add --no-cache bash openssh netcat-openbsd

ADD src /usr/app/nostratv_site/
COPY .config/production.env /usr/app/nostratv_site/.env
RUN cd /usr/app/nostratv_site && npm install

RUN mkdir /usr/local/nostratv_site/

CMD ["npm", "start"]