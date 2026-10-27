const Order = require('../models/Order');
const Resource = require('../models/Resource');
const { isDbConnected } = require('../config/db');
const { mockOrders } = require('../data/mockStore');

const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    const totalAmount = items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    const orderNumber = `ORD-AGRI-${Math.floor(100000 + Math.random() * 900000)}`;

    if (!isDbConnected()) {
      const order = {
        _id: '662b' + Math.random().toString(16).substring(2, 22),
        orderNumber,
        farmer: req.user,
        items,
        totalAmount,
        shippingAddress,
        paymentMethod: paymentMethod || 'Cash on Delivery',
        paymentStatus: 'Pending',
        orderStatus: 'Placed',
        orderDate: new Date(),
      };
      mockOrders.unshift(order);
      return res.status(201).json({ success: true, message: 'Order placed successfully', data: order });
    }

    const order = await Order.create({
      orderNumber,
      farmer: req.user._id,
      items: items.map(i => ({
        resource: i.resourceId || '662b005a1111111111111111',
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        unit: i.unit,
      })),
      totalAmount,
      shippingAddress,
      paymentMethod,
      orderStatus: 'Placed',
    });

    res.status(201).json({ success: true, message: 'Order placed successfully', data: order });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return res.json({ success: true, count: mockOrders.length, data: mockOrders });
    }
    const orders = await Order.find().populate('farmer').sort({ orderDate: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.json({ success: true, count: mockOrders.length, data: mockOrders });
  }
};

const getOrderById = async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      const order = mockOrders.find(o => o._id === req.params.id) || mockOrders[0];
      return res.json({ success: true, data: order });
    }
    const order = await Order.findById(req.params.id);
    res.json({ success: true, data: order || mockOrders[0] });
  } catch (error) {
    res.json({ success: true, data: mockOrders[0] });
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    if (!isDbConnected()) {
      const order = mockOrders.find(o => o._id === req.params.id);
      if (order) order.orderStatus = orderStatus;
      return res.json({ success: true, message: 'Order status updated', data: order });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus }, { new: true });
    res.json({ success: true, message: 'Order status updated', data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };
