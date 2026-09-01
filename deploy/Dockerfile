FROM node:22-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY dist ./dist
ENV PORT=8787
EXPOSE 8787
CMD ["node", "dist/index.js", "--http", "--port", "8787"]
