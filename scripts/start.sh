#!/bin/sh
echo "Starting NostraTV Site Docker container"
docker run --name nostratv_web -p 80:80 -d --rm krazyakr/nostratv:latest