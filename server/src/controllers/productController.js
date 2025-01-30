import Product from "../models/Product.js";

const createProduct = async (req, res) => {
  try {
    const { name, price, stock, supplierId } = req.body;
    const product = await Product.create({ name, price, stock, supplierId });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar produto" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar produtos" });
  }
};

export default { createProduct, getAllProducts };
