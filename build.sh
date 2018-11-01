#!/bin/sh
echo "Building NostraTV Site Docker image"
docker-compose build --force-rm --no-cache --pull