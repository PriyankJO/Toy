import React, { useState, useEffect } from 'react';
import { Search, UserCheck, UserX, Shield, Mail, Phone } from 'lucide-react';
import { adminService } from '../services/adminService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getCustomers({
        search: search || undefined,
        page,
        limit: 10
      });

      if (res.success) {
        setCustomers(res.customers || []);
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
    fetchCustomers();
  }, [search, page]);

  const handleToggleStatus = async (customer) => {
    const newStatus = customer.accountStatus === 'active' ? 'suspended' : 'active';
    if (!window.confirm(`Are you sure you want to set ${customer.name}'s account status to ${newStatus}?`)) {
      return;
    }

    try {
      const res = await adminService.updateCustomerStatus(customer._id, newStatus);
      if (res.success) {
        toast.success(res.message);
        fetchCustomers();
      }
    } catch (err) {
      toast.error('Failed to change customer status');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bolder mb-1" style={{ color: 'var(--color-text)' }}>
            Customer Management
          </h3>
          <p className="text-muted small mb-0">Total {total} registered parents & customers</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-4 border p-3 shadow-sm mb-4">
        <div className="input-group">
          <span className="input-group-text bg-light border-end-0">
            <Search size={16} className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control border-start-0"
            placeholder="Search customers by name, email, or phone number..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-4 border shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-5">
            <LoadingSpinner text="Loading customer accounts..." />
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th>Customer Profile</th>
                  <th>Contact Info</th>
                  <th>Orders Count</th>
                  <th>Total Spent</th>
                  <th>Account Status</th>
                  <th>Joined Date</th>
                  <th className="text-end">Account Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={c.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                          alt={c.name}
                          className="rounded-circle"
                          style={{ width: 36, height: 36, objectFit: 'cover' }}
                        />
                        <div>
                          <strong>{c.name}</strong>
                          <div className="text-muted" style={{ fontSize: '0.72rem' }}>ID: {c._id.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div><Mail size={13} className="text-muted me-1" />{c.email}</div>
                      {c.phone && <div className="text-muted"><Phone size={13} className="text-muted me-1" />{c.phone}</div>}
                    </td>
                    <td>
                      <span className="badge badge-purple">{c.orderCount || 0} orders</span>
                    </td>
                    <td>
                      <strong className="text-dark">₹{c.totalSpent?.toLocaleString('en-IN') || 0}</strong>
                    </td>
                    <td>
                      <span className={`badge ${c.accountStatus === 'active' ? 'bg-success' : 'bg-danger'}`}>
                        {c.accountStatus}
                      </span>
                    </td>
                    <td>
                      <span className="text-muted">
                        {new Date(c.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        type="button"
                        className={`btn btn-sm ${c.accountStatus === 'active' ? 'btn-outline-danger' : 'btn-outline-success'} py-1 px-3 rounded-pill`}
                        style={{ fontSize: '0.75rem' }}
                        onClick={() => handleToggleStatus(c)}
                      >
                        {c.accountStatus === 'active' ? 'Suspend' : 'Activate'}
                      </button>
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
    </div>
  );
};
