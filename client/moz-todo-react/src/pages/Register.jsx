import { useState } from "react";
import Box from "@mui/material/Box";
import CustomTextField from "../components/CustomTextField"; 
import CustomButton from "../components/CustomButton";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom"; 
import "../styles/Register.css";
import { registerUser } from "../services/userService.js";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "cliente",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const data = await registerUser(formData);

      setSuccess("Usuário registrado com sucesso!");
      console.log("Usuário registrado:", data);

      setFormData({ name: "", email: "", password: "", role: "cliente" });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-big-container">
      <Box className="register-container">
        <div className="techhub-logo">TechHub.</div>
        <div className="register-text">Seja bem-vindo! Faça o registro para continuar:</div>
        <Box component="form" onSubmit={handleSubmit} className="register-form">
          <CustomTextField
            required
            name="name"
            label="Nome"
            value={formData.name}
            onChange={handleChange}
          />
          <CustomTextField
            required
            type="email"
            name="email"
            label="E-mail"
            value={formData.email}
            onChange={handleChange}
          />
          <CustomTextField
            required
            type="password"
            name="password"
            label="Senha"
            value={formData.password}
            onChange={handleChange}
          />
          <CustomTextField
            select
            name="role"
            label="Função"
            value={formData.role}
            onChange={handleChange}
          >
            <MenuItem value="cliente">Cliente</MenuItem>
            <MenuItem value="fornecedor">Fornecedor</MenuItem>
          </CustomTextField>
          <CustomButton type="submit" className="register-button">
            Registrar
          </CustomButton>
        </Box>
        <div className="login-link">
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </div>
        {error && <p className="register-error">{error}</p>}
        {success && <p className="register-success">{success}</p>}
      </Box>
    </div>
  );
};

export default Register;
