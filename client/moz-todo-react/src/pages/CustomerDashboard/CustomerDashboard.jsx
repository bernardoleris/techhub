import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, Card, CardContent, Typography, Button, Select, MenuItem 
} from "@mui/material";
import CustomButton from "../../components/CustomButton";
import "./CustomerDashboard.css"; 

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/user/${localStorage.getItem("userId")}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erro ao buscar pedidos");
      setOrders(data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  };

  const handleAddToCart = (product) => {
    setErrorMessage("");
    setCart([...cart, { ...product, quantity: 1 }]);
  };

  const handleRemoveFromCart = (productId) => {
    setErrorMessage("");
    setCart(cart.filter((item) => item.id !== productId));
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("userId"); 
    localStorage.removeItem("role"); 
    navigate("/login");
  };

  const handleFinalizeOrder = async () => {
    setErrorMessage(""); 
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"),
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          alert("Sessão expirada. Faça login novamente.");
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("role");
          navigate("/login");
        } else if (response.status === 400 && data.message.includes("estoque insuficiente")) {
          setErrorMessage(data.message);
        } else {
          throw new Error(data.message || "Erro ao finalizar pedido");
        }
        return;
      }

      setSuccessMessage("Pedido finalizado com sucesso!");
      setCart([]);
      fetchOrders(); 
    } catch (err) {
      console.error("Erro ao finalizar pedido:", err);
    }
  };

  return (
    <div className="customer-dashboard-wrapper">
      <Box className="customer-dashboard-container">
        <Box className="customer-header">
          <div className="techhub-logo">TechHub.</div>
          <Button onClick={handleLogout} variant="contained" color="error">
            Sair
          </Button>
        </Box>

        <h1>Painel do Cliente</h1>

        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2 }}>
          {products.length === 0 ? (
            <Typography variant="h6">Nenhum produto disponível no momento</Typography>
          ) : (
            products.map((product) => (
              <Card key={product.id} className="product-card">
                <CardContent>
                  <Typography variant="h6"><strong>{product.name}</strong></Typography>
                  <Typography>Preço: R$ {product.price}</Typography>
                  <Button className="add-product-button" variant="contained" onClick={() => handleAddToCart(product)}>
                    Adicionar ao Pedido
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </Box>

        <Box className="order-summary">
          <h2>Resumo do Pedido</h2>

          {cart.length === 0 ? (
            <Typography variant="body1">Seu carrinho está vazio</Typography>
          ) : (
            cart.map((item, index) => (
              <Box key={index} className="order-item">
                <Typography><strong>{item.name}</strong> - R$ {item.price}</Typography>
                <div className="cart-controls">
                  <Select
                    className="order-select"
                    value={item.quantity}
                    onChange={(e) => {
                      const updatedCart = [...cart];
                      updatedCart[index].quantity = e.target.value;
                      setCart(updatedCart);
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((q) => (
                      <MenuItem key={q} value={q}>{q}</MenuItem>
                    ))}
                  </Select>

                  <Button sx={{ backgroundColor: "red", color: "white", "&:hover": { backgroundColor: "darkred" } }}
                    className="remove-item-button"
                    onClick={() => handleRemoveFromCart(item.id)}
                  >
                    Remover
                  </Button>
                </div>
              </Box>
            ))
          )}

          {errorMessage && (
            <Typography className="error-message" color="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Typography>
          )}

          {successMessage && (
            <Typography className="success-message" color="success" sx={{ mt: 2 }}>
              {successMessage}
            </Typography>
          )}

          {cart.length > 0 && (
            <CustomButton className="finalize-order-button" onClick={handleFinalizeOrder}>
              Finalizar Pedido
            </CustomButton>
          )}
        </Box>

        <Box className="order-history">
          <h2>Seus Pedidos</h2>
          {orders.length === 0 ? (
            <Typography variant="body1">Você ainda não fez nenhum pedido.</Typography>
          ) : (
            orders.map((order, index) => (
              <Box key={index} className="order-card">
                <Typography>
                  <strong>Pedido #{order.id}</strong> - Status: {order.status} - Total: R$ {order.totalAmount.toFixed(2)}
                </Typography>
                <Box className="order-items">
                  {order.OrderItems.map((item, i) => (
                    <Typography key={i}>
                      {item.Product.name} - {item.quantity}x - R$ {item.price.toFixed(2)}
                    </Typography>
                  ))}
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Box>
    </div>
  );
};

export default CustomerDashboard;
