import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import Product from "../models/Product.js";

const createOrder = async (req, res) => {
  try {
    const { userId, items } = req.body;

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ message: "Produto indisponível ou estoque insuficiente" });
      }

      // Calcular total do pedido
      totalAmount += product.price * item.quantity;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });

      // Atualizar estoque
      product.stock -= item.quantity;
      await product.save();
    }

    // Criar o pedido
    const order = await Order.create({ userId, totalAmount });

    // Adicionar itens ao pedido
    for (const item of orderItems) {
      await OrderItem.create({ ...item, orderId: order.id });
    }

    res.status(201).json({ message: "Pedido criado com sucesso!", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar pedido" });
  }
};

const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.findAll({ where: { userId }, include: OrderItem });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar pedidos" });
  }
};

export default { createOrder, getOrdersByUser };
