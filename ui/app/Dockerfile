# Stage 1: Compile and Build angular codebase
# Use official node image as the base image
# docker build -f Dockerfile -t tylerm007/circles_frontend --rm .
# docker tag tylerm007/circles_frontend tylerm007/circles_frontend:1.0.0
# docker push tylerm007/circles_frontend:1.0.0  # requires docker login
#
# docker tag tylerm007/circles_frontend tylerm007/circles_frontend:latest
# docker push tylerm007/circles_frontend:latest
# docker run --name frontend_container -p 4299:4299 tylerm007/circles_frontend:latest

# Stage 1: Build the Angular application
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY angular.json ./
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY ngsw-config.json ./
RUN mkdir src
COPY ./src ./src
COPY karma.conf.js ./
RUN mkdir dist
#COPY ./dist ./dist
RUN npm ci --force
RUN npm run build || cat /app/angular.json && cat /app/tsconfig.json && ls -la /app/src

# Stage 2: Production image
FROM nginx:alpine AS production
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist ./dist
COPY nginx/nginx.conf /etc/nginx/nginx.conf


EXPOSE 4300
CMD ["nginx", "-g", "daemon off;"]