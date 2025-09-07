FROM node:20-slim

WORKDIR /app

# Dependencias del sistema para Prisma/OpenSSL
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate || true && npm run build || true

EXPOSE 4000

CMD ["npm", "run", "dev"]


