# use the official Bun image
FROM oven/bun:latest

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN bun install

# Bundle app source
COPY . .

# Expose port 3000
EXPOSE 3000

# Define the command to run your app
CMD ["bun", "start"]
