import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  CreditCard,
  AlertCircle,
  Phone
} from 'lucide-react';
import { orderService } from '../services/orderService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const OrderDetailsPage = () => {
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
        <LoadingSpinner text="Tracking order journey..." />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <h3>Order Not Found</h3>
        <Link to="/my-orders" className="btn btn-toy-primary mt-3">
          Back to Orders
        </Link>
      </div>
    );
  }

  const steps = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
  const currentStepIndex = steps.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'Cancelled';

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--color-bg)', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        <Link to="/my-orders" className="btn btn-link text-muted p-0 mb-3 text-decoration-none small d-inline-flex align-items-center gap-1">
          <ArrowLeft size={16} /> Back to My Orders
        </Link>

        {/* Header */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 pb-3 border-bottom">
          <div>
            <h3 className="fw-bolder mb-1">Order #{order.orderNumber}</h3>
            <span className="small text-muted">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div className="mt-2 mt-sm-0">
            <span className="badge bg-primary fs-6 px-3 py-2 rounded-pill">
              Status: {order.orderStatus}
            </span>
          </div>
        </div>

        {/* Visual Stepper */}
        {!isCancelled ? (
          <div className="bg-white rounded-4 border p-4 shadow-sm mb-4">
            <h5 className="fw-bold mb-4">Delivery Progress</h5>
            <div className="d-flex justify-content-between position-relative px-2">
              {/* Progress Line */}
              <div
                className="position-absolute top-50 start-0 end-0 translate-middle-y bg-light"
                style={{ height: 4, zIndex: 0, margin: '0 30px' }}
              >
                <div
                  className="bg-primary h-100"
                  style={{
                    width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%`,
                    transition: 'width 0.5s ease'
                  }}
                />
              </div>

              {steps.map((st, idx) => {
                const isPassed = idx <= currentStepIndex;
                return (
                  <div key={st} className="text-center position-relative" style={{ zIndex: 1 }}>
                    <div
                      className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 ${isPassed ? 'bg-primary text-white shadow' : 'bg-white border text-muted'}`}
                      style={{ width: 40, height: 40 }}
                    >
                      {isPassed ? <CheckCircle2 size={20} /> : idx + 1}
                    </div>
                    <div className={`small ${isPassed ? 'fw-bold text-dark' : 'text-muted'}`}>
                      {st}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="alert alert-danger rounded-4 p-4 mb-4 d-flex align-items-center gap-3">
            <AlertCircle size={28} />
            <div>
              <h5 className="fw-bold mb-1">Order Cancelled</h5>
              <p className="mb-0 small">This order has been cancelled and stock has been restored to inventory.</p>
            </div>
          </div>
        )}

        {/* Order Items & Summary */}
        <div className="row g-4 mb-4">
          <div className="col-md-7">
            <div className="bg-white rounded-4 border p-4 shadow-sm h-100">
              <h5 className="fw-bold mb-3">Items in Order</h5>
              <div className="d-flex flex-column gap-3">
                {order.items.map((it, idx) => (
                  <div key={idx} className="d-flex align-items-center gap-3 pb-2 border-bottom">
                    <img
                      src={it.image}
                      alt={it.name}
                      style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: 10, backgroundColor: '#fcfbf8' }}
                    />
                    <div className="flex-grow-1 overflow-hidden">
                      <div className="fw-bold small">{it.name}</div>
                      <div className="text-muted small">Qty: {it.quantity} × ₹{it.price}</div>
                    </div>
                    <div className="fw-bold">
                      ₹{it.subtotal}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-2">
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>
                {order.discount > 0 && (
                  <div className="d-flex justify-content-between small text-success mb-1">
                    <span>Discount</span>
                    <span>-₹{order.discount}</span>
                  </div>
                )}
                <div className="d-flex justify-content-between small text-muted mb-2">
                  <span>Delivery</span>
                  <span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold fs-5 pt-2 border-top">
                  <span>Total Amount</span>
                  <span className="text-primary">₹{order.total}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className="bg-white rounded-4 border p-4 shadow-sm h-100 d-flex flex-column justify-content-between">
              <div>
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <MapPin size={18} className="text-primary" /> Delivery Address
                </h5>
                <p className="small text-muted mb-4" style={{ lineHeight: 1.6 }}>
                  <strong className="text-dark d-block mb-1">{order.shippingAddress?.fullName}</strong>
                  {order.shippingAddress?.street}<br />
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}<br />
                  <span className="d-inline-flex align-items-center gap-1 mt-1"><Phone size={13} className="text-primary" /> {order.shippingAddress?.phone}</span>
                </p>

                <h5 className="fw-bold mb-2 d-flex align-items-center gap-2">
                  <CreditCard size={18} className="text-primary" /> Payment Info
                </h5>
                <div className="small text-muted mb-1">
                  Method: <strong className="text-dark">{order.paymentMethod}</strong>
                </div>
                <div className="small text-muted">
                  Status: <strong className={order.paymentStatus === 'Paid' ? 'text-success' : 'text-warning'}>{order.paymentStatus}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status History Timeline */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div className="bg-white rounded-4 border p-4 shadow-sm">
            <h5 className="fw-bold mb-3">Status Timeline</h5>
            <div className="d-flex flex-column gap-3">
              {order.statusHistory.map((history, i) => (
                <div key={i} className="d-flex align-items-start gap-3 border-start border-2 border-primary ps-3 py-1">
                  <div>
                    <span className="fw-bold small d-block">{history.status}</span>
                    <span className="text-muted small d-block">{history.note}</span>
                    <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                      {new Date(history.changedAt).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
