import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/common/ProductCard';
import { EmptyState } from '../components/common/EmptyState';

export const Wishlist = () => {
  const { wishlist, wishlistCount } = useWishlist();

  if (wishlistCount === 0) {
    return (
      <div className="py-5" style={{ minHeight: '75vh', display: 'flex', alignItems: 'center' }}>
        <EmptyState
          icon={<Heart size={64} className="text-secondary" fill="var(--color-accent-light)" />}
          title="Your Wishlist is Empty"
          description="You haven't saved any toys to your wishlist yet. Click the heart icon on any toy card to save your child's favorite picks!"
          actionText="Discover Joyful Toys"
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
            <h2 className="fw-bolder mb-1">My Wishlist</h2>
            <p className="text-muted small mb-0">
              {wishlistCount} {wishlistCount === 1 ? 'saved toy' : 'saved toys'} waiting for playtime
            </p>
          </div>
          <Link to="/shop" className="btn btn-toy-outline btn-sm">
            Explore More Toys →
          </Link>
        </div>

        <div className="row g-4">
          {wishlist.map((product) => (
            <div key={product._id} className="col-6 col-md-4 col-lg-3">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
