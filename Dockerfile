# Build the client
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY package-lock.json ./
RUN npm ci
COPY . ./
RUN npm run build

# Production image
FROM node:20-alpine AS runtime
WORKDIR /app
COPY package*.json ./
COPY package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/uploads ./uploads
COPY --from=build /app/public ./public

ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "server/index.js"]
