# Use official Node.js Alpine image for lightweight build
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first to leverage cache
COPY package*.json ./

# Install dependencies  
# Note: In production you might use 'npm ci --only=production' 
# but we need devDependencies (typescript) for the build step.
RUN npm install

# Copy source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Expose the API port
EXPOSE 5000

# Start the application
# Ensure 'npm start' maps to 'node dist/app.js' or similar in package.json
CMD ["npm", "start"]
