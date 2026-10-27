const Order = require('../models/Order');
const Resource = require('../models/Resource');

// @desc    Create new agricultural order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'No items in order cart',
      });
    }

    if (!shippingAddress?.fullName || !shippingAddress?.phone || !shippingAddress?.district || !shippingAddress?.state) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full recipient name, phone, district, and state',
      });
    }

    // Calculate total & verify stock
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const resourceRecord = await Resource.findById(item.resourceId || item.resource);
      if (!resourceRecord) {
        return res.status(404).json({
          success: false,
          message: `Resource item ${item.name || item.resourceId} not found`,
        });
      }

      if (resourceRecord.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${resourceRecord.name}. Only ${resourceRecord.stockQuantity} remaining.`,
        });
      }

      const itemTotal = resourceRecord.price * item.quantity;
      totalAmount += itemTotal;

      validatedItems.push({
        resource: resourceRecord._id,
        name: resourceRecord.name,
        quantity: item.quantity,
        price: resourceRecord.price,
        unit: resourceRecord.unit,
      });

      // Deduct stock
      resourceRecord.stockQuantity -= item.quantity;
      await resourceRecord.save();
    }

    const order = await Order.create({
      farmer: req.user._id,
      items: validatedItems,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: paymentMethod === 'Direct UPI / NetBanking (Test Sandbox)' ? 'Completed' : 'Pending',
      orderStatus: 'Placed',
      statusTimeline: [{
        status: 'Placed',
        timestamp: new Date(),
        notes: 'Order received and logged in system',
      }],
    });

    res.status(201).json({
      success: true,
      message: 'Agricultural resource order placed successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in farmer's orders (or all if admin)
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      query.farmer = req.user._id;
    }

    const orders = await Order.find(query)
      .populate('farmer', 'name email phone location')
      .populate('items.resource', 'name category imageUrl')
      .sort({ orderDate: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('farmer', 'name email phone location')
      .populate('items.resource', 'name category brand imageUrl');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && order.farmer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this order' });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order tracking status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private / Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, notes } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    if (orderStatus === 'Delivered') {
      order.paymentStatus = 'Completed';
    }

    order.statusTimeline.push({
      status: orderStatus,
      timestamp: new Date(),
      notes: notes || `Order status updated to ${orderStatus}`,
    });

    await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${orderStatus}`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };

