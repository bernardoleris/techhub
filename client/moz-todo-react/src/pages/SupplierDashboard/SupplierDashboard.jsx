import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import CustomButton from "../../components/CustomButton";
import "./SupplierDashboard.css";

const SupplierDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "" });
  const [editProduct, setEditProduct] = useState(null);

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
    if (!newProduct.name.trim() || !newProduct.price.trim() || supplierId === null) {
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

  const handleOpenEdit = (product) => {
    setEditProduct(product);
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditProduct(null);
    setEditOpen(false);
  };

  const handleEditProduct = async () => {
    if (!editProduct.price || !editProduct.stock) {
      alert("Preencha todos os campos antes de salvar!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${editProduct.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: parseFloat(editProduct.price),
          stock: parseInt(editProduct.stock),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erro ao editar produto");

      setProducts((prev) =>
        prev.map((product) =>
          product.id === editProduct.id ? { ...product, ...data } : product
        )
      );
      handleCloseEdit();
    } catch (err) {
      console.error("Erro ao editar produto:", err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao excluir produto");

      setProducts((prev) => prev.filter((product) => product.id !== productId));
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="supplier-all-dashboard">
      <Box className="supplier-dashboard-container">
        <Box className="supplier-header">
          <div className="techhub-logo">TechHub.</div>
          <Button onClick={handleLogout} variant="contained" color="error">
            Sair
          </Button>
        </Box>

        <h1>Painel do Fornecedor</h1>
        <CustomButton className="add-product-button" onClick={handleOpen}>
          Adicionar Produto
        </CustomButton>

        <TableContainer component={Paper} className="product-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nome</strong></TableCell>
                <TableCell><strong>Preço</strong></TableCell>
                <TableCell><strong>Estoque</strong></TableCell>
                <TableCell><strong>Ações</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>R$ {parseFloat(product.price).toFixed(2)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleOpenEdit(product)}
                      variant="contained"
                      color="primary"
                      sx={{ marginRight: 1 }}
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDeleteProduct(product.id)}
                      variant="contained"
                      color="error"
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose}>
          <div className="add-product-text">Adicione um produto:</div>
          <DialogContent>
            <TextField
              fullWidth
              label="Nome"
              name="name"
              value={newProduct.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Preço"
              name="price"
              type="number"
              value={newProduct.price}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Estoque"
              name="stock"
              type="number"
              value={newProduct.stock}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} className="cancel-button">
              Cancelar
            </Button>
            <Button onClick={handleAddProduct} variant="contained" className="submit-button">
              Adicionar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={editOpen} onClose={handleCloseEdit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Preço"
              name="price"
              type="number"
              value={editProduct?.price || ""}
              onChange={(e) =>
                setEditProduct((prev) => ({ ...prev, price: e.target.value }))
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Estoque"
              name="stock"
              type="number"
              value={editProduct?.stock || ""}
              onChange={(e) =>
                setEditProduct((prev) => ({ ...prev, stock: e.target.value }))
              }
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit} color="secondary" sx={{ backgroundColor: "red", color: "white", "&:hover": { backgroundColor: "darkred" } }}>
              Cancelar
            </Button>
            <Button onClick={handleEditProduct} variant="contained">
              Salvar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
};

export default SupplierDashboard;
