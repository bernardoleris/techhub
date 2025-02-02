import Product from "../models/Product.js";

const createProduct = async (req, res) => {
  try {
    const { name, price, stock, supplierId } = req.body;

    if (!name || !price || stock === undefined || !supplierId) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    console.log("Criando produto com:", { name, price, stock, supplierId });

    const product = await Product.create({ name, price, stock, supplierId });

    console.log("Produto criado com sucesso:", product);

    res.status(201).json(product);
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).json({ error: "Erro ao criar produto", details: error.message });
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
