# Dockerfile
FROM node:18 AS builder

# Set the working directory for the backend
WORKDIR /app/backend

# Copy backend files and install dependencies
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
COPY backend/.env.production ./.env
RUN npm run build

# Set the working directory for the frontend
WORKDIR /app/frontend

# Copy frontend files and install dependencies
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
COPY frontend/.env.production ./.env
RUN npm run build

# Final image
FROM nginx:alpine

# Copy the built frontend to Nginx
COPY --from=builder /app/frontend/build /usr/share/nginx/html

# Copy the built NestJS app and necessary dependencies
COPY --from=builder /app/backend/dist /app/backend/dist
COPY --from=builder /app/backend/package*.json /app/backend/
COPY --from=builder /app/backend/.env /app/backend/.env 

# Install production dependencies for the backend
RUN apk add --no-cache nodejs npm \
    && cd /app/backend \
    && npm install --only=production

# Install PM2 and use it to start the NestJS application
RUN npm install -g pm2

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose ports
EXPOSE 80 3000

# Start Nginx and NestJS
CMD ["sh", "-c", "nginx && cd /app/backend && pm2 start dist/main.js --no-daemon"]
