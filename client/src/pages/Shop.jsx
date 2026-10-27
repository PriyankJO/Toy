import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  ChevronDown,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pagination state
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters from query params
  const q = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || '';
  const selectedAge = searchParams.get('ageGroup') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const inStock = searchParams.get('inStock') === 'true';
  const hasDiscount = searchParams.get('hasDiscount') === 'true';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Fetch categories on mount
  useEffect(() => {
    categoryService.getCategories().then((res) => {
      if (res.success) setCategories(res.categories || []);
    });
  }, []);

  // Fetch products whenever search params change
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const params = {
          q: q || undefined,
          category: selectedCategory || undefined,
          ageGroup: selectedAge || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          inStock: inStock ? 'true' : undefined,
          hasDiscount: hasDiscount ? 'true' : undefined,
          sort,
          page,
          limit: 12
        };

        const res = await productService.getProducts(params);
        if (res.success) {
          setProducts(res.products || []);
          setTotalPages(res.totalPages || 1);
          setTotalCount(res.total || 0);
        }
      } catch (err) {
        console.error('Catalog fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [searchParams]);

  // Update query params helper
  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === '' || value === null || value === false) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter changes
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const ageGroups = ['0-2 Years', '3-5 Years', '6-8 Years', '9-12 Years', '12+ Years'];

  return (
    <div className="py-4" style={{ backgroundColor: 'var(--color-bg)', minHeight: '80vh' }}>
      <div className="container">
        {/* Header Breadcrumb / Title */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h2 className="fw-bolder mb-1">Explore All Toys</h2>
            <p className="text-muted small mb-0">
              Showing {products.length} of {totalCount} joyful products
            </p>
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-secondary d-lg-none d-flex align-items-center gap-2 rounded-pill px-3 py-2 small"
              onClick={() => setMobileFilterOpen(true)}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>

            <div className="d-flex align-items-center gap-2">
              <span className="small text-muted fw-bold d-none d-sm-inline">Sort by:</span>
              <select
                className="form-select form-select-sm rounded-pill px-3 py-2"
                style={{ width: 'auto', border: '1.5px solid #eae5d9' }}
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="popularity">Popularity</option>
                <option value="rating">Top Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {(q || selectedCategory || selectedAge || minPrice || maxPrice || inStock || hasDiscount) && (
          <div className="d-flex flex-wrap align-items-center gap-2 mb-4 p-2 bg-white rounded-3 border">
            <span className="small text-muted fw-bold ms-1">Active filters:</span>
            {q && (
              <span className="toy-badge badge-purple d-flex align-items-center gap-1">
                Search: "{q}" <X size={13} className="cursor-pointer" onClick={() => updateParam('q', '')} />
              </span>
            )}
            {selectedCategory && (
              <span className="toy-badge badge-blue d-flex align-items-center gap-1">
                Category: {selectedCategory} <X size={13} className="cursor-pointer" onClick={() => updateParam('category', '')} />
              </span>
            )}
            {selectedAge && (
              <span className="toy-badge badge-yellow d-flex align-items-center gap-1">
                Age: {selectedAge} <X size={13} className="cursor-pointer" onClick={() => updateParam('ageGroup', '')} />
              </span>
            )}
            {inStock && (
              <span className="toy-badge badge-mint d-flex align-items-center gap-1">
                In Stock Only <X size={13} className="cursor-pointer" onClick={() => updateParam('inStock', false)} />
              </span>
            )}
            {hasDiscount && (
              <span className="toy-badge badge-coral d-flex align-items-center gap-1">
                Deals Only <X size={13} className="cursor-pointer" onClick={() => updateParam('hasDiscount', false)} />
              </span>
            )}
            <button
              className="btn btn-sm text-danger p-0 ms-2 small fw-bold d-flex align-items-center gap-1"
              onClick={handleClearFilters}
            >
              <RotateCcw size={14} /> Reset All
            </button>
          </div>
        )}

        <div className="row g-4">
          {/* Desktop Filter Sidebar */}
          <aside className="col-lg-3 d-none d-lg-block">
            <div className="bg-white rounded-4 p-4 border shadow-sm sticky-top" style={{ top: 90 }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Filters</h5>
                <button
                  className="btn btn-sm btn-link text-muted text-decoration-none p-0 small"
                  onClick={handleClearFilters}
                >
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div className="mb-4">
                <label className="fw-bold small text-uppercase text-muted mb-2">Categories</label>
                <div className="d-flex flex-column gap-1">
                  <button
                    type="button"
                    className={`btn btn-sm text-start py-1 px-2 rounded-2 ${!selectedCategory ? 'bg-primary text-white fw-bold' : 'btn-light'}`}
                    onClick={() => updateParam('category', '')}
                  >
                    All Toys
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c._id}
                      type="button"
                      className={`btn btn-sm text-start py-1 px-2 rounded-2 d-flex justify-content-between align-items-center ${selectedCategory === c.slug ? 'bg-primary text-white fw-bold' : 'btn-light'}`}
                      onClick={() => updateParam('category', c.slug)}
                    >
                      <span>{c.name}</span>
                      <span className="badge rounded-pill bg-light text-dark small">{c.itemCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Group */}
              <div className="mb-4">
                <label className="fw-bold small text-uppercase text-muted mb-2">Age Group</label>
                <div className="d-flex flex-column gap-1">
                  {ageGroups.map((age) => (
                    <label key={age} className="form-check small d-flex align-items-center gap-2 mb-1 cursor-pointer">
                      <input
                        type="radio"
                        name="ageFilter"
                        className="form-check-input"
                        checked={selectedAge === age}
                        onChange={() => updateParam('ageGroup', selectedAge === age ? '' : age)}
                      />
                      <span>{age}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-4">
                <label className="fw-bold small text-uppercase text-muted mb-2">Price (₹)</label>
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="form-control form-control-sm rounded-pill"
                    value={minPrice}
                    onChange={(e) => updateParam('minPrice', e.target.value)}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="form-control form-control-sm rounded-pill"
                    value={maxPrice}
                    onChange={(e) => updateParam('maxPrice', e.target.value)}
                  />
                </div>
              </div>

              {/* Availability Checks */}
              <div>
                <label className="fw-bold small text-uppercase text-muted mb-2">Availability & Deals</label>
                <div className="form-check small mb-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="inStockCheck"
                    checked={inStock}
                    onChange={(e) => updateParam('inStock', e.target.checked)}
                  />
                  <label htmlFor="inStockCheck" className="form-check-label">
                    In Stock Only
                  </label>
                </div>
                <div className="form-check small">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="discountCheck"
                    checked={hasDiscount}
                    onChange={(e) => updateParam('hasDiscount', e.target.checked)}
                  />
                  <label htmlFor="discountCheck" className="form-check-label">
                    On Discount / Offers
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="col-lg-9">
            {loading ? (
              <LoadingSpinner text="Searching the toy wonderland..." />
            ) : products.length === 0 ? (
              <EmptyState
                icon={<Search size={64} className="text-secondary" />}
                title="No Toys Found"
                description="Try relaxing your filters, changing your price range, or searching for a different toy category."
                actionText="Reset All Filters"
                actionLink="/shop"
              />
            ) : (
              <>
                <div className="row g-3 g-md-4">
                  {products.map((product) => (
                    <div key={product._id} className="col-6 col-md-4">
                      <ProductCard product={product} onQuickView={setQuickViewProduct} />
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center align-items-center gap-2 mt-5">
                    <button
                      className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                      disabled={page <= 1}
                      onClick={() => updateParam('page', page - 1)}
                    >
                      Previous
                    </button>

                    {[...Array(totalPages)].map((_, i) => {
                      const pNum = i + 1;
                      return (
                        <button
                          key={pNum}
                          className={`btn btn-sm rounded-circle ${pNum === page ? 'btn-toy-primary' : 'btn-light border'}`}
                          style={{ width: 36, height: 36 }}
                          onClick={() => updateParam('page', pNum)}
                        >
                          {pNum}
                        </button>
                      );
                    })}

                    <button
                      className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                      disabled={page >= totalPages}
                      onClick={() => updateParam('page', page + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Drawer Filter Modal */}
      {mobileFilterOpen && (
        <div
          className="position-fixed inset-0 bg-dark bg-opacity-50 z-3 d-flex justify-content-end"
          style={{ top: 0, bottom: 0, left: 0, right: 0, zIndex: 1060 }}
          onClick={() => setMobileFilterOpen(false)}
        >
          <div
            className="bg-white p-4 h-100 overflow-auto"
            style={{ width: '320px', maxWidth: '85vw' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Filters</h5>
              <button className="btn btn-light rounded-circle p-1" onClick={() => setMobileFilterOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Mobile Categories */}
            <div className="mb-4">
              <label className="fw-bold small text-muted text-uppercase mb-2">Category</label>
              <select
                className="form-select form-select-sm"
                value={selectedCategory}
                onChange={(e) => updateParam('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Mobile Age Group */}
            <div className="mb-4">
              <label className="fw-bold small text-muted text-uppercase mb-2">Age Group</label>
              <select
                className="form-select form-select-sm"
                value={selectedAge}
                onChange={(e) => updateParam('ageGroup', e.target.value)}
              >
                <option value="">All Ages</option>
                {ageGroups.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <button
              className="btn btn-toy-primary w-100 mt-4"
              onClick={() => setMobileFilterOpen(false)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};
