# Etapa 1: Build (compila o TypeScript)
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# Etapa 2: Produção (roda o JS compilado)
FROM node:20-slim

WORKDIR /app

# Copia só o que foi necessário do builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

# Carrega variáveis de ambiente, se necessário
# COPY .env ./

EXPOSE 3000

CMD ["node", "dist/main.js"]
