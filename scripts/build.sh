#!/bin/sh
echo "Building NostraTV Site Docker image"

# Check if arguments are provided, otherwise use defaults
MODE=${1:-production}
VERSION_TAG=${2:-latest}

docker build --build-arg MODE=$MODE -t ghcr.io/krazyakr/nostratv:$VERSION_TAG -t ghcr.io/krazyakr/nostratv:latest .