#!/bin/sh
rm -r build/
mkdir build && mkdir build/dev && mkdir build/release
cp --verbose *.sh build/dev && cp --verbose *.sh build/release
rm build/dev/package.sh && rm build/release/package.sh
cp -r --verbose src/ build/dev/src && cp -r --verbose src/ build/release/src
rm -r build/dev/src/node_modules && rm -r build/release/src/node_modules
cp --verbose dev-docker-compose.yml build/dev/docker-compose.yml
cp --verbose docker-compose.yml build/release/docker-compose.yml
cp --verbose Dockerfile build/dev/Dockerfile
cp --verbose Dockerfile build/release/Dockerfile
