import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Order = sequelize.define("Order", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false }, // Cliente que fez o pedido
  totalAmount: { type: DataTypes.FLOAT, allowNull: false }, // Valor total
  status: { 
    type: DataTypes.ENUM("pendente", "processando", "concluído"),
    defaultValue: "pendente"
  },
});

export default Order;
