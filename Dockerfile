# Use an official Node.js runtime as a parent image
FROM node:latest

# Install Nginx
#RUN apt-get update

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Remove the node_modules folder
RUN rm -rf node_modules

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# get branch name
#ARG BRANCH_NAME
COPY .env.dev .env

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 3000
#EXPOSE 443

# Start the Remix app
CMD ["npm", "run", "start"]
