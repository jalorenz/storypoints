FROM node:20 AS backend-builder

WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY backend/package*.json ./
COPY backend/tsconfig*.json ./

# Install the dependencies
RUN npm install

# Copy the source code to the working directory
COPY backend .

# Build the application
RUN npm run build

FROM node:20 AS frontend-builder

WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY frontend/package*.json ./
COPY frontend/tsconfig*.json ./

# Install the dependencies
RUN npm install

# Copy the source code to the working directory
COPY frontend .

# Build the application
RUN npm run build

FROM node:20

WORKDIR /app

# Copy the built backend and frontend from the builder stages
COPY --from=backend-builder /app/dist ./backend
COPY --from=frontend-builder /app/out ./frontend

# Copy the package.json and package-lock.json files to the working directory
COPY backend/package*.json ./backend/

# Install the production dependencies for both backend and frontend
RUN npm install --production --prefix ./backend

# Expose the port the app runs on
EXPOSE 3000

ENV FRONTEND_DIRECTORY="/app/frontend"

# Start the application
CMD ["node", "backend/main.js"]