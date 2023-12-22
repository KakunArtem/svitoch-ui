# Select a base image
FROM node:14

# Set working directory in the Docker image
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the app's source code to the working directory
COPY . .

# Build the React app
RUN npm run build

# Expose port 3000 for the app to be served
EXPOSE 3000

# Start the app
CMD [ "npm", "start" ]