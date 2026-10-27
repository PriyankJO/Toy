import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit3, CheckCircle, Truck, XCircle, AlertCircle, Clock } from 'lucide-react';
import { adminService } from '../services/adminService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Status Change Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  // Details Modal State
  const [viewingOrder, setViewingOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await adminService.getOrders({
        search: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page,
        limit: 10
      });

      if (res.success) {
        setOrders(res.orders || []);
        setTotalPages(res.totalPages || 1);
        setTotal(res.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter, page]);

  const handleOpenStatusModal = (ord) => {
    setSelectedOrder(ord);
    setNewStatus(ord.orderStatus);
    setStatusNote('');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      setUpdating(true);
      const res = await adminService.updateOrderStatus(selectedOrder._id, {
        status: newStatus,
        note: statusNote
      });

      if (res.success) {
        toast.success(res.message);
        setSelectedOrder(null);
        fetchOrders();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const validTransitions = {
    Pending: ['Confirmed', 'Cancelled'],
    Confirmed: ['Processing', 'Cancelled'],
    Processing: ['Shipped', 'Cancelled'],
    Shipped: ['Delivered'],
    Delivered: [],
    Cancelled: []
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bolder mb-1" style={{ color: 'var(--color-text)' }}>
            Manage Customer Orders
          </h3>
          <p className="text-muted small mb-0">Total {total} orders processed across all channels</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-4 border p-3 shadow-sm mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <Search size={16} className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by order number or customer phone/name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          <div className="col-md-6 d-flex gap-2 justify-content-md-end">
            <select
              className="form-select"
              style={{ maxWidth: 220 }}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-4 border shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-5">
            <LoadingSpinner text="Retrieving orders..." />
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Placed At</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord._id}>
                    <td><strong className="text-primary">{ord.orderNumber}</strong></td>
                    <td>
                      <div><strong>{ord.shippingAddress?.fullName}</strong></div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>{ord.shippingAddress?.phone}</div>
                    </td>
                    <td>{ord.items?.length || 0} items</td>
                    <td><strong className="text-dark">₹{ord.total}</strong></td>
                    <td>
                      <span className={`badge ${ord.paymentStatus === 'Paid' ? 'bg-success' : 'bg-light text-dark border'}`}>
                        {ord.paymentMethod}: {ord.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td>
                      <span className="text-muted">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <button
                          className="btn btn-sm btn-light border p-1"
                          title="View Details"
                          onClick={() => setViewingOrder(ord)}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          className="btn btn-sm btn-light border text-primary p-1"
                          title="Update Status"
                          onClick={() => handleOpenStatusModal(ord)}
                        >
                          <Edit3 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-3 border-top d-flex justify-content-between align-items-center">
            <span className="small text-muted">Page {page} of {totalPages}</span>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Transition Modal */}
      {selectedOrder && (
        <div
          className="position-fixed inset-0 bg-dark bg-opacity-50 z-3 d-flex align-items-center justify-content-center p-3"
          style={{ top: 0, bottom: 0, left: 0, right: 0, zIndex: 1060 }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-4 p-4 shadow-lg"
            style={{ maxWidth: 450, width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="fw-bold mb-2">Update Order Status</h5>
            <p className="small text-muted mb-3">Order: {selectedOrder.orderNumber}</p>

            <form onSubmit={handleUpdateStatus}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Current Status: {selectedOrder.orderStatus}</label>
                <select
                  className="form-select rounded-3"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value={selectedOrder.orderStatus}>{selectedOrder.orderStatus} (Unchanged)</option>
                  {(validTransitions[selectedOrder.orderStatus] || []).map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
                <div className="small text-muted mt-1" style={{ fontSize: '0.72rem' }}>
                  Allowed transitions strictly enforced for inventory consistency.
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Status Note / Reason</label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  placeholder="e.g. Dispatched with Bluedart Tracking #12345"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-light btn-sm"
                  onClick={() => setSelectedOrder(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-toy-primary btn-sm px-4"
                  disabled={updating}
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      {viewingOrder && (
        <div
          className="position-fixed inset-0 bg-dark bg-opacity-50 z-3 d-flex align-items-center justify-content-center p-3"
          style={{ top: 0, bottom: 0, left: 0, right: 0, zIndex: 1060 }}
          onClick={() => setViewingOrder(null)}
        >
          <div
            className="bg-white rounded-4 p-4 shadow-lg overflow-auto"
            style={{ maxWidth: 600, width: '100%', maxHeight: '85vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Order {viewingOrder.orderNumber}</h5>
              <span className="badge bg-primary">{viewingOrder.orderStatus}</span>
            </div>

            <div className="small mb-3 p-3 bg-light rounded-3">
              <strong>Customer:</strong> {viewingOrder.shippingAddress?.fullName} ({viewingOrder.shippingAddress?.phone})<br />
              <strong>Address:</strong> {viewingOrder.shippingAddress?.street}, {viewingOrder.shippingAddress?.city} - {viewingOrder.shippingAddress?.postalCode}<br />
              <strong>Payment:</strong> {viewingOrder.paymentMethod} ({viewingOrder.paymentStatus})
            </div>

            <h6 className="fw-bold mb-2">Order Items</h6>
            <div className="d-flex flex-column gap-2 mb-3">
              {viewingOrder.items.map((it, idx) => (
                <div key={idx} className="d-flex align-items-center justify-content-between small border-bottom pb-1">
                  <span>{it.name} (x{it.quantity})</span>
                  <strong>₹{it.subtotal}</strong>
                </div>
              ))}
            </div>

            <div className="text-end fw-bold fs-5 mb-3">
              Total: ₹{viewingOrder.total}
            </div>

            <button
              className="btn btn-light w-100"
              onClick={() => setViewingOrder(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
