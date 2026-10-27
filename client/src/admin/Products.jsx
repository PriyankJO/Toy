import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, Filter, Check, X } from 'lucide-react';
import { productService } from '../services/productService';
import { adminService } from '../services/adminService';
import { categoryService } from '../services/categoryService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const res = await productService.getProducts({
        q: search || undefined,
        category: selectedCat || undefined,
        all: 'true', // returns inactive too for admin
        page,
        limit: 10
      });

      if (res.success) {
        setProducts(res.products || []);
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
    categoryService.getCategories(true).then((res) => {
      if (res.success) setCategories(res.categories || []);
    });
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [search, selectedCat, page]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await adminService.deleteProduct(id);
      if (res.success) {
        toast.success('Product deleted successfully');
        fetchCatalog();
      }
    } catch (err) {
      toast.error('Could not delete product');
    }
  };

  const handleToggleActive = async (product) => {
    try {
      const res = await adminService.updateProduct(product._id, { active: !product.active });
      if (res.success) {
        toast.success(`Product ${!product.active ? 'published' : 'unpublished'}`);
        fetchCatalog();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h3 className="fw-bolder mb-1" style={{ color: 'var(--color-text)' }}>
            Manage Products
          </h3>
          <p className="text-muted small mb-0">Total {total} toys in store catalog</p>
        </div>
        <Link to="/admin/products/new" className="btn btn-toy-primary btn-sm">
          <Plus size={16} /> Add New Toy
        </Link>
      </div>

      {/* Filter and Search Bar */}
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
                placeholder="Search products by title, SKU, brand..."
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
              value={selectedCat}
              onChange={(e) => {
                setSelectedCat(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-4 border shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-5">
            <LoadingSpinner text="Loading products table..." />
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 60 }}>Image</th>
                  <th>Product Title & SKU</th>
                  <th>Category</th>
                  <th>Price (₹)</th>
                  <th>Stock</th>
                  <th>Tags</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <img
                        src={p.images?.[0]}
                        alt={p.name}
                        style={{ width: 44, height: 44, objectFit: 'contain', borderRadius: 8, backgroundColor: '#fcfbf8' }}
                      />
                    </td>
                    <td>
                      <div className="fw-bold text-truncate" style={{ maxWidth: 240 }}>{p.name}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>SKU: {p.SKU}</div>
                    </td>
                    <td>
                      <span className="badge badge-purple">{p.category?.name || 'Toy'}</span>
                    </td>
                    <td>
                      <div><strong>₹{p.discountPrice || p.price}</strong></div>
                      {p.discountPrice && (
                        <div className="text-muted text-decoration-line-through" style={{ fontSize: '0.72rem' }}>
                          ₹{p.price}
                        </div>
                      )}
                    </td>
                    <td>
                      {p.stock <= 0 ? (
                        <span className="badge bg-danger">0 Out of Stock</span>
                      ) : p.stock <= 5 ? (
                        <span className="badge bg-warning text-dark">{p.stock} Low Stock</span>
                      ) : (
                        <span className="badge bg-success">{p.stock} in stock</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {p.featured && <span className="badge badge-coral" style={{ fontSize: '0.65rem' }}>Featured</span>}
                        {p.isBestSeller && <span className="badge badge-yellow" style={{ fontSize: '0.65rem' }}>Best Seller</span>}
                      </div>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`btn btn-sm py-0 px-2 rounded-pill ${p.active ? 'btn-outline-success' : 'btn-outline-secondary'}`}
                        style={{ fontSize: '0.72rem' }}
                        onClick={() => handleToggleActive(p)}
                      >
                        {p.active ? 'Active' : 'Draft'}
                      </button>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <Link
                          to={`/products/${p.slug || p._id}`}
                          target="_blank"
                          className="btn btn-sm btn-light border p-1"
                          title="View in store"
                        >
                          <Eye size={15} />
                        </Link>
                        <Link
                          to={`/admin/products/${p._id}/edit`}
                          className="btn btn-sm btn-light border text-primary p-1"
                          title="Edit Product"
                        >
                          <Edit size={15} />
                        </Link>
                        <button
                          type="button"
                          className="btn btn-sm btn-light border text-danger p-1"
                          title="Delete Product"
                          onClick={() => handleDelete(p._id, p.name)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
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
