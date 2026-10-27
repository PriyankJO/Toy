import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Home, Sparkles } from 'lucide-react';
import { orderService } from '../services/orderService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await orderService.getOrderById(id);
        if (res.success && res.order) {
          setOrder(res.order);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="py-5">
        <LoadingSpinner text="Fetching your joyful order details..." />
      </div>
    );
  }

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--color-bg)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        <div className="bg-white rounded-4 border p-4 p-md-5 text-center shadow-sm">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm animate-pulse-subtle"
            style={{ width: 80, height: 80, backgroundColor: 'var(--color-mint-light)', color: '#059669' }}
          >
            <CheckCircle2 size={46} />
          </div>

          <h2 className="fw-bolder mb-2 d-inline-flex align-items-center justify-content-center gap-2" style={{ color: 'var(--color-text)' }}>
            <span>Order Confirmed!</span> <Sparkles size={26} className="text-warning" />
          </h2>

          <p className="text-muted mb-4">
            Thank you! Your order has been placed successfully and our toy elves are carefully packing it with love.
          </p>

          {order && (
            <div className="p-3 bg-light rounded-3 text-start mb-4 small border">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Order Number:</span>
                <span className="fw-bold text-primary">{order.orderNumber}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Payment Method:</span>
                <span className="fw-bold">{order.paymentMethod} ({order.paymentStatus})</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Total Paid / Payable:</span>
                <span className="fw-bold text-dark fs-6">₹{order.total}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Delivery Address:</span>
                <span className="fw-bold text-end" style={{ maxWidth: '60%' }}>
                  {order.shippingAddress?.fullName}, {order.shippingAddress?.street}, {order.shippingAddress?.city} - {order.shippingAddress?.postalCode}
                </span>
              </div>
            </div>
          )}

          <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
            <Link to="/my-orders" className="btn btn-toy-primary px-4 py-2">
              <Package size={18} /> View My Orders
            </Link>
            <Link to="/shop" className="btn btn-toy-outline px-4 py-2">
              Continue Shopping →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
