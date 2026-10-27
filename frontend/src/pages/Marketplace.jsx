import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { getResources, createOrder } from '../services/api';
import { ShoppingCart, ShoppingBag, Plus, Minus, Trash2, CheckCircle2, Search, ArrowRight, X } from 'lucide-react';

const Marketplace = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    address: 'Farm House #12, Canal Side',
    village: user?.location?.village || '',
    district: user?.location?.district || 'Khargone',
    state: user?.location?.state || 'Madhya Pradesh',
    pincode: '451001',
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');

  const loadResources = async () => {
    try {
      setLoading(true);
      const res = await getResources({
        category: selectedCategory,
        search: search.trim() || undefined,
      });
      setResources(res.data.data || []);
    } catch (err) {
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, [selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadResources();
  };

  const addToCart = (resource) => {
    setCart((prev) => {
      const existing = prev.find(item => item.resourceId === resource._id);
      if (existing) {
        return prev.map(item =>
          item.resourceId === resource._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, {
          resourceId: resource._id,
          name: resource.name,
          price: resource.price,
          unit: resource.unit,
          imageUrl: resource.imageUrl,
          quantity: 1,
        }];
      }
    });
    setFeedback({ type: 'success', message: `Added "${resource.name}" to cart!` });
    setTimeout(() => setFeedback(null), 3000);
  };

  const updateQuantity = (resourceId, delta) => {
    setCart((prev) =>
      prev
        .map(item => {
          if (item.resourceId === resourceId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (resourceId) => {
    setCart(prev => prev.filter(item => item.resourceId !== resourceId));
  };

  const totalAmount = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      setOrdering(true);
      const orderPayload = {
        items: cart,
        shippingAddress,
        paymentMethod,
      };

      const res = await createOrder(orderPayload);
      if (res.data.success) {
        setCart([]);
        setShowCartModal(false);
        navigate('/orders');
      }
    } catch (err) {
      setFeedback({ type: 'danger', message: err.response?.data?.message || 'Failed to place order.' });
    } finally {
      setOrdering(false);
    }
  };

  const categories = [
    'All',
    'Seeds',
    'Fertilizers',
    'Bio-Pesticides',
    'Irrigation Kits',
    'Equipment & Tools',
  ];

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
            <ShoppingCart className="text-success" size={28} />
            <span>{t('market.title')}</span>
          </h2>
          <p className="text-muted small mb-0">{t('market.subtitle')}</p>
        </div>

        {/* View Cart Button */}
        <button
          onClick={() => setShowCartModal(true)}
          className="btn btn-success d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm fw-semibold position-relative"
        >
          <ShoppingBag size={18} />
          <span>{t('market.cart')} (₹{totalAmount})</span>
          {cart.length > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {cart.reduce((a, c) => a + c.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      {feedback && (
        <div className={`alert alert-${feedback.type} alert-dismissible fade show py-2 mb-4`} role="alert">
          {feedback.message}
          <button type="button" className="btn-close" onClick={() => setFeedback(null)}></button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
        <div className="row g-3 align-items-center justify-content-between">
          <div className="col-lg-8">
            <div className="d-flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn btn-sm rounded-pill px-3 py-1 fw-semibold ${selectedCategory === cat ? 'btn-success' : 'btn-outline-secondary'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="col-lg-4">
            <form onSubmit={handleSearch} className="d-flex gap-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search seed, fertilizer, tool..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn btn-sm btn-outline-success" type="submit">
                <Search size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : resources.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <ShoppingBag size={48} className="text-muted opacity-50 mx-auto mb-3" />
          <h5 className="fw-semibold text-dark">No Products Found</h5>
          <p className="text-muted small">No items match the selected category or search query.</p>
        </div>
      ) : (
        <div className="row g-4">
          {resources.map((res) => (
            <div key={res._id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden d-flex flex-column">
                <div style={{ height: 180, overflow: 'hidden', backgroundColor: '#f1f5f9' }} className="position-relative">
                  <img
                    src={res.imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600'}
                    alt={res.name}
                    className="w-100 h-100 object-fit-cover"
                  />
                  <span className="badge bg-dark bg-opacity-75 position-absolute top-0 start-0 m-3">
                    {res.category}
                  </span>
                </div>

                <div className="p-4 d-flex flex-column flex-grow-1">
                  <div className="mb-2">
                    <small className="text-muted">{res.brand}</small>
                    <h5 className="fw-bold text-dark mb-1">{res.name}</h5>
                    <p className="text-muted small mb-0 line-clamp-2" style={{ minHeight: 40 }}>
                      {res.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="fw-bold text-success mb-0">₹{res.price}</h4>
                      <small className="text-muted">per {res.unit}</small>
                    </div>

                    <button
                      onClick={() => addToCart(res)}
                      className="btn btn-sm btn-success rounded-pill px-3 py-2 fw-semibold d-flex align-items-center gap-1 shadow-sm"
                    >
                      <Plus size={16} />
                      <span>{t('market.addToCart')}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cart & Checkout Modal */}
      {showCartModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content rounded-4 border-0 shadow">
              <div className="modal-header border-bottom px-4">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                  <ShoppingBag size={20} className="text-success" />
                  <span>Shopping Cart & Delivery Confirmation</span>
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowCartModal(false)}></button>
              </div>

              {cart.length === 0 ? (
                <div className="modal-body p-5 text-center">
                  <ShoppingBag size={48} className="text-muted opacity-50 mx-auto mb-2" />
                  <h6 className="fw-bold text-dark">Your cart is empty</h6>
                  <p className="text-muted small mb-0">Add seeds, fertilizers, or tools from the catalog to place an order.</p>
                </div>
              ) : (
                <form onSubmit={handlePlaceOrder}>
                  <div className="modal-body p-4">
                    {/* Cart Items List */}
                    <div className="mb-4">
                      <h6 className="fw-bold text-muted small text-uppercase mb-2">Order Summary</h6>
                      <div className="d-flex flex-column gap-2" style={{ maxHeight: 200, overflowY: 'auto' }}>
                        {cart.map((item) => (
                          <div key={item.resourceId} className="p-2 bg-light rounded-3 d-flex align-items-center justify-content-between">
                            <div>
                              <strong className="text-dark small d-block">{item.name}</strong>
                              <span className="text-muted small">₹{item.price} / {item.unit}</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <button
                                type="button"
                                className="btn btn-xs btn-outline-secondary p-1 rounded"
                                onClick={() => updateQuantity(item.resourceId, -1)}
                              >
                                <Minus size={12} />
                              </button>
                              <span className="fw-bold px-1">{item.quantity}</span>
                              <button
                                type="button"
                                className="btn btn-xs btn-outline-secondary p-1 rounded"
                                onClick={() => updateQuantity(item.resourceId, 1)}
                              >
                                <Plus size={12} />
                              </button>
                              <span className="fw-bold text-success ms-2" style={{ minWidth: 60, textAlign: 'right' }}>
                                ₹{item.price * item.quantity}
                              </span>
                              <button
                                type="button"
                                className="btn btn-xs text-danger border-0 p-1"
                                onClick={() => removeFromCart(item.resourceId)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                        <strong className="text-dark">Total Order Amount:</strong>
                        <h4 className="fw-bold text-success mb-0">₹{totalAmount}</h4>
                      </div>
                    </div>

                    {/* Shipping Address Inputs */}
                    <h6 className="fw-bold text-muted small text-uppercase mb-2">Delivery Details</h6>
                    <div className="row g-2 mb-3">
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Recipient Full Name"
                          value={shippingAddress.fullName}
                          onChange={(e) => setShippingAddress(p => ({ ...p, fullName: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Contact Phone Number"
                          value={shippingAddress.phone}
                          onChange={(e) => setShippingAddress(p => ({ ...p, phone: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="col-12">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Farm Address / Plot Landmark"
                          value={shippingAddress.address}
                          onChange={(e) => setShippingAddress(p => ({ ...p, address: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Village"
                          value={shippingAddress.village}
                          onChange={(e) => setShippingAddress(p => ({ ...p, village: e.target.value }))}
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="District"
                          value={shippingAddress.district}
                          onChange={(e) => setShippingAddress(p => ({ ...p, district: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Pincode"
                          value={shippingAddress.pincode}
                          onChange={(e) => setShippingAddress(p => ({ ...p, pincode: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    {/* Payment Mode */}
                    <div className="mb-2">
                      <label className="form-label small fw-semibold">Payment Option</label>
                      <select
                        className="form-select form-select-sm"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <option value="Cash on Delivery">💵 Cash on Delivery (Pay upon arrival at farm)</option>
                        <option value="Direct UPI / NetBanking (Test Sandbox)">📱 Direct UPI / QR (Test Sandbox Mode)</option>
                        <option value="Kisan Credit Card (Simulated)">💳 Kisan Credit Card (Simulated)</option>
                      </select>
                    </div>
                  </div>

                  <div className="modal-footer border-top px-4 py-3">
                    <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowCartModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" disabled={ordering} className="btn btn-success rounded-pill px-4 fw-semibold d-flex align-items-center gap-2">
                      {ordering ? (
                        <span>Processing Order...</span>
                      ) : (
                        <>
                          <span>Confirm & Place Order (₹{totalAmount})</span>
                          <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
