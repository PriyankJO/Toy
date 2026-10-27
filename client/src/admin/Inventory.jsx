import React, { useState, useEffect } from 'react';
import { Boxes, Plus, Minus, AlertTriangle, ArrowUpDown, History } from 'lucide-react';
import { productService } from '../services/productService';
import { adminService } from '../services/adminService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Adjust Modal State
  const [adjustingProduct, setAdjustingProduct] = useState(null);
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustNote, setAdjustNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const [prodRes, movRes] = await Promise.all([
        productService.getProducts({ all: 'true', limit: 50 }),
        adminService.getInventoryMovements()
      ]);

      if (prodRes.success) setProducts(prodRes.products || []);
      if (movRes.success) setMovements(movRes.movements || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const handleOpenAdjust = (prod) => {
    setAdjustingProduct(prod);
    setAdjustQty(10);
    setAdjustNote('Stock replenishment');
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!adjustingProduct) return;

    try {
      setSubmitting(true);
      const res = await adminService.adjustStock(
        adjustingProduct._id,
        adjustQty,
        adjustNote
      );

      if (res.success) {
        toast.success(res.message);
        setAdjustingProduct(null);
        fetchInventoryData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not adjust stock');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bolder mb-1" style={{ color: 'var(--color-text)' }}>
            Inventory Management
          </h3>
          <p className="text-muted small mb-0">Track real-time stock levels, prevent overselling, and monitor movement history</p>
        </div>
      </div>

      {loading ? (
        <div className="py-5">
          <LoadingSpinner text="Auditing store inventory..." />
        </div>
      ) : (
        <div className="row g-4">
          {/* Products Stock Table */}
          <div className="col-lg-7">
            <div className="bg-white rounded-4 border shadow-sm p-4 h-100">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <Boxes size={20} className="text-primary" /> Product Stock Overview
              </h5>

              <div className="table-responsive">
                <table className="table table-hover align-middle small mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Toy Details</th>
                      <th>SKU</th>
                      <th>Current Units</th>
                      <th className="text-end">Quick Restock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p._id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={p.images?.[0]}
                              alt={p.name}
                              style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 6 }}
                            />
                            <span className="fw-bold text-truncate" style={{ maxWidth: 180 }}>{p.name}</span>
                          </div>
                        </td>
                        <td><code>{p.SKU}</code></td>
                        <td>
                          {p.stock <= 0 ? (
                            <span className="badge bg-danger">0 Out of Stock</span>
                          ) : p.stock <= 5 ? (
                            <span className="badge bg-warning text-dark">{p.stock} Critical</span>
                          ) : (
                            <span className="badge bg-success">{p.stock} units</span>
                          )}
                        </td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1"
                            style={{ fontSize: '0.75rem' }}
                            onClick={() => handleOpenAdjust(p)}
                          >
                            Adjust Stock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Audit Movements History */}
          <div className="col-lg-5">
            <div className="bg-white rounded-4 border shadow-sm p-4 h-100">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <History size={20} className="text-primary" /> Audit Movements Log
              </h5>

              <div className="d-flex flex-column gap-2 overflow-auto" style={{ maxHeight: 600 }}>
                {movements.length === 0 ? (
                  <p className="text-muted small">No recorded stock movements yet.</p>
                ) : (
                  movements.map((m) => (
                    <div key={m._id} className="p-2 border rounded-3 small bg-light">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <strong className="text-truncate" style={{ maxWidth: 170 }}>
                          {m.product?.name || 'Product'}
                        </strong>
                        <span className={`badge ${m.quantity >= 0 ? 'bg-success' : 'bg-danger'}`}>
                          {m.quantity >= 0 ? `+${m.quantity}` : m.quantity} units
                        </span>
                      </div>
                      <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                        Type: <strong>{m.movementType}</strong> • Stock: {m.previousStock} → {m.newStock}
                      </div>
                      <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                        {m.reference} • {new Date(m.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {adjustingProduct && (
        <div
          className="position-fixed inset-0 bg-dark bg-opacity-50 z-3 d-flex align-items-center justify-content-center p-3"
          style={{ top: 0, bottom: 0, left: 0, right: 0, zIndex: 1060 }}
          onClick={() => setAdjustingProduct(null)}
        >
          <div
            className="bg-white rounded-4 p-4 shadow-lg"
            style={{ maxWidth: 450, width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="fw-bold mb-1">Adjust Inventory Quantity</h5>
            <p className="small text-muted mb-3">{adjustingProduct.name} (Current: {adjustingProduct.stock} units)</p>

            <form onSubmit={handleAdjustSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Stock Adjustment Quantity</label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter positive to add, negative to deduct"
                    required
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(parseInt(e.target.value, 10) || 0)}
                  />
                  <span className="input-group-text small">units</span>
                </div>
                <div className="small text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                  New Stock will be: <strong>{Math.max(0, adjustingProduct.stock + adjustQty)} units</strong>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Audit Reference / Note</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Received new shipment from manufacturer"
                  required
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-light btn-sm"
                  onClick={() => setAdjustingProduct(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-toy-primary btn-sm px-4"
                  disabled={submitting}
                >
                  {submitting ? 'Updating...' : 'Save Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
