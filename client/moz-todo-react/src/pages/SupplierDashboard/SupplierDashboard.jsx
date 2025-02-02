import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, 
  TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper 
} from "@mui/material";
import CustomButton from "../../components/CustomButton";

const SupplierDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "" });

  const supplierId = localStorage.getItem("userId") ? parseInt(localStorage.getItem("userId")) : null;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Erro ao buscar produtos");

        setProducts(data); 
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
      }
    };

    fetchProducts();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setNewProduct({ name: "", price: "", stock: "" });
    setOpen(false);
  };

  const handleChange = (e) => setNewProduct({ ...newProduct, [e.target.name]: e.target.value });

  const handleAddProduct = async () => {
    console.log("🔹 Enviando produto:", newProduct);

    if (!newProduct.name.trim() || !newProduct.price.trim() || supplierId === null) {
      console.error("Erro: Todos os campos são obrigatórios.");
      alert("Preencha todos os campos antes de adicionar um produto!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newProduct.name.trim(),
          price: parseFloat(newProduct.price) || 0, 
          stock: parseInt(newProduct.stock) || 0, 
          supplierId: supplierId,  
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro ao cadastrar produto");

      setProducts([...products, data]);
      handleClose();
    } catch (err) {
      console.error("Erro ao cadastrar produto:", err);
    }
  };

  return (
    <Box sx={{ width: "80%", margin: "auto", textAlign: "center", mt: 4 }}>
      <h1>Supplier Dashboard</h1>
      <CustomButton onClick={handleOpen}>Adicionar Produto</CustomButton>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Nome</strong></TableCell>
              <TableCell><strong>Preço</strong></TableCell>
              <TableCell><strong>Estoque</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.name}</TableCell>
                <TableCell>R$ {parseFloat(product.price).toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Adicionar Produto</DialogTitle>
        <DialogContent>
          <TextField 
            fullWidth label="Nome" name="name" 
            value={newProduct.name} onChange={handleChange} sx={{ mb: 2 }} 
          />
          <TextField 
            fullWidth label="Preço" name="price" type="number" 
            value={newProduct.price} onChange={handleChange} sx={{ mb: 2 }} 
          />
          <TextField 
            fullWidth label="Estoque" name="stock" type="number" 
            value={newProduct.stock} onChange={handleChange} sx={{ mb: 2 }} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancelar</Button>
          <Button onClick={handleAddProduct} variant="contained">Adicionar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SupplierDashboard;
