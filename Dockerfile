FROM node:20-alpine

WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar arquivos de dependências primeiro (para melhor cache)
COPY package.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar código fonte
COPY . .

# Expor a porta da aplicação
EXPOSE 8000

# Comando para iniciar a aplicação
CMD ["pnpm", "start"]
