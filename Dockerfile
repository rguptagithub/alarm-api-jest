# Use a Node.js base image
FROM node:alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json .

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the port your application will listen on
EXPOSE 4000

# Start the application
CMD ["node", "./dist/server.js"]

# CMD ["npm" , "start"]
