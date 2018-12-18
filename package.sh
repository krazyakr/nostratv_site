#!/bin/sh
rm -r build/
mkdir build && mkdir build/dev && mkdir build/release
cp *.sh build/dev && cp *.sh build/release
rm build/dev/package.sh && rm build/release/package.sh
cp -r src/ build/dev/src && cp -r src/ build/release/src
rm -r build/dev/src/node_modules && rm -r build/release/src/node_modules
cp dev-docker-compose.yml build/dev/docker-compose.yml
cp docker-compose.yml build/release/docker-compose.yml
cp Dockerfile build/dev/Dockerfile
cp Dockerfile build/release/Dockerfile
