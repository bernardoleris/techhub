import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token não fornecido ou inválido" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado ou conta excluída" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};


export const isFornecedor = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  if (req.user.role !== "fornecedor") {
    return res.status(403).json({ error: "Acesso negado. Apenas fornecedores podem executar esta ação." });
  }

  next();
};

export const isCliente = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Usuário não autenticado" });
  }

  if (req.user.role !== "cliente") {
    return res.status(403).json({ error: "Acesso negado. Apenas clientes podem executar esta ação." });
  }

  next();
};
