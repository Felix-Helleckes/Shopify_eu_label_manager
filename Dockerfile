# EU Compliance Suite – production image (Fly.io, region fra / Frankfurt).
# The database is external (Supabase, eu-central-1), so the image stays stateless.
#
# Two stages: the build needs the dev dependencies (vite, typescript), the runtime does not.
# npm is pinned to the major version that produced package-lock.json; node:22-alpine still
# ships npm 10, which rejects a lockfile written by npm 11.

FROM node:22-alpine AS base
RUN apk add --no-cache openssl
WORKDIR /app
RUN npm i -g npm@11 --silent

# ---------- build ----------
FROM base AS build
ENV NODE_ENV=development
COPY package.json package-lock.json* ./
# npm 11 blocks lifecycle scripts by default, so the packages that need one are rebuilt explicitly.
RUN npm ci --ignore-scripts \
  && npm rebuild @prisma/client prisma @prisma/engines esbuild
COPY . .
RUN npx prisma generate && npm run build

# ---------- runtime ----------
FROM base AS runtime
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --ignore-scripts \
  && npm rebuild @prisma/client prisma @prisma/engines \
  && npm cache clean --force
COPY prisma ./prisma
COPY --from=build /app/build ./build

# docker-start runs `prisma migrate deploy` first, so a deploy also applies pending migrations.
CMD ["npm", "run", "docker-start"]
