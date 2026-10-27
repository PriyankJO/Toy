import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Eye, Flame, Sparkles, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const ProductCard = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [adding, setAdding] = useState(false);

  const inWishlist = isInWishlist(product._id);
  const effectivePrice = product.discountPrice ? product.discountPrice : product.price;
  const isDiscounted = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = isDiscounted
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    setAdding(true);
    await addToCart(product, 1);
    setTimeout(() => setAdding(false), 600);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="toy-card">
      {/* Top Badges */}
      <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {product.isBestSeller && (
          <span className="toy-badge badge-yellow d-inline-flex align-items-center gap-1">
            <Flame size={12} /> Best Seller
          </span>
        )}
        {product.isNewArrival && (
          <span className="toy-badge badge-blue d-inline-flex align-items-center gap-1">
            <Sparkles size={12} /> New
          </span>
        )}
        {isDiscounted && (
          <span className="toy-badge badge-coral">-{discountPercent}% OFF</span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        type="button"
        className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
        onClick={handleWishlistToggle}
        aria-label="Save to Wishlist"
      >
        <Heart size={18} fill={inWishlist ? 'var(--color-accent)' : 'none'} color={inWishlist ? 'var(--color-accent)' : '#8b8ba0'} />
      </button>

      {/* Product Image */}
      <Link to={`/products/${product.slug || product._id}`} className="toy-card-img-wrap">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="toy-card-img"
          loading="lazy"
        />
      </Link>

      {/* Card Body */}
      <div className="p-3 d-flex flex-column flex-grow-1 justify-content-between">
        <div>
          {/* Category & Age Group */}
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="small text-muted" style={{ fontWeight: 600, fontSize: '0.78rem' }}>
              {product.category?.name || 'Toy'}
            </span>
            <span className="toy-badge badge-purple" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
              {product.ageGroup}
            </span>
          </div>

          {/* Product Title */}
          <h6 className="mb-2" style={{ fontWeight: 800, fontSize: '0.98rem', lineHeight: 1.35 }}>
            <Link
              to={`/products/${product.slug || product._id}`}
              style={{ color: 'var(--color-text)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
            >
              {product.name}
            </Link>
          </h6>

          {/* Ratings */}
          <div className="d-flex align-items-center gap-1 mb-2">
            <div className="star-rating">
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{product.rating?.toFixed(1) || '4.8'}</span>
            <span className="text-muted small">({product.reviewCount || 0})</span>
          </div>
        </div>

        <div>
          {/* Price & Stock */}
          <div className="d-flex align-items-baseline justify-content-between mb-3">
            <div className="d-flex align-items-baseline gap-2">
              <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
                ₹{effectivePrice}
              </span>
              {isDiscounted && (
                <span className="text-muted text-decoration-line-through small">
                  ₹{product.price}
                </span>
              )}
            </div>

            {isOutOfStock ? (
              <span className="badge bg-danger text-white rounded-pill px-2 py-1 small">Sold Out</span>
            ) : product.stock <= 5 ? (
              <span className="badge bg-warning text-dark rounded-pill px-2 py-1 small">Only {product.stock} left!</span>
            ) : (
              <span className="small text-success" style={{ fontWeight: 700 }}>In Stock</span>
            )}
          </div>

          {/* Action Buttons: Add to Cart & Quick View */}
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-toy-primary flex-grow-1 justify-content-center py-2"
              disabled={isOutOfStock || adding}
              onClick={handleAddToCart}
              style={{ fontSize: '0.88rem' }}
            >
              <ShoppingCart size={16} />
              {isOutOfStock ? 'Sold Out' : adding ? <span className="d-inline-flex align-items-center gap-1"><Check size={16} /> Added!</span> : 'Add to Cart'}
            </button>

            {onQuickView && (
              <button
                type="button"
                className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center border"
                style={{ width: 40, height: 40 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView(product);
                }}
                title="Quick View"
              >
                <Eye size={17} color="#6c7287" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
