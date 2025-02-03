import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { sequelize } from "./config/database.js"; // Corrigido para importação correta
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import "./models/index.js"; // Certifique-se de que os modelos estão sendo carregados corretamente

dotenv.config(); // Carregar variáveis de ambiente antes de usá-las

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // json() já está dentro de express

// Rotas
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Conectar ao banco e iniciar o servidor
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Banco de dados conectado com sucesso!");

    await sequelize.sync(); // Garante que todas as tabelas existam antes de iniciar

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao conectar ao banco de dados:", error);
    process.exit(1); // Encerra a aplicação se a conexão falhar
  }
})();
