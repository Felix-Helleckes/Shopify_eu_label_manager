# EU Compliance Suite – production image (Fly.io, region fra / Frankfurt).
# The database is external (Supabase, eu-central-1), so the image stays stateless.
FROM node:22-alpine

# Prisma needs OpenSSL.
RUN apk add --no-cache openssl

WORKDIR /app
ENV NODE_ENV=production
EXPOSE 3000

# Dependencies first so Docker can cache them. npm 11 blocks lifecycle scripts by default,
# hence the explicit rebuild of the packages that need one.
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --ignore-scripts \
  && npm rebuild @prisma/client prisma @prisma/engines esbuild \
  && npm cache clean --force

COPY . .
RUN npx prisma generate && npm run build

# docker-start runs `prisma migrate deploy` first, so a deploy also applies pending migrations.
CMD ["npm", "run", "docker-start"]
