# Dockerfile
FROM node:18

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Expose port if needed
EXPOSE 3000

# Start app
CMD ["node", "index.js"]
