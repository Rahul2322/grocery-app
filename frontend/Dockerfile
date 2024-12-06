# Frontend Build Stage
FROM node:18 AS frontend-build

# Set working directory for frontend
WORKDIR /app/frontend

# Copy the frontend package.json and package-lock.json to install dependencies
COPY ./package*.json  ./

# Install frontend dependencies
RUN npm install

# Copy all frontend source files
COPY ./ ./

# Build the frontend app (producing a 'dist' directory by default in Vite)
RUN npm run build

# Final Stage - Serve Frontend
FROM node:18

WORKDIR /app/frontend

# Copy the build output from the previous stage
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

# Copy the frontend package.json and package-lock.json for runtime (optional)
COPY ./package*.json ./

# Expose port (Vite default is 5173, but you can change this if you have a different setup)
EXPOSE 5173

# Install production dependencies
RUN npm install --only=production

# Start the frontend app (adjust this command based on your app's start script, if necessary)
CMD ["npm", "run", "dev"]
