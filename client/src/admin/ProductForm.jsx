import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, Trash2, Save, Image as ImageIcon } from 'lucide-react';
import { adminService } from '../services/adminService';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import toast from 'react-hot-toast';

export const ProductForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    discountPrice: '',
    stock: 10,
    SKU: '',
    brand: 'ToyWonder Studio',
    ageGroup: '3-5 Years',
    shortDescription: '',
    description: '',
    safetyInfo: '100% Non-Toxic, BPA-Free, Child-Safe Tested',
    featured: false,
    isBestSeller: false,
    isNewArrival: false,
    active: true,
    images: ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80'],
    specifications: {
      material: 'Eco-friendly Plastic & Soft Cotton',
      dimensions: 'Standard',
      weight: '350g',
      batteryRequired: 'No',
      origin: 'India'
    }
  });

  const [imageUrlInput, setImageUrlInput] = useState('');

  useEffect(() => {
    // Load categories
    categoryService.getCategories(true).then((res) => {
      if (res.success && res.categories) {
        setCategories(res.categories);
        if (!isEditMode && res.categories.length > 0) {
          setFormData((prev) => ({ ...prev, category: res.categories[0]._id }));
        }
      }
    });

    // If edit mode, load product data
    if (isEditMode) {
      setLoading(true);
      productService.getProduct(id).then((res) => {
        if (res.success && res.product) {
          const p = res.product;
          setFormData({
            name: p.name || '',
            category: p.category?._id || p.category || '',
            price: p.price || '',
            discountPrice: p.discountPrice || '',
            stock: p.stock !== undefined ? p.stock : 10,
            SKU: p.SKU || '',
            brand: p.brand || 'ToyWonder',
            ageGroup: p.ageGroup || '3-5 Years',
            shortDescription: p.shortDescription || '',
            description: p.description || '',
            safetyInfo: p.safetyInfo || '',
            featured: Boolean(p.featured),
            isBestSeller: Boolean(p.isBestSeller),
            isNewArrival: Boolean(p.isNewArrival),
            active: p.active !== undefined ? Boolean(p.active) : true,
            images: p.images && p.images.length > 0 ? p.images : [],
            specifications: p.specifications || {}
          });
        }
      }).finally(() => setLoading(false));
    }
  }, [id, isEditMode]);

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrlInput.trim()]
      }));
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append('images', files[i]);
    }

    try {
      setUploading(true);
      const res = await adminService.uploadImages(data);
      if (res.success && res.urls) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...res.urls]
        }));
        toast.success('Images uploaded successfully!');
      }
    } catch (err) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.price || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    if (formData.images.length === 0) {
      toast.error('At least one product image is required');
      return;
    }

    try {
      setLoading(true);
      let res;
      if (isEditMode) {
        res = await adminService.updateProduct(id, formData);
      } else {
        res = await adminService.createProduct(formData);
      }

      if (res.success) {
        toast.success(res.message || 'Product saved successfully!');
        navigate('/admin/products');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <Link to="/admin/products" className="btn btn-link text-muted p-0 mb-3 text-decoration-none small d-inline-flex align-items-center gap-1">
        <ArrowLeft size={16} /> Back to Products Table
      </Link>

      <div className="bg-white rounded-4 border p-4 shadow-sm mb-4">
        <h4 className="fw-bolder mb-3">
          {isEditMode ? 'Edit Toy Product' : 'Add New Toy to Store'}
        </h4>

        <form onSubmit={handleSubmit}>
          {/* General Details */}
          <div className="row g-3 mb-4">
            <div className="col-md-8">
              <label className="form-label small fw-bold text-muted">Toy Name *</label>
              <input
                type="text"
                className="form-control rounded-3"
                required
                placeholder="e.g. Barnaby Honey Bear Plush"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-bold text-muted">Category *</label>
              <select
                className="form-select rounded-3"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-bold text-muted">Regular Price (₹) *</label>
              <input
                type="number"
                className="form-control rounded-3"
                required
                min="1"
                placeholder="999"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-bold text-muted">Discount Price (₹, optional)</label>
              <input
                type="number"
                className="form-control rounded-3"
                placeholder="Leave blank if no discount"
                value={formData.discountPrice}
                onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-bold text-muted">Inventory Stock *</label>
              <input
                type="number"
                className="form-control rounded-3"
                required
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-bold text-muted">Age Group</label>
              <select
                className="form-select rounded-3"
                value={formData.ageGroup}
                onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value })}
              >
                <option value="0-2 Years">0-2 Years</option>
                <option value="3-5 Years">3-5 Years</option>
                <option value="6-8 Years">6-8 Years</option>
                <option value="9-12 Years">9-12 Years</option>
                <option value="12+ Years">12+ Years</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-bold text-muted">Brand</label>
              <input
                type="text"
                className="form-control rounded-3"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-bold text-muted">SKU (Auto if blank)</label>
              <input
                type="text"
                className="form-control rounded-3"
                placeholder="e.g. TW-101"
                value={formData.SKU}
                onChange={(e) => setFormData({ ...formData, SKU: e.target.value })}
              />
            </div>
          </div>

          {/* Descriptions & Safety */}
          <div className="mb-4">
            <label className="form-label small fw-bold text-muted">Short Description (for product card)</label>
            <input
              type="text"
              className="form-control rounded-3 mb-3"
              placeholder="Brief 1-line catchy summary"
              value={formData.shortDescription}
              onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            />

            <label className="form-label small fw-bold text-muted">Full Description *</label>
            <textarea
              className="form-control rounded-3 mb-3"
              rows={4}
              required
              placeholder="Comprehensive details on features, play benefits, and contents..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <label className="form-label small fw-bold text-muted">Safety & Certification Info</label>
            <input
              type="text"
              className="form-control rounded-3"
              placeholder="e.g. 100% Non-Toxic, BPA-Free, Child-Safe Tested"
              value={formData.safetyInfo}
              onChange={(e) => setFormData({ ...formData, safetyInfo: e.target.value })}
            />
          </div>

          {/* Images Management */}
          <div className="mb-4 p-3 bg-light rounded-3 border">
            <label className="form-label small fw-bold text-muted d-block mb-2">Product Images</label>

            {/* Existing images list */}
            <div className="d-flex flex-wrap gap-2 mb-3">
              {formData.images.map((img, index) => (
                <div key={index} className="position-relative border rounded-3 p-1 bg-white" style={{ width: 80, height: 80 }}>
                  <img src={img} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm p-0 rounded-circle position-absolute top-0 end-0 translate-middle"
                    style={{ width: 20, height: 20, lineHeight: 1 }}
                    onClick={() => handleRemoveImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add Image by URL */}
            <div className="input-group mb-2">
              <input
                type="url"
                className="form-control form-control-sm"
                placeholder="Paste Image URL (Unsplash, Cloudinary, etc.)..."
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={handleAddImageUrl}
              >
                Add URL
              </button>
            </div>

            {/* Local Image Upload via Multer */}
            <div className="d-flex align-items-center gap-2">
              <label className="btn btn-outline-secondary btn-sm mb-0">
                <Upload size={14} /> Upload Image Files
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  hidden
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </label>
              {uploading && <span className="small text-muted">Uploading to /uploads...</span>}
            </div>
          </div>

          {/* Flags Checkboxes */}
          <div className="d-flex flex-wrap gap-4 mb-4 pt-2 border-top">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="featCheck"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              />
              <label htmlFor="featCheck" className="form-check-label small fw-bold">
                Featured on Homepage
              </label>
            </div>

            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="bestCheck"
                checked={formData.isBestSeller}
                onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
              />
              <label htmlFor="bestCheck" className="form-check-label small fw-bold">
                Best Seller Badge
              </label>
            </div>

            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="newCheck"
                checked={formData.isNewArrival}
                onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
              />
              <label htmlFor="newCheck" className="form-check-label small fw-bold">
                New Arrival Badge
              </label>
            </div>

            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="activeCheck"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              />
              <label htmlFor="activeCheck" className="form-check-label small fw-bold text-success">
                Published & Active
              </label>
            </div>
          </div>

          <div className="d-flex gap-3">
            <button
              type="submit"
              className="btn btn-toy-primary px-4 py-2 d-flex align-items-center gap-2"
              disabled={loading}
            >
              <Save size={16} /> {loading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
            </button>
            <Link to="/admin/products" className="btn btn-light border px-4 py-2">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
