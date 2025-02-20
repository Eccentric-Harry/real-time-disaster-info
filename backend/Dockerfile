# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the backend code
COPY . .

# Expose the backend port (example: 5000)
EXPOSE 5000

# Start the backend
CMD ["npm", "start"]