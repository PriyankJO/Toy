import React, { useState, useEffect } from 'react';
import { TicketPercent, Plus, Trash2, Calendar, Check, X } from 'lucide-react';
import { adminService } from '../services/adminService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Coupon Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minimumOrderValue: 0,
    maxDiscountAmount: '',
    expiryDate: '2028-12-31',
    usageLimit: 500,
    active: true
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await adminService.getCoupons();
      if (res.success) {
        setCoupons(res.coupons || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete coupon code "${code}"?`)) return;

    try {
      const res = await adminService.deleteCoupon(id);
      if (res.success) {
        toast.success('Coupon deleted');
        fetchCoupons();
      }
    } catch (err) {
      toast.error('Failed to delete coupon');
    }
  };

  const handleToggleActive = async (coupon) => {
    try {
      const res = await adminService.updateCoupon(coupon._id, { active: !coupon.active });
      if (res.success) {
        toast.success(`Coupon ${!coupon.active ? 'activated' : 'deactivated'}`);
        fetchCoupons();
      }
    } catch (err) {
      toast.error('Failed to update coupon');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await adminService.createCoupon(formData);
      if (res.success) {
        toast.success('Promotional coupon created!');
        setShowModal(false);
        setFormData({
          code: '',
          description: '',
          discountType: 'percentage',
          discountValue: '',
          minimumOrderValue: 0,
          maxDiscountAmount: '',
          expiryDate: '2028-12-31',
          usageLimit: 500,
          active: true
        });
        fetchCoupons();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create coupon');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bolder mb-1" style={{ color: 'var(--color-text)' }}>
            Coupons & Discounts
          </h3>
          <p className="text-muted small mb-0">Create promotional discount codes for your customers</p>
        </div>
        <button className="btn btn-toy-primary btn-sm" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      <div className="bg-white rounded-4 border shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-5">
            <LoadingSpinner text="Loading discount coupons..." />
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th>Coupon Code</th>
                  <th>Discount Value</th>
                  <th>Min Order Spend</th>
                  <th>Expiry Date</th>
                  <th>Redemptions</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <span className="badge badge-purple fs-6 px-3 py-1">
                        {c.code}
                      </span>
                      <div className="text-muted small mt-1">{c.description}</div>
                    </td>
                    <td>
                      <strong>
                        {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                      </strong>
                    </td>
                    <td>₹{c.minimumOrderValue || 0}</td>
                    <td>
                      <span className="text-muted">
                        {new Date(c.expiryDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td>
                      {c.usageCount} / {c.usageLimit} used
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`btn btn-sm rounded-pill py-0 px-2 ${c.active ? 'btn-outline-success' : 'btn-outline-secondary'}`}
                        style={{ fontSize: '0.72rem' }}
                        onClick={() => handleToggleActive(c)}
                      >
                        {c.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-light border text-danger p-1"
                        onClick={() => handleDelete(c._id, c.code)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Coupon Modal */}
      {showModal && (
        <div
          className="position-fixed inset-0 bg-dark bg-opacity-50 z-3 d-flex align-items-center justify-content-center p-3"
          style={{ top: 0, bottom: 0, left: 0, right: 0, zIndex: 1060 }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-4 p-4 shadow-lg"
            style={{ maxWidth: 480, width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="fw-bold mb-3">Create Promotional Coupon</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label small fw-bold text-muted">Coupon Code *</label>
                <input
                  type="text"
                  className="form-control form-control-sm rounded-3 text-uppercase"
                  required
                  placeholder="e.g. SUMMERKIDS"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                />
              </div>

              <div className="mb-2">
                <label className="form-label small fw-bold text-muted">Description</label>
                <input
                  type="text"
                  className="form-control form-control-sm rounded-3"
                  placeholder="e.g. 20% off festival special"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted">Discount Type *</label>
                  <select
                    className="form-select form-select-sm rounded-3"
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted">Discount Value *</label>
                  <input
                    type="number"
                    className="form-control form-control-sm rounded-3"
                    required
                    min="1"
                    placeholder="20"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  />
                </div>
              </div>

              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted">Min Order Value (₹)</label>
                  <input
                    type="number"
                    className="form-control form-control-sm rounded-3"
                    value={formData.minimumOrderValue}
                    onChange={(e) => setFormData({ ...formData, minimumOrderValue: e.target.value })}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    className="form-control form-control-sm rounded-3"
                    placeholder="Optional"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Expiry Date *</label>
                <input
                  type="date"
                  className="form-control form-control-sm rounded-3"
                  required
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-light btn-sm"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-toy-primary btn-sm px-4"
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
