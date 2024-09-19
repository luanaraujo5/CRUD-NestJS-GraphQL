# Meu primeiro Dockerfile

# 1. Usa a imagem base do Node
FROM node:18 AS builder

# 2. Define o diretório de trabalho dentro do container
WORKDIR /app

# 3. Copia o package.json e o package-lock.json para o container
COPY package*.json ./

# 4. Instala as dependências do projeto
RUN npm install

# 5. Rebuild para garantir que módulos nativos sejam recompilados corretamente
RUN npm rebuild bcrypt --build-from-source

# 6. Copia o código fonte para dentro do container
COPY . .

# 7. Build do projeto
RUN npm run build

# 8. Usa uma imagem limpa para a aplicação final
FROM node:18 AS app

# 9. Define o diretório de trabalho
WORKDIR /app

# 10. Copia as dependências do builder para a imagem final
COPY --from=builder /app/node_modules ./node_modules

# 11. Copia o código compilado
COPY --from=builder /app/dist ./dist

# 12. Copia os arquivos de configuração
COPY --from=builder /app/package*.json ./

# 13. Inicia a aplicação
CMD ["node", "dist/main.js"]
