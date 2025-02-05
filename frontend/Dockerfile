# Stage 1: Build Stage
FROM oven/bun:alpine AS build

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN bun install

# Install Vite globally
RUN bun add -g vite

# Copy application files
COPY . .

# Build the application
RUN bun run build  # Make sure your build script in package.json uses Vite, e.g., "vite build"

# Stage 2: Production Stage with Nginx
FROM nginx:alpine

# Copy the build output to Nginx's html directory
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
