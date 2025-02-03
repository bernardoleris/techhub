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
    const userRole = req.user.role; 

    let products;
    
    if (userRole === "fornecedor") {
      products = await Product.findAll({
        where: { supplierId: req.user.id, isActive: true },
      });
    } else {
      products = await Product.findAll({
        where: { isActive: true },
      });
    }

    res.json(products);
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    res.status(500).json({ error: "Erro ao listar produtos" });
  }
};


const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, stock } = req.body;

    if (price === undefined && stock === undefined) {
      return res.status(400).json({ error: "Nenhum campo fornecido para atualização" });
    }

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;

    await product.save();

    res.status(200).json(product);
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    res.status(500).json({ error: "Erro ao atualizar produto", details: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    try {
      await product.destroy();
      return res.status(200).json({ message: "Produto excluído com sucesso" });
    } catch (error) {
      if (error.name === "SequelizeForeignKeyConstraintError") {
        console.warn(`Produto ID ${id} não pode ser excluído devido a pedidos existentes. Desativando...`);
        product.isActive = false;
        await product.save();
        return res.status(200).json({ message: "Produto não pode ser excluído, foi desativado." });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error("Erro ao excluir/desativar produto:", error);
    res.status(500).json({ error: "Erro ao excluir/desativar produto", details: error.message });
  }
};

export default { createProduct, getAllProducts, updateProduct, deleteProduct };
