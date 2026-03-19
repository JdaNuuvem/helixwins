FROM node:20-alpine

WORKDIR /app

# Copiar package files e instalar dependências
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copiar código da aplicação
COPY . .

# Remover arquivos desnecessários
RUN rm -f .env .env.local database.json

# Criar database.json vazio se não existir (será criado na primeira execução)
RUN echo '{}' > /dev/null

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=8888

EXPOSE 8888

HEALTHCHECK NONE

CMD ["node", "server.js"]
# force rebuild
