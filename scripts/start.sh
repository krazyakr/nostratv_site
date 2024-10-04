#!/bin/sh
echo "Starting NostraTV Site Docker container"

# Default values
IMAGE_TAG="latest"
SOURCE_VOLUME_PATH="/var/lib/nostratv"

# Parse command-line arguments
while [ "$#" -gt 0 ]; do
  case "$1" in
    --tag)
      IMAGE_TAG="$2"
      shift 2
      ;;
    --volume)
      SOURCE_VOLUME_PATH="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Check if CR_PAT is set, if not exit with an error
if [ -z "$CR_PAT" ]; then
  echo "Error: CR_PAT is not set. Please set it as an environment variable or pass it via GitHub Secrets."
  exit 1
fi

# Log in to GitHub Container Registry
echo $CR_PAT | docker login ghcr.io -u krazyakr --password-stdin

# Run the Docker container with the specified image tag and volume path
docker run \
    --name nostratv_web -d --rm \
    -v $SOURCE_VOLUME_PATH:/usr/local/nostratv_site/ \
    --network dmz-network \
    ghcr.io/krazyakr/nostratv:$IMAGE_TAG
