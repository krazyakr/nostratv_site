#!/bin/sh
echo "Building NostraTV Site Docker image"
docker build -t ghcr.io/krazyakr/nostratv:$1 -t ghcr.io/krazyakr/nostratv:latest .