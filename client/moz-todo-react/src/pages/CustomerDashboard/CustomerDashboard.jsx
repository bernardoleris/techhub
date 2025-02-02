import { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Button, Select, MenuItem } from "@mui/material";
import CustomButton from "../../components/CustomButton";

const CustomerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Buscar produtos cadastrados
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProducts();
  }, []);

  // Adicionar produto ao carrinho
  const handleAddToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1 }]);
  };

  return (
    <Box sx={{ width: "80%", margin: "auto", textAlign: "center", mt: 4 }}>
      <h1>Customer Dashboard</h1>

      {/* Lista de Produtos */}
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2 }}>
        {products.map((product) => (
          <Card key={product.id} sx={{ width: 250, textAlign: "left", p: 2 }}>
            <CardContent>
              <Typography variant="h6"><strong>{product.name}</strong></Typography>
              <Typography>Preço: R$ {product.price}</Typography>
              <Typography>Características: {product.features}</Typography>
              <Button variant="contained" sx={{ mt: 2 }} onClick={() => handleAddToCart(product)}>
                Adicionar ao Pedido
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Resumo do Pedido */}
      <Box sx={{ mt: 4, p: 3, border: "1px solid gray", borderRadius: 2 }}>
        <h2>Resumo do Pedido</h2>
        {cart.length === 0 ? (
          <p>Seu carrinho está vazio</p>
        ) : (
          cart.map((item, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography><strong>{item.name}</strong> - R$ {item.price}</Typography>
              <Select
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
            </Box>
          ))
        )}
        {cart.length > 0 && <CustomButton>Finalizar Pedido</CustomButton>}
      </Box>
    </Box>
  );
};

export default CustomerDashboard;
