FROM node:22-alpine
RUN apk add --no-cache openssl

EXPOSE 3000
WORKDIR /app

ENV NODE_ENV=production
# SQLite lives on the mounted volume (see fly.toml [mounts]).
ENV DATABASE_URL=file:/data/prod.sqlite

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --ignore-scripts && npm rebuild @prisma/client prisma @prisma/engines esbuild && npm cache clean --force

COPY . .
RUN npx prisma generate && npm run build

CMD ["npm", "run", "docker-start"]
