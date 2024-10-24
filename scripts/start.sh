#!/bin/sh
echo "Starting NostraTV Site Docker container"

# Default values
IMAGE_TAG="latest"

# Parse command-line arguments
while [ "$#" -gt 0 ]; do
  case "$1" in
    --tag)
      IMAGE_TAG="$2"
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

# Check if the DMZ network exists, if not, create it
if ! docker network ls | grep -q dmz-network; then
  echo "Creating dmz-network..."
  docker network create dmz-network
else
  echo "dmz-network already exists."
fi

# Check if the NostraTV network exists, if not, create it
if ! docker network ls | grep -q nostratv-network; then
  echo "Creating nostratv-network..."
  docker network create nostratv-network
else
  echo "nostratv-network already exists."
fi

# Check if a PostgreSQL container named postgres_nostratv is running, if not, start it
if ! docker ps --filter "name=postgres_nostratv" --format "{{.Names}}" | grep -q postgres_nostratv; then
  echo "Starting PostgreSQL container..."
  docker run \
    --name postgres_nostratv -d \
    --network nostratv-network \
    -v nostratv_pgdata:/var/lib/postgresql/data \
    -e POSTGRES_USER=postgres \
    -e POSTGRES_PASSWORD=postgres \
    -e POSTGRES_DB=nostratv \
    postgres:latest
else
  echo "PostgreSQL container is already running."
fi

# Log in to GitHub Container Registry
echo $CR_PAT | docker login ghcr.io -u krazyakr --password-stdin

# Run the Docker container with the specified image tag and volume path
docker run \
    --name nostratv_web -d --rm \
    --network dmz-network \
    --network nostratv-network \
    ghcr.io/krazyakr/nostratv:$IMAGE_TAG
