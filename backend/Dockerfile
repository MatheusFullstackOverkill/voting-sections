# Use a Node.js image
FROM golang:latest

# Set the working directory
WORKDIR /app

# Copy everything to the container
COPY . .

# Install dependencies
RUN go mod tidy

# Expose port
EXPOSE 5000