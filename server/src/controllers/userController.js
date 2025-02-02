import pkg from 'bcryptjs';
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const { sign } = jwt;
const { hash, compare } = pkg;

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      console.error("🚨 Campos obrigatórios ausentes:", req.body);
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      console.error("🚨 E-mail já cadastrado:", email);
      return res.status(400).json({ error: "E-mail já registrado" });
    }

    const hashedPassword = await hash(password, 10);
    
    // 🔹 Verificar se o role é válido antes de salvar
    if (role !== "fornecedor" && role !== "cliente") {
      console.error("🚨 Role inválido:", role);
      return res.status(400).json({ error: "Role inválido. Deve ser 'fornecedor' ou 'cliente'." });
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    console.log("✅ Usuário criado com sucesso:", user);

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: "Usuário registrado com sucesso",
    });

  } catch (error) {
    console.error("🚨 Erro ao registrar usuário:", error);
    res.status(500).json({ error: "Erro ao registrar usuário", details: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await compare(password, user.password))) {
      console.error("🚨 Tentativa de login falhou:", email);
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ Usuário autenticado:", user.email);

    res.json({ token, user });
  } catch (error) {
    console.error("🚨 Erro ao realizar login:", error);
    res.status(500).json({ error: "Erro ao realizar login", details: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll(); 
    console.log("✅ Usuários encontrados:", users.length);
    res.json(users);
  } catch (error) {
    console.error("🚨 Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro ao buscar usuários", details: error.message });
  }
};
