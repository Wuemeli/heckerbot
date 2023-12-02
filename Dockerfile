# use the official Bun image
FROM oven/bun:latest

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json into the directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN bun installer

# Bundle the app source inside the Docker image
COPY . .

# Make port 3000 available to the world outside the Docker container
EXPOSE 3000

# Define the command to run the app
CMD [ "bun", "start" ]