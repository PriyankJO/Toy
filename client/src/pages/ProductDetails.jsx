import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  Truck,
  Heart,
  ShoppingCart,
  Zap,
  CheckCircle2,
  AlertCircle,
  Share2,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/common/ProductCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export const ProductDetails = () => {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState(null);

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setSelectedImg(0);
        setQuantity(1);
        const res = await productService.getProduct(idOrSlug);
        if (res.success && res.product) {
          setProduct(res.product);
          setRelatedProducts(res.relatedProducts || []);

          // Load reviews
          const reviewRes = await productService.getReviews(res.product._id);
          if (reviewRes.success) {
            setReviews(reviewRes.reviews || []);
          }
        }
      } catch (err) {
        console.error('Fetch product error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [idOrSlug]);

  if (loading) {
    return (
      <div className="py-5">
        <LoadingSpinner text="Unwrapping toy details..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h3>Toy Not Found</h3>
        <p className="text-muted">The toy you are looking for may have rolled away or is no longer available.</p>
        <Link to="/shop" className="btn btn-toy-primary">
          Browse All Toys
        </Link>
      </div>
    );
  }

  const effectivePrice = product.discountPrice ? product.discountPrice : product.price;
  const isDiscounted = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = isDiscounted
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const inWishlist = isInWishlist(product._id);
  const images = product.images && product.images.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80'
  ];

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setPincodeResult('Fast Delivery available! Estimated delivery in 2-3 business days.');
    } else {
      setPincodeResult('Please enter a valid 6-digit PIN code.');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Look at this awesome toy on ToyWonder: ${product.name}!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to submit a customer review');
      navigate('/login');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await productService.addReview(product._id, {
        rating: reviewRating,
        comment: reviewComment
      });

      if (res.success) {
        toast.success('Thank you! Your review has been saved');
        setReviewComment('');
        // Refresh reviews
        const reviewRes = await productService.getReviews(product._id);
        if (reviewRes.success) setReviews(reviewRes.reviews);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not post review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="py-4" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className="mb-4">
          <div className="d-flex align-items-center gap-2 small text-muted">
            <Link to="/" className="text-muted text-decoration-none">Home</Link>
            <span>/</span>
            <Link to="/shop" className="text-muted text-decoration-none">Shop</Link>
            <span>/</span>
            <Link to={`/shop?category=${product.category?.slug}`} className="text-muted text-decoration-none">
              {product.category?.name || 'Category'}
            </Link>
            <span>/</span>
            <span className="text-dark fw-bold text-truncate" style={{ maxWidth: 200 }}>{product.name}</span>
          </div>
        </nav>

        {/* Product Hero Details Grid */}
        <div className="row g-4 g-lg-5 mb-5">
          {/* Left Gallery */}
          <div className="col-lg-6">
            <div className="bg-white rounded-4 p-4 border shadow-sm sticky-top" style={{ top: 90 }}>
              <div
                className="d-flex align-items-center justify-content-center overflow-hidden position-relative mb-3 rounded-3"
                style={{ height: '420px', backgroundColor: '#fcfbf8' }}
              >
                <img
                  src={images[selectedImg]}
                  alt={product.name}
                  style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    transition: 'all 0.3s ease'
                  }}
                />

                {isDiscounted && (
                  <span
                    className="position-absolute top-0 start-0 m-3 toy-badge badge-coral shadow-sm"
                  >
                    -{discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="d-flex gap-2 justify-content-center">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImg(i)}
                      className="p-1 rounded-3 bg-white"
                      style={{
                        width: 70,
                        height: 70,
                        border: selectedImg === i ? '2.5px solid var(--color-primary)' : '1px solid #e5e0d4',
                        cursor: 'pointer'
                      }}
                    >
                      <img
                        src={img}
                        alt="Thumb"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Information */}
          <div className="col-lg-6">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div className="d-flex gap-2">
                <span className="toy-badge badge-purple">{product.category?.name || 'Toy'}</span>
                <span className="toy-badge badge-blue">Age: {product.ageGroup}</span>
                <span className="toy-badge badge-yellow">{product.brand}</span>
              </div>
              <button
                type="button"
                className="btn btn-light rounded-circle p-2 border"
                onClick={handleShare}
                title="Share Toy"
              >
                <Share2 size={18} />
              </button>
            </div>

            <h1 className="fw-bolder mb-2" style={{ fontSize: '2rem' }}>
              {product.name}
            </h1>

            {/* Rating & SKU */}
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="d-flex align-items-center gap-1">
                <div className="star-rating">
                  <Star size={18} fill="#f59e0b" color="#f59e0b" />
                </div>
                <span className="fw-bold">{product.rating?.toFixed(1)}</span>
                <span className="text-muted small">({product.reviewCount || 0} customer reviews)</span>
              </div>
              <span className="text-muted">|</span>
              <span className="text-muted small">SKU: <strong className="text-dark">{product.SKU}</strong></span>
            </div>

            {/* Price block */}
            <div className="p-3 mb-4 rounded-4 bg-white border d-flex align-items-baseline gap-3">
              <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>
                ₹{effectivePrice}
              </span>
              {isDiscounted && (
                <>
                  <span className="text-muted text-decoration-line-through fs-5">
                    ₹{product.price}
                  </span>
                  <span className="badge bg-success text-white rounded-pill px-2 py-1 small">
                    Save ₹{product.price - product.discountPrice}
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-muted mb-4" style={{ lineHeight: 1.7 }}>
              {product.shortDescription || product.description}
            </p>

            {/* Child Safety Assurance */}
            {product.safetyInfo && (
              <div className="p-3 mb-4 rounded-3 d-flex align-items-start gap-3" style={{ background: '#f5f3ff', border: '1px solid #ede8ff' }}>
                <ShieldCheck size={28} className="text-primary flex-shrink-0 mt-1" />
                <div>
                  <h6 className="fw-bold text-primary mb-1">Child Safety & Quality Certified</h6>
                  <p className="small text-muted mb-0">{product.safetyInfo}</p>
                </div>
              </div>
            )}

            {/* Stock Availability */}
            <div className="mb-4">
              {product.stock <= 0 ? (
                <div className="d-flex align-items-center gap-2 text-danger fw-bold">
                  <AlertCircle size={18} /> Out of stock. Backorder coming soon.
                </div>
              ) : product.stock <= 5 ? (
                <div className="d-flex align-items-center gap-2 text-warning fw-bold">
                  <AlertCircle size={18} /> Hurry! Only {product.stock} items left in stock.
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2 text-success fw-bold">
                  <CheckCircle2 size={18} /> In Stock ({product.stock} units ready to ship)
                </div>
              )}
            </div>

            {/* Quantity Selector & Action CTAs */}
            <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
              <div className="d-flex align-items-center border rounded-pill bg-white px-2 py-1">
                <button
                  type="button"
                  className="btn btn-sm btn-link text-dark fw-bold text-decoration-none px-2"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >
                  -
                </button>
                <span className="px-3 fw-bold">{quantity}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-dark fw-bold text-decoration-none px-2"
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="btn btn-toy-primary flex-grow-1 py-3 px-4"
                disabled={product.stock <= 0}
                onClick={handleAddToCart}
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>

              <button
                type="button"
                className="btn btn-toy-coral flex-grow-1 py-3 px-4"
                disabled={product.stock <= 0}
                onClick={handleBuyNow}
              >
                <Zap size={18} /> Buy Now
              </button>

              <button
                type="button"
                className={`btn border rounded-circle p-3 d-flex align-items-center justify-content-center ${inWishlist ? 'text-danger bg-danger bg-opacity-10' : 'bg-white text-muted'}`}
                style={{ width: 50, height: 50 }}
                onClick={() => toggleWishlist(product)}
                title="Wishlist"
              >
                <Heart size={22} fill={inWishlist ? 'var(--color-accent)' : 'none'} color={inWishlist ? 'var(--color-accent)' : '#888'} />
              </button>
            </div>

            {/* Pincode Delivery Check */}
            <div className="p-3 bg-white rounded-3 border mb-4">
              <label className="fw-bold small text-muted mb-2 d-flex align-items-center gap-1">
                <Truck size={16} /> Check Delivery to Your Pincode
              </label>
              <form onSubmit={handlePincodeCheck} className="d-flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode"
                  className="form-control form-control-sm rounded-pill"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                />
                <button type="submit" className="btn btn-sm btn-outline-primary rounded-pill px-3">
                  Check
                </button>
              </form>
              {pincodeResult && (
                <div className="small text-success mt-2 fw-semibold">
                  {pincodeResult}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Specifications & Description Tabs */}
        <div className="bg-white rounded-4 p-4 p-md-5 border mb-5 shadow-sm">
          <h4 className="fw-bolder mb-3">Full Product Description</h4>
          <p className="text-muted mb-4" style={{ lineHeight: 1.8 }}>
            {product.description}
          </p>

          <h5 className="fw-bold mb-3">Specifications</h5>
          <div className="table-responsive">
            <table className="table table-bordered table-striped small">
              <tbody>
                <tr>
                  <th style={{ width: '30%' }}>Recommended Age</th>
                  <td>{product.ageGroup}</td>
                </tr>
                <tr>
                  <th>Brand</th>
                  <td>{product.brand}</td>
                </tr>
                <tr>
                  <th>Material</th>
                  <td>{product.specifications?.material || 'Eco-friendly Plastic & Soft Cotton'}</td>
                </tr>
                <tr>
                  <th>Battery Requirement</th>
                  <td>{product.specifications?.batteryRequired || 'No'}</td>
                </tr>
                <tr>
                  <th>Dimensions / Weight</th>
                  <td>{product.specifications?.dimensions || 'Standard'} ({product.specifications?.weight || '350g'})</td>
                </tr>
                <tr>
                  <th>Country of Origin</th>
                  <td>{product.specifications?.origin || 'India'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Reviews & Add Review Form */}
        <div className="bg-white rounded-4 p-4 p-md-5 border mb-5 shadow-sm">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
            <div>
              <h4 className="fw-bolder mb-1">Customer Reviews</h4>
              <p className="text-muted small mb-0">Verified experiences from caring parents</p>
            </div>
            <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
              <div className="star-rating">
                <Star size={20} fill="#f59e0b" color="#f59e0b" />
              </div>
              <span className="fw-bold fs-5">{product.rating} / 5</span>
              <span className="text-muted small">({reviews.length} reviews)</span>
            </div>
          </div>

          {/* Add Review Box */}
          <div className="p-3 mb-4 rounded-3 bg-light border">
            <h6 className="fw-bold mb-2">Write a Review for this Toy</h6>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-2">
                <label className="small text-muted fw-bold me-2">Your Rating:</label>
                <div className="d-inline-flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="btn btn-sm btn-link p-0"
                      onClick={() => setReviewRating(star)}
                    >
                      <Star
                        size={20}
                        fill={star <= reviewRating ? '#f59e0b' : 'none'}
                        color="#f59e0b"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-2">
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Share how much your child enjoyed this toy, build quality, safety feedback..."
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-toy-primary btn-sm px-4"
                disabled={submittingReview}
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="d-flex flex-column gap-3">
            {reviews.length === 0 ? (
              <p className="text-muted text-center py-3">
                No reviews yet. Be the first to share your child's experience!
              </p>
            ) : (
              reviews.map((rev) => (
                <div key={rev._id} className="p-3 rounded-3 border bg-white">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={rev.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                        alt={rev.user?.name}
                        className="rounded-circle"
                        style={{ width: 34, height: 34, objectFit: 'cover' }}
                      />
                      <div>
                        <div className="fw-bold small">{rev.user?.name || 'Customer'}</div>
                        {rev.verifiedPurchase && (
                          <span className="badge badge-mint d-inline-flex align-items-center gap-1" style={{ fontSize: '0.65rem' }}>
                            <CheckCircle2 size={11} /> Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="d-flex text-warning">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>
                    {rev.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Toys */}
        {relatedProducts.length > 0 && (
          <div className="mb-4">
            <h4 className="fw-bolder mb-4">You May Also Like</h4>
            <div className="row g-4">
              {relatedProducts.map((p) => (
                <div key={p._id} className="col-6 col-md-3">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
