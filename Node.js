name: Push Node.js App Without Dockerfile

on:
  push:
    branches:
      - main

jobs:
  push-image:
    runs-on: ubuntu-latest

    steps:
      # 1️⃣ Checkout repo
      - name: Checkout code
        uses: actions/checkout@v3

      # 2️⃣ Login to Docker Hub
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      # 3️⃣ Pull Node.js base image
      - name: Pull Node.js base image
        run: docker pull node:18

      # 4️⃣ Create container and copy your Node.js app
      - name: Build image with Node.js app
        run: |
          docker run --name temp-node -d node:18 tail -f /dev/null
          docker cp . temp-node:/app
          docker exec temp-node bash -c "cd /app && npm install"
          docker commit temp-node ${{ secrets.DOCKER_USERNAME }}/workflow:latest
          docker stop temp-node

      # 5️⃣ Push image to Docker Hub
      - name: Push image
        run: docker push ${{ secrets.DOCKER_USERNAME }}/workflow:latest
