import { useState } from "react";
import Box from "@mui/material/Box";
import CustomTextField from "../../components/CustomTextField.jsx"; 
import CustomButton from "../../components/CustomButton.jsx";
import { Link, useNavigate } from "react-router-dom"; 
import { loginUser } from "../../services/userService.js"; 
import "./Login.css"; 

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
  
      if (!data.token || !data.user || !data.user.role) {
        throw new Error("Erro ao obter autenticação.");
      }
  
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
  
      console.log("Role salvo no localStorage:", localStorage.getItem("role")); 
  
      setSuccess("Login realizado com sucesso!");
  
      setTimeout(() => {
        if (data.user.role === "fornecedor") {
          navigate("/supplier-dashboard");
        } else {
          navigate("/customer-dashboard");
        }
      }, 1000);
  
    } catch (err) {
      console.error("Erro no login:", err);
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
