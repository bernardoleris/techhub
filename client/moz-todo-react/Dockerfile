# Usa uma imagem do Node.js
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos do frontend para dentro do container
COPY package.json package-lock.json ./
RUN npm install

# Copia o restante do código para dentro do container
COPY . .

# Expõe a porta do frontend
EXPOSE 3000

# Comando para rodar o React
CMD ["npm", "run", "dev"]
