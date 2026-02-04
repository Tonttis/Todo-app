# Use Node.js base image (since we're using Next.js)
FROM oven/bun:1 as base

# Install Node.js for Next.js compatibility
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package.json bun.lock* ./
COPY prisma ./prisma/

# Install dependencies
RUN bun install

# Generate Prisma client
RUN bun run db:generate

# Copy the rest of the application
COPY . .

# Build the application
RUN bun run build

# Expose port
EXPOSE 3000

# Start command
CMD ["bun", "run", "start"]
