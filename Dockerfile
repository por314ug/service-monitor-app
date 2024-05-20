# Specify a base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose the port the server listens on
EXPOSE 5000

# Command to run the server
CMD ["node", "server.js"]
