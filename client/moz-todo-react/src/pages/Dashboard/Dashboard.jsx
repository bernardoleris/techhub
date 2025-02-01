import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login"); 
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, 
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Erro ao buscar dados do usuário");
        }

        setUser(data);
      } catch (err) {
        console.error(err);
        navigate("/login"); 
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/login"); 
  };

  return (
    <div className="dashboard-container">
      <Box className="dashboard-box">
        <h1>Bem-vindo ao Dashboard</h1>
        {user ? (
          <p>Olá, <strong>{user.name}</strong>! Seu email é {user.email}.</p>
        ) : (
          <p>Carregando informações do usuário...</p>
        )}
        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
          sx={{
            marginTop: "20px",
            padding: "10px 20px",
            fontWeight: "bold",
            borderRadius: "8px",
            backgroundColor: "#d32f2f",
            "&:hover": {
              backgroundColor: "#b71c1c",
            },
          }}
        >
          Sair
        </Button>
      </Box>
    </div>
  );
};

export default Dashboard;
