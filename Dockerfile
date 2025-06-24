
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Install nodemon globally (for dev only)
RUN npm install -g nodemon

# Copy the rest of the code
# COPY . .

# Install dev dependencies
RUN npm install ts-node-dev

EXPOSE 8080

CMD ["npx", "ts-node-dev", "--respawn", "--transpile-only", "src/server.ts"]