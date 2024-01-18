# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Expose the port on which your application will run
EXPOSE 3000

# Start the MongoDB server
RUN apt-get update && apt-get install -y mongodb
RUN mkdir -p /data/db
CMD ["mongod"]

# Start your application
CMD ["npm", "start"]