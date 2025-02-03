import { sequelize } from "../config/database.js"; 
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  const transaction = await sequelize.transaction(); 

  try {
    const { userId, items } = req.body;
    console.log("Recebendo dados:", { userId, items }); 

    if (!userId || !items || items.length === 0) {
      console.error("Erro: userId ou items inválidos");
      return res.status(400).json({ message: "Dados inválidos para criar pedido" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      console.log(`🔹 Buscando produto ID ${item.productId} no banco...`); 
      const product = await Product.findByPk(item.productId, { transaction });

      if (!product) {
        await transaction.rollback();
        console.error(`Produto ${item.productId} não encontrado`);
        return res.status(400).json({ message: `Produto ${item.productId} não encontrado` });
      }

      if (product.stock < item.quantity) {
        await transaction.rollback();
        console.error(`Estoque insuficiente para o produto ${product.id}`);
        return res.status(400).json({ message: `Produto ${product.name} indisponível ou estoque insuficiente` });
      }

      totalAmount += product.price * item.quantity;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });

      product.stock -= item.quantity;
      await product.save({ transaction });
      console.log(`Estoque atualizado para o produto ${product.id}: ${product.stock}`); 
    }

    console.log("Criando pedido no banco..."); 
    const order = await Order.create({ userId, totalAmount, status: "concluído" }, { transaction });
    console.log("Pedido criado com sucesso, ID:", order.id);

    for (const item of orderItems) {
      console.log(`Adicionando item ao pedido ID ${order.id}...`); 
      await OrderItem.create({ ...item, orderId: order.id }, { transaction });
    }

    await transaction.commit(); 
    console.log("Pedido finalizado com sucesso!"); 

    res.status(201).json({ message: "Pedido concluído com sucesso!", order });

  } catch (error) {
    await transaction.rollback();
    console.error("Erro ao criar pedido:", error);
    res.status(500).json({ message: "Erro ao criar pedido", error: error.message });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ["name", "price"] }],
        },
      ],
    });

    if (!orders.length) {
      return res.status(404).json({ message: "Nenhum pedido encontrado para este usuário" });
    }

    res.json(orders);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    res.status(500).json({ message: "Erro ao buscar pedidos" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Status do pedido atualizado", order });
  } catch (error) {
    console.error("Erro ao atualizar status do pedido:", error);
    res.status(500).json({ message: "Erro ao atualizar status do pedido" });
  }
};

export const cancelOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId, {
      include: { model: OrderItem }, 
      transaction,
    });

    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    if (order.status !== "pendente") {
      return res.status(400).json({ message: "Apenas pedidos pendentes podem ser cancelados" });
    }

    for (const item of order.OrderItems || []) { 
      const product = await Product.findByPk(item.productId, { transaction });
      if (product) {
        product.stock += item.quantity;
        await product.save({ transaction });
      }
    }

    await OrderItem.destroy({ where: { orderId }, transaction }); 
    await order.destroy({ transaction });

    await transaction.commit();
    res.json({ message: "Pedido cancelado com sucesso" });

  } catch (error) {
    await transaction.rollback();
    console.error("Erro ao cancelar pedido:", error);
    res.status(500).json({ message: "Erro ao cancelar pedido" });
  }
};
