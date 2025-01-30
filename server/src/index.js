import dotenv from "dotenv";
import express, { json } from "express";
import cors from "cors";
import sequelize from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import "./models/index.js";

const app = express();
const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
    console.log("Banco de dados conectado!");
});

dotenv.config();

app.use(cors());
app.use(json());

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
