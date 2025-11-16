name: Push Node.js App Without Dockerfile

on:
  push:
    branches:
      - main

jobs:
  push-node-image:
    runs-on: ubuntu-latest

    steps:
      # 1️⃣ Checkout your code
      - name: Checkout repository
        uses: actions/checkout@v3

      # 2️⃣ Login to Docker Hub
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      # 3️⃣ Pull Node.js base image
      - name: Pull Node.js image
        run: docker pull node:18

      # 4️⃣ Create a container from Node.js image, copy app code, commit as new image
      - name: Build Node.js app image
        run: |
          CONTAINER_ID=$(docker create node:18)
          docker cp . $CONTAINER_ID:/app
          docker commit $CONTAINER_ID ${{ secrets.DOCKER_USERNAME }}/workflow:latest
          docker rm $CONTAINER_ID

      # 5️⃣ Push the new image to Docker Hub
      - name: Push image to Docker Hub
        run: docker push ${{ secrets.DOCKER_USERNAME }}/workflow:latest
