# Use a smaller base image
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy only package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Install serve to serve the build
RUN npm install -g serve

# Use a non-root user for better security
USER node

# Command to run the application
CMD ["serve", "-s", "build"]
