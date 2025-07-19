# Stage 1: Build the Vite application
# docker build -f Dockerfile -t tylerm007/card-deck-manager --rm .
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production image with static file server
FROM node:18-alpine AS production
WORKDIR /app

# Install a static file server
RUN npm install -g serve

# Copy the built application
COPY --from=builder /app/dist ./dist

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
