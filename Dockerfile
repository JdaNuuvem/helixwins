FROM node:20-alpine

WORKDIR /app

# Copiar package files e instalar dependências
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copiar código da aplicação
COPY . .

# Remover arquivos desnecessários
RUN rm -f .env .env.local database.json

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=8888

EXPOSE 8888

CMD ["node", "server.js"]
