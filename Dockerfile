# use the official Bun image
FROM oven/bun:latest

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN bun install

# Change working directory to src/backup
WORKDIR /app/src/backup

# Copy package.json and package-lock.json into the directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN bun install

# Change working directory back to /app
WORKDIR /app

# Make port 3000 available to the world outside the Docker container
EXPOSE 3000

# Define the command to run the app
CMD [ "bun", "start" ]