#!/bin/bash
set -xe

IMAGE="gcr.io/legion-ai-418510/synchron-backend:latest"
CONTAINER_NAME="synchron-backend"

# 1. Install Docker (Debian/Ubuntu style)
apt-get update -y
apt-get install -y docker.io curl

systemctl enable docker
systemctl start docker

# 2. Get an access token from the VM's service account metadata
ACCESS_TOKEN=$(curl -s -H "Metadata-Flavor: Google" \
  "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token" \
  | awk -F\" '/access_token/ {print $4}')

# 3. Log in docker to gcr.io using that token
echo "$ACCESS_TOKEN" | docker login -u oauth2accesstoken --password-stdin https://gcr.io

# 4. Clean up any old container if the VM is being recreated or rebooted
docker rm -f "$CONTAINER_NAME" || true

# 5. Pull the exact image we want to run
docker pull "$IMAGE"

# 6. Run the container the same way you do manually
docker run -d \
  --name "$CONTAINER_NAME" \
  -p 80:8000 \
  -e DB_NAME=synchron \
  "$IMAGE" \
  gunicorn --bind 0.0.0.0:8000 --workers 3 --timeout 120 synchron.wsgi:application

# 7. Optional: log running containers for debugging
docker ps --filter "name=$CONTAINER_NAME"
