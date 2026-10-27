import React, { useState } from 'react';
import { X, ShoppingCart, Heart, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const QuickViewModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [qty, setQty] = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);

  if (!product) return null;

  const effectivePrice = product.discountPrice ? product.discountPrice : product.price;
  const isDiscounted = product.discountPrice && product.discountPrice < product.price;
  const inWishlist = isInWishlist(product._id);
  const images = product.images && product.images.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80'
  ];

  const handleAdd = () => {
    addToCart(product, qty);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(32, 26, 53, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-4 shadow-lg overflow-hidden position-relative"
        style={{ maxWidth: '820px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="btn btn-light position-absolute top-0 end-0 m-3 rounded-circle p-2 border"
          style={{ zIndex: 10 }}
          onClick={onClose}
        >
          <X size={20} />
        </button>

        <div className="row g-0">
          {/* Product Gallery Left */}
          <div className="col-md-6 p-4 d-flex flex-column align-items-center justify-content-center bg-light">
            <div style={{ width: '100%', height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={images[selectedImg]}
                alt={product.name}
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>
            {images.length > 1 && (
              <div className="d-flex gap-2 mt-3 overflow-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className="p-1 rounded-3 bg-white border"
                    style={{
                      width: 55,
                      height: 55,
                      border: selectedImg === i ? '2px solid var(--color-primary)' : '1px solid #ddd'
                    }}
                  >
                    <img src={img} alt="Thumb" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Right */}
          <div className="col-md-6 p-4 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex gap-2 mb-2">
                <span className="toy-badge badge-purple">{product.category?.name || 'Toys'}</span>
                <span className="toy-badge badge-blue">Age: {product.ageGroup}</span>
              </div>

              <h4 style={{ fontWeight: 800 }}>{product.name}</h4>

              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="star-rating">
                  <Star size={16} fill="#f59e0b" color="#f59e0b" />
                </div>
                <span style={{ fontWeight: 700 }}>{product.rating}</span>
                <span className="text-muted small">({product.reviewCount || 0} reviews)</span>
                <span className="mx-2 text-muted">|</span>
                <span className="text-muted small">SKU: {product.SKU}</span>
              </div>

              <div className="d-flex align-items-baseline gap-3 mb-3">
                <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
                  ₹{effectivePrice}
                </span>
                {isDiscounted && (
                  <span className="text-muted text-decoration-line-through fs-5">
                    ₹{product.price}
                  </span>
                )}
              </div>

              <p className="text-muted small mb-3">
                {product.shortDescription || product.description}
              </p>

              {product.safetyInfo && (
                <div className="p-2 mb-3 rounded-3" style={{ background: '#f5f3ff', border: '1px solid #ede8ff' }}>
                  <div className="d-flex align-items-center gap-2 text-primary small fw-bold">
                    <ShieldCheck size={16} /> Certified Child-Safe
                  </div>
                  <p className="mb-0 text-muted" style={{ fontSize: '0.78rem' }}>
                    {product.safetyInfo}
                  </p>
                </div>
              )}
            </div>

            <div>
              {/* Quantity selector & Add to cart */}
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="d-flex align-items-center border rounded-pill bg-light px-2 py-1">
                  <button
                    className="btn btn-sm btn-link text-dark p-1"
                    disabled={qty <= 1}
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                  >
                    -
                  </button>
                  <span className="px-3 fw-bold">{qty}</span>
                  <button
                    className="btn btn-sm btn-link text-dark p-1"
                    disabled={qty >= product.stock}
                    onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                  >
                    +
                  </button>
                </div>
                <span className="small text-muted">
                  {product.stock > 0 ? `${product.stock} items available` : 'Out of stock'}
                </span>
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-toy-primary flex-grow-1"
                  disabled={product.stock <= 0}
                  onClick={handleAdd}
                >
                  <ShoppingCart size={18} /> Add {qty} to Cart
                </button>
                <button
                  className={`btn border rounded-circle p-2 ${inWishlist ? 'text-danger' : 'text-muted'}`}
                  style={{ width: 48, height: 48 }}
                  onClick={() => toggleWishlist(product)}
                >
                  <Heart size={20} fill={inWishlist ? 'var(--color-accent)' : 'none'} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
