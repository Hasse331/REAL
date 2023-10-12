# Use an official Node runtime as the parent image
FROM node:18-alpine AS base

# Install system dependencies (libc6-compat might be needed for Next.js)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock if you're using Yarn) to the working directory
COPY package*.json ./
COPY tsconfig.json ./

# Install project dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Build the app for production
RUN npm run build

# Expose the desired port for the app
EXPOSE 3000

# Specify the command to run on container start
CMD ["npm", "start"]
