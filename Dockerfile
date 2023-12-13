# Use the official Node.js 18.13.0 image as the base image
FROM node:18.13.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that the AdonisJS app will run on
EXPOSE 3333

# Command to run your AdonisJS application
CMD ["npm", "start"]