FROM node:20-slim

WORKDIR /app

# Dependencias del sistema para Prisma/OpenSSL
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .

# Ensure entrypoint script is available in PATH and executable
COPY scripts/entrypoint.sh /usr/local/bin/igloo-entrypoint.sh
RUN chmod +x /usr/local/bin/igloo-entrypoint.sh

RUN npx prisma generate || true && npm run build || true

EXPOSE 4000

ENTRYPOINT ["/usr/local/bin/igloo-entrypoint.sh"]
CMD ["npm", "run", "dev"]


