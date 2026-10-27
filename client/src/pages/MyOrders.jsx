import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Eye, AlertTriangle, CheckCircle, Truck, XCircle } from 'lucide-react';
import { orderService } from '../services/orderService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import toast from 'react-hot-toast';

export const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getMyOrders();
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? Stock will be restored.')) {
      return;
    }

    try {
      setCancellingId(orderId);
      const res = await orderService.cancelOrder(orderId);
      if (res.success) {
        toast.success('Order cancelled successfully.');
        fetchOrders();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="badge bg-secondary">Pending</span>;
      case 'Confirmed':
        return <span className="badge bg-primary">Confirmed</span>;
      case 'Processing':
        return <span className="badge bg-info text-dark">Processing</span>;
      case 'Shipped':
        return <span className="badge bg-warning text-dark d-inline-flex align-items-center gap-1"><Truck size={12} /> Shipped</span>;
      case 'Delivered':
        return <span className="badge bg-success d-inline-flex align-items-center gap-1"><CheckCircle size={12} /> Delivered</span>;
      case 'Cancelled':
        return <span className="badge bg-danger d-inline-flex align-items-center gap-1"><XCircle size={12} /> Cancelled</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="py-5">
        <LoadingSpinner text="Retrieving your toy orders..." />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-5" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center' }}>
        <EmptyState
          icon={<Package size={64} className="text-secondary" />}
          title="No Orders Yet"
          description="You haven't ordered any toys yet. Start exploring our magical collection and place your first order today!"
          actionText="Discover Toys"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--color-bg)', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bolder mb-1">My Orders</h2>
            <p className="text-muted small mb-0">Track and manage your toy deliveries</p>
          </div>
          <Link to="/shop" className="btn btn-toy-outline btn-sm">
            Shop More Toys →
          </Link>
        </div>

        <div className="d-flex flex-column gap-4">
          {orders.map((order) => {
            const canCancel = ['Pending', 'Confirmed'].includes(order.orderStatus);

            return (
              <div key={order._id} className="bg-white rounded-4 border p-4 shadow-sm">
                {/* Order Top Bar */}
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center pb-3 border-bottom mb-3 gap-2">
                  <div>
                    <span className="small text-muted me-2">Order</span>
                    <strong className="text-primary">{order.orderNumber}</strong>
                    <span className="text-muted small mx-2">•</span>
                    <span className="small text-muted">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    {getStatusBadge(order.orderStatus)}
                    <span className="badge bg-light text-dark border small">
                      {order.paymentMethod} ({order.paymentStatus})
                    </span>
                  </div>
                </div>

                {/* Items in this Order */}
                <div className="d-flex flex-column gap-2 mb-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="d-flex align-items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: 'contain',
                          backgroundColor: '#fbf9f4',
                          borderRadius: 10,
                          padding: 4
                        }}
                      />
                      <div className="flex-grow-1 overflow-hidden">
                        <div className="fw-bold small text-truncate">{item.name}</div>
                        <div className="text-muted small">Qty: {item.quantity} × ₹{item.price}</div>
                      </div>
                      <div className="fw-bold small">
                        ₹{item.subtotal}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer & Actions */}
                <div className="pt-3 border-top d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                  <div>
                    <span className="small text-muted me-1">Total Paid:</span>
                    <strong className="fs-5 text-dark" style={{ fontFamily: 'var(--font-heading)' }}>
                      ₹{order.total}
                    </strong>
                    {order.discount > 0 && (
                      <span className="small text-success ms-2">
                        (Saved ₹{order.discount})
                      </span>
                    )}
                  </div>

                  <div className="d-flex gap-2">
                    <Link
                      to={`/orders/${order._id}`}
                      className="btn btn-outline-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-1"
                    >
                      <Truck size={14} /> Track Order
                    </Link>

                    {canCancel && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm rounded-pill px-3"
                        disabled={cancellingId === order._id}
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
