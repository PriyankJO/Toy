import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { EmptyState } from '../components/common/EmptyState';

export const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.items.length === 0) {
    return (
      <div className="py-5" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center' }}>
        <EmptyState
          icon={<ShoppingCart size={64} className="text-secondary" />}
          title="Your Shopping Cart is Empty"
          description="Looks like you haven't added any playful wonders to your cart yet. Discover our top-rated toys and brighten your child's day!"
          actionText="Start Shopping"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--color-bg)', minHeight: '80vh' }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bolder mb-1">Your Shopping Cart</h2>
            <p className="text-muted small mb-0">
              You have {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm rounded-pill px-3"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        </div>

        <div className="row g-4">
          {/* Cart Items List */}
          <div className="col-lg-8">
            <div className="bg-white rounded-4 border p-4 shadow-sm mb-4">
              <div className="d-flex flex-column gap-3">
                {cart.items.map((item) => {
                  const product = item.product;
                  const price = product.discountPrice || product.price;

                  return (
                    <div
                      key={item._id}
                      className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 p-3 rounded-3 border bg-light"
                    >
                      {/* Product Thumbnail & Title */}
                      <div className="d-flex align-items-center gap-3">
                        <Link to={`/products/${product.slug || product._id}`}>
                          <img
                            src={product.image || 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80'}
                            alt={product.name}
                            style={{
                              width: 75,
                              height: 75,
                              objectFit: 'contain',
                              backgroundColor: '#ffffff',
                              borderRadius: 12,
                              padding: 4
                            }}
                          />
                        </Link>
                        <div>
                          <Link
                            to={`/products/${product.slug || product._id}`}
                            className="text-dark fw-bold text-decoration-none"
                            style={{ fontSize: '0.98rem' }}
                          >
                            {product.name}
                          </Link>
                          <div className="text-muted small mt-1">
                            Unit Price: <span className="fw-bold text-primary">₹{price}</span>
                          </div>
                          {product.SKU && (
                            <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                              SKU: {product.SKU}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quantity & Item Subtotal */}
                      <div className="d-flex align-items-center justify-content-between justify-content-sm-end gap-4">
                        <div className="d-flex align-items-center border rounded-pill bg-white px-2 py-1">
                          <button
                            type="button"
                            className="btn btn-sm btn-link text-dark p-1"
                            disabled={item.quantity <= 1}
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-2 fw-bold small">{item.quantity}</span>
                          <button
                            type="button"
                            className="btn btn-sm btn-link text-dark p-1"
                            disabled={item.quantity >= product.stock}
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="text-end" style={{ minWidth: 80 }}>
                          <span className="fw-bolder fs-5 text-dark" style={{ fontFamily: 'var(--font-heading)' }}>
                            ₹{item.itemTotal || price * item.quantity}
                          </span>
                        </div>

                        <button
                          type="button"
                          className="btn btn-light rounded-circle text-danger p-2 border"
                          onClick={() => removeFromCart(item._id)}
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <Link to="/shop" className="btn btn-toy-outline btn-sm">
              ← Continue Shopping
            </Link>
          </div>

          {/* Cart Order Summary */}
          <div className="col-lg-4">
            <div className="bg-white rounded-4 border p-4 shadow-sm sticky-top" style={{ top: 90 }}>
              <h5 className="fw-bolder mb-3">Order Summary</h5>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal ({cart.totalItems} items)</span>
                <span className="fw-bold">₹{cart.subtotal}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Delivery Fee</span>
                <span>
                  {cart.shippingFee === 0 ? (
                    <span className="text-success fw-bold">FREE</span>
                  ) : (
                    `₹${cart.shippingFee}`
                  )}
                </span>
              </div>

              {cart.shippingFee > 0 && (
                <div className="small text-muted p-2 rounded-2 bg-light mb-3 d-flex align-items-center gap-2" style={{ fontSize: '0.8rem' }}>
                  <Truck size={16} className="text-primary flex-shrink-0" />
                  <span>Add ₹{499 - cart.subtotal} more to unlock <strong>FREE Express Shipping</strong>!</span>
                </div>
              )}

              <hr />

              <div className="d-flex justify-content-between align-items-baseline mb-4">
                <span className="fw-bolder fs-5">Estimated Total</span>
                <span className="fw-bolder fs-4 text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
                  ₹{cart.total}
                </span>
              </div>

              <button
                type="button"
                className="btn btn-toy-primary w-100 py-3 d-flex align-items-center justify-content-center gap-2 mb-3"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <div className="text-center small text-muted d-flex align-items-center justify-content-center gap-2">
                <ShieldCheck size={16} color="var(--color-mint)" />
                Safe & Secure 256-Bit SSL Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
