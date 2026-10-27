import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  LogOut,
  ShieldAlert,
  Package,
  Layers,
  ChevronDown,
  Truck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { productService } from '../../services/productService';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close menus when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setSuggestions([]);
  }, [location.pathname]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions([]);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch product suggestions on search input
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await productService.getProducts({ q: searchQuery, limit: 5 });
        if (res.success && res.products) {
          setSuggestions(res.products);
        }
      } catch (err) {
        console.error('Search suggestions error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSuggestions([]);
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/shop' },
    { name: 'Categories', path: '/categories' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header className="sticky-top bg-white border-bottom shadow-sm" style={{ zIndex: 1020 }}>
      {/* Top Banner Notice */}
      <div
        className="py-1 px-3 text-center text-white small d-flex justify-content-center align-items-center gap-2"
        style={{
          background: 'linear-gradient(90deg, #7657E8 0%, #62C8F5 50%, #FF786E 100%)',
          fontWeight: 700,
          letterSpacing: '0.3px',
          fontSize: '0.82rem'
        }}
      >
        <span className="d-inline-flex align-items-center gap-1"><Truck size={14} /> Free Express Shipping on orders above ₹499! Use coupon</span>
        <span className="badge bg-white text-dark rounded-pill px-2 py-0">WONDER20</span>
        <span>for 20% OFF!</span>
      </div>

      {/* Main Navbar */}
      <div className="container py-2 d-flex align-items-center justify-content-between gap-3">
        {/* Brand Logo */}
        <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center shadow-sm text-white"
            style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #7657E8 0%, #62C8F5 100%)' }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.6rem',
                fontWeight: 900,
                color: 'var(--color-primary)',
                lineHeight: 1
              }}
            >
              Toy<span style={{ color: 'var(--color-accent)' }}>Wonder</span>
            </span>
            <span className="d-block text-muted" style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '1px' }}>
              PLAY • LEARN • SMILE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="d-none d-lg-flex align-items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`nav-link position-relative py-2 ${location.pathname === link.path ? 'text-primary fw-bold' : 'text-dark fw-semibold'}`}
              style={{
                fontSize: '0.96rem',
                transition: 'color 0.2s',
                color: location.pathname === link.path ? 'var(--color-primary)' : 'var(--color-text)'
              }}
            >
              {link.name}
              {location.pathname === link.path && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '18px',
                    height: '3px',
                    borderRadius: '2px',
                    backgroundColor: 'var(--color-primary)'
                  }}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Live Search Bar */}
        <div ref={searchRef} className="position-relative d-none d-md-block" style={{ width: '280px' }}>
          <form onSubmit={handleSearchSubmit}>
            <div className="input-group">
              <input
                type="text"
                className="form-control rounded-pill pe-5 py-2"
                style={{
                  backgroundColor: '#f7f5ef',
                  border: '1.5px solid #eae5d9',
                  fontSize: '0.88rem'
                }}
                placeholder="Search toys, lego, cars..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="btn position-absolute end-0 top-50 translate-middle-y me-1 rounded-circle p-1"
                style={{ color: 'var(--color-primary)' }}
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div
              className="position-absolute start-0 end-0 mt-2 bg-white rounded-3 shadow-lg p-2 border"
              style={{ zIndex: 1050, top: '100%' }}
            >
              <div className="small text-muted px-2 py-1 fw-bold">Toy Suggestions</div>
              {suggestions.map((p) => (
                <Link
                  key={p._id}
                  to={`/products/${p.slug || p._id}`}
                  onClick={() => setSuggestions([])}
                  className="d-flex align-items-center gap-2 p-2 rounded-2 text-decoration-none text-dark hover-bg-light"
                  style={{ transition: 'background 0.2s' }}
                >
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 6 }}
                  />
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="small fw-bold text-truncate">{p.name}</div>
                    <div className="small text-primary fw-semibold">₹{p.discountPrice || p.price}</div>
                  </div>
                </Link>
              ))}
              <div className="text-center pt-2 border-top mt-1">
                <Link
                  to={`/shop?q=${encodeURIComponent(searchQuery)}`}
                  className="small fw-bold text-primary text-decoration-none"
                  onClick={() => setSuggestions([])}
                >
                  View all results →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Actions: Wishlist, Cart, User Account */}
        <div className="d-flex align-items-center gap-2">
          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="btn btn-light rounded-circle position-relative p-2 d-flex align-items-center justify-content-center"
            style={{ width: 42, height: 42, border: '1px solid #ebe6dc' }}
            title="My Wishlist"
          >
            <Heart size={20} color="var(--color-accent)" />
            {wishlistCount > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: '0.68rem', padding: '3px 6px' }}
              >
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Link */}
          <Link
            to="/cart"
            className="btn btn-light rounded-circle position-relative p-2 d-flex align-items-center justify-content-center"
            style={{ width: 42, height: 42, border: '1px solid #ebe6dc' }}
            title="Shopping Cart"
          >
            <ShoppingCart size={20} color="var(--color-primary)" />
            {cart.totalItems > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill text-white"
                style={{ backgroundColor: 'var(--color-primary)', fontSize: '0.68rem', padding: '3px 6px' }}
              >
                {cart.totalItems}
              </span>
            )}
          </Link>

          {/* User Account Dropdown */}
          <div ref={dropdownRef} className="position-relative">
            {isAuthenticated ? (
              <button
                type="button"
                className="btn btn-light d-flex align-items-center gap-2 rounded-pill px-3 py-1 border"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={user?.name}
                  className="rounded-circle"
                  style={{ width: 28, height: 28, objectFit: 'cover' }}
                />
                <span className="small fw-bold d-none d-sm-inline" style={{ maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.name.split(' ')[0]}
                </span>
                <ChevronDown size={14} />
              </button>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-sm btn-toy-outline d-none d-sm-inline-flex">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-sm btn-toy-primary">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Dropdown Menu */}
            {isAuthenticated && userDropdownOpen && (
              <div
                className="position-absolute end-0 mt-2 bg-white rounded-3 shadow-lg p-2 border"
                style={{ width: 230, zIndex: 1050 }}
              >
                <div className="p-2 border-bottom mb-1">
                  <div className="fw-bold small text-truncate">{user?.name}</div>
                  <div className="text-muted small text-truncate">{user?.email}</div>
                  {isAdmin && (
                    <span className="badge badge-purple mt-1 d-inline-flex">Admin Account</span>
                  )}
                </div>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="dropdown-item py-2 px-3 rounded-2 d-flex align-items-center gap-2 text-primary fw-bold"
                  >
                    <ShieldAlert size={16} /> Admin Dashboard
                  </Link>
                )}

                <Link
                  to="/profile"
                  className="dropdown-item py-2 px-3 rounded-2 d-flex align-items-center gap-2"
                >
                  <UserIcon size={16} /> My Profile
                </Link>

                <Link
                  to="/my-orders"
                  className="dropdown-item py-2 px-3 rounded-2 d-flex align-items-center gap-2"
                >
                  <Package size={16} /> My Orders
                </Link>

                <Link
                  to="/wishlist"
                  className="dropdown-item py-2 px-3 rounded-2 d-flex align-items-center gap-2"
                >
                  <Heart size={16} /> Wishlist ({wishlistCount})
                </Link>

                <div className="border-top my-1" />

                <button
                  type="button"
                  className="dropdown-item py-2 px-3 rounded-2 d-flex align-items-center gap-2 text-danger"
                  onClick={logout}
                >
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="btn btn-light d-lg-none p-2 rounded-circle border"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="d-lg-none bg-white border-top p-3 shadow-sm">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control rounded-pill pe-5"
                placeholder="Search toys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="btn position-absolute end-0 top-50 translate-middle-y me-1 rounded-circle p-1"
                style={{ color: 'var(--color-primary)' }}
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          <div className="d-flex flex-column gap-2 mb-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`py-2 px-3 rounded-3 text-decoration-none fw-bold ${location.pathname === link.path ? 'bg-primary text-white' : 'text-dark'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {!isAuthenticated && (
            <div className="d-flex gap-2 pt-2 border-top">
              <Link to="/login" className="btn btn-toy-outline flex-grow-1 justify-content-center">
                Log In
              </Link>
              <Link to="/register" className="btn btn-toy-primary flex-grow-1 justify-content-center">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
