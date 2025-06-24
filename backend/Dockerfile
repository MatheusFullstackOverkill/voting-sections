FROM golang:alpine

# Set the working directory
WORKDIR /app

# Copy everything to the container
COPY . .

# Install dependencies
RUN go mod tidy

RUN go install github.com/pressly/goose/v3/cmd/goose@latest

# Expose port
EXPOSE 5000