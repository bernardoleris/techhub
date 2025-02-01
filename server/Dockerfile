# Usa uma imagem do Node.js
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos do backend para dentro do container
COPY package.json package-lock.json ./
RUN npm install

# Copia o restante do código para dentro do container
COPY . .

# Expõe a porta do backend
EXPOSE 5000

# Comando para rodar o servidor
CMD ["npm", "run", "dev"]
