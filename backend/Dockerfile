# Backend Build Stage
FROM node:18 AS backend-build

# Set working directory for backend
WORKDIR /app/backend

# Copy backend package.json and package-lock.json to install dependencies
COPY ./package*.json ./

# Install backend dependencies
RUN npm install

# Copy all backend source files
COPY ./ ./

# Build the backend (compile TypeScript)
RUN npm run build

# Final Stage - Run Backend
FROM node:18

# Set the working directory for the backend app
WORKDIR /app/backend

# Copy the built backend files from the build stage
COPY --from=backend-build /app/backend/dist /app/backend/dist

# Expose the backend API port (adjust if necessary)
EXPOSE 5000

# Install production dependencies (install only production dependencies)
COPY ./package*.json  ./
RUN npm install --only=production

# Start the backend app
CMD ["npm", "run", "start"]
