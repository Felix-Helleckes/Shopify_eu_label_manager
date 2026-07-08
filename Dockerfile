# Dockerfile for EU Compliance Suite 2026
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy Prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Expose port
EXPOSE 3000

# Run database migrations and start
CMD ["sh", "-c", "npx prisma migrate deploy && node build/index.js"]