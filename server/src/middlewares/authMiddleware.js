import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token não fornecido" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);

    if (!req.user) return res.status(401).json({ error: "Usuário não encontrado" });

    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido ou expirado" });
  }
};

export const isFornecedor = (req, res, next) => {
  if (req.user.role !== "fornecedor") {
    return res.status(403).json({ error: "Acesso negado. Apenas fornecedores podem executar esta ação." });
  }
  next();
};

export const isCliente = (req, res, next) => {
  if (req.user.role !== "cliente") {
    return res.status(403).json({ error: "Acesso negado. Apenas clientes podem executar esta ação." });
  }
  next();
};
