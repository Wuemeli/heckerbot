# use the official Bun image
FROM oven/bun:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN bun install

# Bundle app source
COPY . .

# Install dependencies for the main application
RUN bun install

# Set the working directory to src/backup and install dependencies
WORKDIR /usr/src/app/src/backup
RUN bun install

# Go back to the root of the project
WORKDIR /usr/src/app

# Expose port 3000
EXPOSE 3000

# Define the command to run your app
CMD ["bun", "start"]
