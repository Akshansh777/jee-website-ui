FROM node:18-slim

# ----------------------------------------------------
# Install Chromium (Cloud Run Safe Build)
# ----------------------------------------------------
RUN apt-get update \
 && apt-get install -y wget gnupg ca-certificates \
 && apt-get install -y \
    chromium \
    chromium-driver \
    fonts-liberation \
    libnss3 \
    libxss1 \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libx11-xcb1 \
 && rm -rf /var/lib/apt/lists/*

# ----------------------------------------------------
# App Setup
# ----------------------------------------------------
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

# ----------------------------------------------------
# Puppeteer ENV Fix
# ----------------------------------------------------
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# ----------------------------------------------------
# Cloud Run Port
# ----------------------------------------------------
ENV PORT=3001
EXPOSE 3001

CMD ["node", "index.js"]
