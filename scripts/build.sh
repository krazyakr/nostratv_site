#!/bin/sh
echo "Building NostraTV Site Docker image"
docker build -t krazyakr/nostratv:1.2.0 -t krazyakr/nostratv:latest .