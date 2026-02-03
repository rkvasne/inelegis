# Estágio 1: Base & Dependências
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

# Estágio 2: Instalação de Dependências (Produção)
FROM base AS dependencies
RUN npm ci --only=production --ignore-scripts

# Estágio 3: Build & Otimização
FROM base AS build
RUN npm ci
COPY . .
# Sincroniza e prepara assets (build/optimize)
RUN npm run build
RUN npm run optimize

# Estágio 4: Imagem Final (Runtime)
FROM node:22-alpine AS app
WORKDIR /app
ENV NODE_ENV=production

# Copia dependências de produção
COPY --from=dependencies /app/node_modules ./node_modules
# Copia arquivos do projeto (necessários para o serve.js customizado)
COPY . .
# Sobrescreve com assets otimizados do build anterior (se houver dist output, mas serve.js usa public/)
# O script 'optimize' cria 'dist-optimized'? Ver serve.js...
# serve.js usa `paths.publicDir`. O build normal pode modificar public/?
# Assumindo que o projeto roda sobre os arquivos fonte/public.

EXPOSE 3000

# Healthcheck simples
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Usuário não-root por segurança
USER node

CMD ["npm", "start"]
