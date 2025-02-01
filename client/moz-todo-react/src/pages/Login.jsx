import { useState } from "react";
import Box from "@mui/material/Box";
import CustomTextField from "../components/CustomTextField"; 
import CustomButton from "../components/CustomButton";
import { Link, useNavigate } from "react-router-dom"; 
import { loginUser } from "../services/userService.js"; 
import "../styles/Login.css"; 

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const data = await loginUser(formData);

      if (!data.token) {
        throw new Error("Erro ao obter token de autenticação.");
      }

      localStorage.setItem("token", data.token);

      setSuccess("Login realizado com sucesso!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-big-container">
      <Box className="login-container">
        <div className="techhub-logo">TechHub.</div>
        <div className="login-text">Bem-vindo de volta! Faça login para continuar:</div>
        <Box component="form" onSubmit={handleSubmit} className="login-form">
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
          <CustomButton type="submit" className="login-button">
            Entrar
          </CustomButton>
        </Box>
        <div className="register-link">
          Ainda não tem uma conta? <Link to="/register">Registre-se</Link>
        </div>
        {error && <p className="login-error">{error}</p>}
        {success && <p className="login-success">{success}</p>}
      </Box>
    </div>
  );
};

export default Login;
