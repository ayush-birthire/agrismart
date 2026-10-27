import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getOrders } from '../services/api';
import { ShoppingBag, Truck, CheckCircle2, Clock, MapPin, PackageCheck, AlertCircle } from 'lucide-react';

const OrderTracking = () => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      setOrders(res.data.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-success text-white';
      case 'Dispatched':
        return 'bg-primary text-white';
      case 'Processing':
        return 'bg-warning text-dark';
      case 'Placed':
        return 'bg-info text-dark';
      default:
        return 'bg-secondary text-white';
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
          <Truck className="text-success" size={28} />
          <span>{t('orders.title')}</span>
        </h2>
        <p className="text-muted small mb-0">{t('orders.subtitle')}</p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <ShoppingBag size={48} className="text-muted opacity-50 mx-auto mb-3" />
          <h5 className="fw-semibold text-dark">No Orders Found</h5>
          <p className="text-muted small">You haven't placed any agricultural input orders yet.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {orders.map((order) => (
            <div key={order._id} className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              {/* Order Top Bar */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center pb-3 border-bottom mb-3 gap-2">
                <div>
                  <span className="text-muted small d-block">Order Reference Number:</span>
                  <strong className="text-dark fs-5">{order.orderNumber}</strong>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <span className="text-muted small">
                    Ordered on: {new Date(order.orderDate).toLocaleDateString()}
                  </span>
                  <span className={`badge px-3 py-2 rounded-pill fw-semibold ${getStatusBadge(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* Visual Shipment Timeline Tracker */}
              <div className="py-2 mb-4">
                <div className="position-relative">
                  <div className="progress" style={{ height: 4 }}>
                    <div
                      className="progress-bar bg-success"
                      style={{
                        width: order.orderStatus === 'Placed' ? '25%'
                          : order.orderStatus === 'Processing' ? '50%'
                          : order.orderStatus === 'Dispatched' ? '75%'
                          : order.orderStatus === 'Delivered' ? '100%'
                          : '15%'
                      }}
                    ></div>
                  </div>

                  <div className="d-flex justify-content-between position-relative text-center small mt-2">
                    <div>
                      <span className={`fw-semibold ${order.orderStatus ? 'text-success' : 'text-muted'}`}>1. Placed</span>
                    </div>
                    <div>
                      <span className={`fw-semibold ${['Processing', 'Dispatched', 'Delivered'].includes(order.orderStatus) ? 'text-success' : 'text-muted'}`}>2. Processing</span>
                    </div>
                    <div>
                      <span className={`fw-semibold ${['Dispatched', 'Delivered'].includes(order.orderStatus) ? 'text-success' : 'text-muted'}`}>3. Dispatched</span>
                    </div>
                    <div>
                      <span className={`fw-semibold ${order.orderStatus === 'Delivered' ? 'text-success' : 'text-muted'}`}>4. Delivered</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items & Shipping Address */}
              <div className="row g-4">
                <div className="col-md-7">
                  <h6 className="fw-bold small text-muted text-uppercase mb-2">Ordered Agricultural Supplies</h6>
                  <div className="d-flex flex-column gap-2">
                    {order.items?.map((item, i) => (
                      <div key={i} className="p-2 bg-light rounded-3 d-flex justify-content-between align-items-center small">
                        <div>
                          <strong className="text-dark">{item.name}</strong>
                          <span className="text-muted d-block">{item.quantity} x ₹{item.price} per {item.unit}</span>
                        </div>
                        <span className="fw-bold text-success">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                    <span className="text-muted small">Total Bill:</span>
                    <h5 className="fw-bold text-dark mb-0">₹{order.totalAmount}</h5>
                  </div>
                </div>

                <div className="col-md-5">
                  <div className="p-3 bg-light rounded-3 h-100">
                    <h6 className="fw-bold small text-muted text-uppercase mb-2 d-flex align-items-center gap-1">
                      <MapPin size={16} className="text-success" />
                      <span>Farm Shipping Destination</span>
                    </h6>
                    <p className="small text-dark mb-1 fw-bold">{order.shippingAddress?.fullName}</p>
                    <p className="small text-muted mb-1">
                      {order.shippingAddress?.address}, {order.shippingAddress?.village ? `${order.shippingAddress.village}, ` : ''}{order.shippingAddress?.district}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                    </p>
                    <p className="small text-muted mb-2">Phone: {order.shippingAddress?.phone}</p>
                    <hr className="my-2" />
                    <div className="small">
                      <span className="text-muted">Payment: </span>
                      <strong className="text-dark">{order.paymentMethod}</strong> ({order.paymentStatus})
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
