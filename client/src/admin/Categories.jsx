import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';
import { categoryService } from '../services/categoryService';
import { adminService } from '../services/adminService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    color: '#7657E8',
    active: true
  });

  const fetchCats = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getCategories(true);
      if (res.success) {
        setCategories(res.categories || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
      color: '#7657E8',
      active: true
    });
    setShowModal(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      image: cat.image,
      color: cat.color || '#7657E8',
      active: cat.active !== undefined ? cat.active : true
    });
    setShowModal(true);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      const res = await adminService.deleteCategory(id);
      if (res.success) {
        toast.success('Category deleted');
        fetchCats();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete category');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editingCategory) {
        res = await adminService.updateCategory(editingCategory._id, formData);
      } else {
        res = await adminService.createCategory(formData);
      }

      if (res.success) {
        toast.success(res.message || 'Category saved!');
        setShowModal(false);
        fetchCats();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bolder mb-1" style={{ color: 'var(--color-text)' }}>
            Manage Categories
          </h3>
          <p className="text-muted small mb-0">Organize toys into logical themed collections</p>
        </div>
        <button className="btn btn-toy-primary btn-sm" onClick={handleOpenAdd}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="bg-white rounded-4 border shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-5">
            <LoadingSpinner text="Fetching categories..." />
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 small">
              <thead className="table-light">
                <tr>
                  <th style={{ width: 60 }}>Icon</th>
                  <th>Category Name</th>
                  <th>Slug</th>
                  <th>Color Tag</th>
                  <th>Products Count</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <img
                        src={c.image}
                        alt={c.name}
                        style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8 }}
                      />
                    </td>
                    <td>
                      <strong className="text-dark">{c.name}</strong>
                      <div className="text-muted small">{c.description}</div>
                    </td>
                    <td><code>{c.slug}</code></td>
                    <td>
                      <span className="p-1 px-2 rounded small text-white fw-bold" style={{ backgroundColor: c.color || '#7657E8' }}>
                        {c.color || '#7657E8'}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-purple">{c.itemCount || 0} toys</span>
                    </td>
                    <td>
                      <span className={`badge ${c.active ? 'bg-success' : 'bg-secondary'}`}>
                        {c.active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <button
                          className="btn btn-sm btn-light border p-1 text-primary"
                          onClick={() => handleOpenEdit(c)}
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          className="btn btn-sm btn-light border p-1 text-danger"
                          onClick={() => handleDelete(c._id, c.name)}
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
      </div>

      {/* Category Modal */}
      {showModal && (
        <div
          className="position-fixed inset-0 bg-dark bg-opacity-50 z-3 d-flex align-items-center justify-content-center p-3"
          style={{ top: 0, bottom: 0, left: 0, right: 0, zIndex: 1060 }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-4 p-4 shadow-lg"
            style={{ maxWidth: 500, width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="fw-bold mb-3">{editingCategory ? 'Edit Category' : 'Add Category'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label small fw-bold text-muted">Category Name *</label>
                <input
                  type="text"
                  className="form-control form-control-sm rounded-3"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="mb-2">
                <label className="form-label small fw-bold text-muted">Description</label>
                <input
                  type="text"
                  className="form-control form-control-sm rounded-3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="mb-2">
                <label className="form-label small fw-bold text-muted">Image URL *</label>
                <input
                  type="url"
                  className="form-control form-control-sm rounded-3"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Brand Color (HEX)</label>
                <input
                  type="color"
                  className="form-control form-control-color w-100"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
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
                <button type="submit" className="btn btn-toy-primary btn-sm px-4">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
