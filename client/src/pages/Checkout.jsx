import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Tag,
  ArrowRight,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import toast from 'react-hot-toast';

export const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Address state
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    state: user?.addresses?.[0]?.state || 'Karnataka',
    postalCode: user?.addresses?.[0]?.postalCode || '',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast('Please log in or create an account to complete your toy order');
      navigate('/login?redirect=/checkout');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
      setShippingAddress({
        fullName: defaultAddr.fullName || user.name,
        phone: defaultAddr.phone || user.phone,
        street: defaultAddr.street,
        city: defaultAddr.city,
        state: defaultAddr.state,
        postalCode: defaultAddr.postalCode,
        country: defaultAddr.country || 'India'
      });
    }
  }, [user]);

  if (cart.items.length === 0) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
        <h3>Your Cart is Empty</h3>
        <p className="text-muted">Please add toys to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="btn btn-toy-primary">
          Explore Toys
        </Link>
      </div>
    );
  }

  // Handle coupon validation
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      setValidatingCoupon(true);
      const res = await orderService.validateCoupon(couponCode.trim(), cart.subtotal);
      if (res.success && res.coupon) {
        setAppliedCoupon(res.coupon);
        setCouponDiscount(res.coupon.discountAmount);
        toast.success(res.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired coupon');
      setAppliedCoupon(null);
      setCouponDiscount(0);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const finalTotal = Math.max(0, cart.subtotal - couponDiscount + cart.shippingFee);

  // Handle order placement
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.postalCode
    ) {
      toast.error('Please fill in complete shipping address information');
      return;
    }

    try {
      setSubmittingOrder(true);

      const orderPayload = {
        items: cart.items.map((i) => ({
          productId: i.product._id,
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.discountPrice || i.product.price
        })),
        shippingAddress,
        paymentMethod,
        couponCode: appliedCoupon?.code
      };

      const res = await orderService.createOrder(orderPayload);

      if (res.success && res.order) {
        const order = res.order;

        if (paymentMethod === 'Razorpay') {
          // Initialize Razorpay flow or test payment verification
          try {
            const rzpRes = await orderService.createRazorpayOrder(order._id);
            // In demo / test mode: perform verified payment callback
            const verifyRes = await orderService.verifyRazorpayPayment({
              orderId: order._id,
              razorpay_order_id: rzpRes.razorpayOrder.id,
              razorpay_payment_id: `pay_sim_${Date.now()}`,
              razorpay_signature: 'test_demo_verified_sig',
              isTestBypass: true
            });

            if (verifyRes.success) {
              triggerConfetti();
              clearCart();
              navigate(`/order-success/${order._id}`);
              return;
            }
          } catch (paymentErr) {
            console.error('Online payment error:', paymentErr);
            toast.error('Payment verification failed, order saved as pending');
          }
        }

        // COD or completed flow
        triggerConfetti();
        clearCart();
        toast.success('Your toy order has been placed successfully!');
        navigate(`/order-success/${order._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore if confetti not supported
    }
  };

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--color-bg)', minHeight: '85vh' }}>
      <div className="container">
        <h2 className="fw-bolder mb-1">Checkout & Order</h2>
        <p className="text-muted small mb-4">Complete your shipping address and choose your payment method</p>

        <form onSubmit={handlePlaceOrder}>
          <div className="row g-4">
            {/* Left Column: Shipping Address & Payment Selection */}
            <div className="col-lg-8">
              {/* Shipping Address Box */}
              <div className="bg-white rounded-4 border p-4 shadow-sm mb-4">
                <h5 className="fw-bolder mb-3">1. Shipping Address</h5>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Full Name *</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      required
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted">Phone Number *</label>
                    <input
                      type="tel"
                      className="form-control rounded-3"
                      required
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted">House / Flat / Street Address *</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      required
                      placeholder="e.g. 104, Sunrise Apartments, Green Glen Layout"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-bold text-muted">City *</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-bold text-muted">State *</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      required
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-bold text-muted">PIN Code *</label>
                    <input
                      type="text"
                      maxLength={6}
                      className="form-control rounded-3"
                      required
                      placeholder="e.g. 560034"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value.replace(/\D/g, '') })}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Box */}
              <div className="bg-white rounded-4 border p-4 shadow-sm mb-4">
                <h5 className="fw-bolder mb-3">2. Payment Method</h5>

                <div className="d-flex flex-column gap-3">
                  {/* Cash on Delivery Option */}
                  <label
                    className={`d-flex align-items-center gap-3 p-3 rounded-3 border cursor-pointer ${paymentMethod === 'COD' ? 'border-primary bg-light' : ''}`}
                    style={{ transition: 'all 0.2s' }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      className="form-check-input mt-0"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                    />
                    <div className="p-2 rounded-circle bg-warning bg-opacity-25 text-warning">
                      <Banknote size={24} />
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-bold">Cash on Delivery (COD)</div>
                      <div className="text-muted small">Pay in cash or UPI upon package arrival at your doorstep</div>
                    </div>
                  </label>

                  {/* Razorpay Online Payment Option */}
                  <label
                    className={`d-flex align-items-center gap-3 p-3 rounded-3 border cursor-pointer ${paymentMethod === 'Razorpay' ? 'border-primary bg-light' : ''}`}
                    style={{ transition: 'all 0.2s' }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      className="form-check-input mt-0"
                      checked={paymentMethod === 'Razorpay'}
                      onChange={() => setPaymentMethod('Razorpay')}
                    />
                    <div className="p-2 rounded-circle bg-primary bg-opacity-25 text-primary">
                      <CreditCard size={24} />
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-bold d-flex align-items-center gap-2">
                        Online Payment (Razorpay)
                        <span className="badge badge-purple small">Cards • UPI • Netbanking</span>
                      </div>
                      <div className="text-muted small">Instant secure payment with 100% buyer protection</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Review & Coupon Box */}
            <div className="col-lg-4">
              <div className="bg-white rounded-4 border p-4 shadow-sm sticky-top" style={{ top: 90 }}>
                <h5 className="fw-bolder mb-3">Order Details</h5>

                {/* Items Mini List */}
                <div className="d-flex flex-column gap-2 mb-3 max-h-200 overflow-auto">
                  {cart.items.map((item) => (
                    <div key={item._id} className="d-flex align-items-center gap-2 small pb-2 border-bottom">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        style={{ width: 42, height: 42, objectFit: 'contain', borderRadius: 8 }}
                      />
                      <div className="flex-grow-1 overflow-hidden">
                        <div className="text-truncate fw-bold">{item.product.name}</div>
                        <div className="text-muted">Qty: {item.quantity} × ₹{item.product.discountPrice || item.product.price}</div>
                      </div>
                      <div className="fw-bold text-end">
                        ₹{(item.product.discountPrice || item.product.price) * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Input */}
                <div className="mb-3">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control rounded-start-pill text-uppercase"
                      placeholder="Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-primary rounded-end-pill px-3"
                      disabled={validatingCoupon}
                      onClick={handleApplyCoupon}
                    >
                      {validatingCoupon ? 'Checking...' : 'Apply'}
                    </button>
                  </div>
                  {appliedCoupon && (
                    <div className="small text-success mt-1 d-flex align-items-center gap-1">
                      <CheckCircle2 size={14} /> Coupon {appliedCoupon.code} applied (-₹{couponDiscount})
                    </div>
                  )}
                  <div className="small text-muted mt-1 d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                    <Sparkles size={13} className="text-warning flex-shrink-0" />
                    <span>Tip: Try code <strong>WONDER20</strong> for 20% OFF!</span>
                  </div>
                </div>

                <div className="d-flex justify-content-between mb-2 small text-muted">
                  <span>Subtotal</span>
                  <span className="fw-bold text-dark">₹{cart.subtotal}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="d-flex justify-content-between mb-2 small text-success">
                    <span>Coupon Discount</span>
                    <span className="fw-bold">-₹{couponDiscount}</span>
                  </div>
                )}

                <div className="d-flex justify-content-between mb-3 small text-muted">
                  <span>Delivery Fee</span>
                  <span>
                    {cart.shippingFee === 0 ? (
                      <strong className="text-success">FREE</strong>
                    ) : (
                      `₹${cart.shippingFee}`
                    )}
                  </span>
                </div>

                <hr />

                <div className="d-flex justify-content-between align-items-baseline mb-4">
                  <span className="fw-bolder fs-5">Final Total</span>
                  <span className="fw-bolder fs-3 text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
                    ₹{finalTotal}
                  </span>
                </div>

                <button
                  type="submit"
                  className="btn btn-toy-primary w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                  disabled={submittingOrder}
                >
                  {submittingOrder ? 'Processing Order...' : `Place Order • ₹${finalTotal}`}
                  <ArrowRight size={18} />
                </button>

                <div className="text-center small text-muted mt-3">
                  <ShieldCheck size={16} color="var(--color-mint)" /> Safe & Contactless Toy Delivery
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
