import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  Award,
  Truck,
  Heart,
  ChevronRight,
  Flame,
  Zap,
  ShoppingBag,
  Baby,
  Smile,
  Palette,
  Rocket,
  Gift
} from 'lucide-react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { ProductCard } from '../components/common/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { FloatingDecoration } from '../components/common/FloatingDecoration';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [specialOffers, setSpecialOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedAgeTab, setSelectedAgeTab] = useState('3-5 Years');

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [catRes, featRes] = await Promise.all([
          categoryService.getCategories(),
          productService.getFeatured()
        ]);

        if (catRes.success) setCategories(catRes.categories || []);
        if (featRes.success && featRes.data) {
          setFeaturedProducts(featRes.data.featured || []);
          setBestSellers(featRes.data.bestSellers || []);
          setNewArrivals(featRes.data.newArrivals || []);
          setSpecialOffers(featRes.data.specialOffers || []);
        }
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const ageGroups = [
    { label: 'Infants (0-2 Yrs)', value: '0-2 Years', icon: Baby },
    { label: 'Toddlers (3-5 Yrs)', value: '3-5 Years', icon: Smile },
    { label: 'Kids (6-8 Yrs)', value: '6-8 Years', icon: Palette },
    { label: 'Big Kids (9-12 Yrs)', value: '9-12 Years', icon: Rocket }
  ];

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section
        className="position-relative overflow-hidden py-5 py-lg-6"
        style={{
          background: 'linear-gradient(180deg, #fff9f0 0%, #FFFDF8 100%)',
          minHeight: '82vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <FloatingDecoration />

        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center g-5">
            {/* Hero Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="col-lg-6 text-center text-lg-start"
            >
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{ background: '#ede8ff', border: '1px solid #d9ceff' }}>
                <Sparkles size={16} color="var(--color-primary)" />
                <span className="small fw-bold" style={{ color: 'var(--color-primary)' }}>
                  The Most Loved Kids Toy Destination in India
                </span>
              </div>

              <h1
                className="display-4 fw-bolder mb-3"
                style={{
                  color: 'var(--color-text)',
                  lineHeight: 1.15,
                  fontSize: 'calc(2rem + 2vw)'
                }}
              >
                Big Smiles Start with{' '}
                <span style={{ color: 'var(--color-primary)', position: 'relative' }}>
                  Little Toys!
                  <svg
                    style={{ position: 'absolute', bottom: -10, left: 0, width: '100%', height: 12 }}
                    viewBox="0 0 100 20"
                    preserveAspectRatio="none"
                  >
                    <path d="M0 15 Q50 0 100 15" stroke="var(--color-highlight)" strokeWidth="6" fill="transparent" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <p
                className="lead text-muted mb-4"
                style={{ fontSize: '1.15rem', lineHeight: 1.6 }}
              >
                Spark your child’s imagination with certified non-toxic plushies, solar STEM robotics, fast RC stunt buggies, and creative building blocks crafted for safe, joyful play.
              </p>

              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start mb-4">
                <Link to="/shop" className="btn btn-toy-primary btn-lg px-4 py-3">
                  <ShoppingBag size={20} /> Explore Toys
                </Link>
                <a href="#best-sellers" className="btn btn-toy-secondary btn-lg px-4 py-3">
                  <Flame size={20} /> Best Sellers
                </a>
              </div>

              {/* Trust Micro-Badges */}
              <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start gap-4 pt-3 border-top">
                <div className="d-flex align-items-center gap-2">
                  <ShieldCheck size={20} color="var(--color-mint)" />
                  <span className="small fw-bold text-muted">100% Non-Toxic</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Truck size={20} color="var(--color-secondary)" />
                  <span className="small fw-bold text-muted">Free Shipping &gt; ₹499</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Star size={18} fill="#f59e0b" color="#f59e0b" />
                  <span className="small fw-bold text-muted">4.9/5 Parent Rating</span>
                </div>
              </div>
            </motion.div>

            {/* Hero Right Visuals */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9 }}
              className="col-lg-6 position-relative text-center"
            >
              <div className="position-relative d-inline-block">
                {/* Main Featured Hero Toy Image */}
                <div
                  className="rounded-circle p-4 shadow-lg animate-float"
                  style={{
                    background: 'radial-gradient(circle, #ffffff 40%, #f6f0ff 100%)',
                    width: 'min(440px, 85vw)',
                    height: 'min(440px, 85vw)',
                    margin: '0 auto',
                    border: '8px solid rgba(255, 255, 255, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=700&q=80"
                    alt="Joyful Teddy Bear"
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.15))'
                    }}
                  />
                </div>

                {/* Floating Card: Best Seller Badge */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="position-absolute bg-white rounded-4 p-3 shadow-md border d-none d-sm-flex align-items-center gap-3"
                  style={{ top: '8%', left: '-8%', maxWidth: 220, textAlign: 'left' }}
                >
                  <div className="rounded-circle p-2 bg-warning bg-opacity-25 text-warning d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                    <Rocket size={24} color="#d97706" />
                  </div>
                  <div>
                    <div className="fw-bold small">STEM Wonder</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>12-in-1 Solar Robot</div>
                    <div className="text-primary fw-bold small">₹1,449</div>
                  </div>
                </motion.div>

                {/* Floating Card: Safety Certified */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="position-absolute bg-white rounded-4 p-3 shadow-md border d-none d-sm-flex align-items-center gap-3"
                  style={{ bottom: '8%', right: '-8%', maxWidth: 210, textAlign: 'left' }}
                >
                  <div className="rounded-circle p-2 bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center" style={{ width: 44, height: 44 }}>
                    <ShieldCheck size={24} color="#16a34a" />
                  </div>
                  <div>
                    <div className="fw-bold small">Child Safe</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>BPA-Free Certified</div>
                    <div className="badge badge-mint">EN71 Approved</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY SECTION */}
      <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="toy-badge badge-purple mb-2">Explore Categories</span>
              <h2 className="fw-bolder mb-1">Shop by Toy Category</h2>
              <p className="text-muted mb-0">Carefully curated toys designed for every curiosity and stage</p>
            </div>
            <Link to="/categories" className="btn btn-toy-outline btn-sm mt-3 mt-md-0">
              View All Categories <ChevronRight size={16} />
            </Link>
          </div>

          <div className="row g-3 g-md-4">
            {categories.map((cat) => (
              <div key={cat._id} className="col-6 col-md-4 col-lg-3">
                <Link
                  to={`/shop?category=${cat.slug}`}
                  className="category-card h-100 text-decoration-none"
                  style={{
                    backgroundColor: '#fffdf8',
                    border: '1.5px solid #f4efe4'
                  }}
                >
                  <div
                    className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center overflow-hidden"
                    style={{
                      width: 90,
                      height: 90,
                      backgroundColor: cat.color ? `${cat.color}15` : '#ede8ff',
                      padding: 8
                    }}
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                    />
                  </div>
                  <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '1rem' }}>
                    {cat.name}
                  </h6>
                  <span className="small text-muted">
                    {cat.itemCount !== undefined ? `${cat.itemCount} Toys` : 'Explore'}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED TOYS */}
      <section className="py-5" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="toy-badge badge-coral mb-2">Hand-Picked Wonders</span>
              <h2 className="fw-bolder mb-1">Featured Toys</h2>
              <p className="text-muted mb-0">Our top trending toys with stellar reviews and high replay value</p>
            </div>
            <Link to="/shop?featured=true" className="btn btn-toy-outline btn-sm mt-3 mt-md-0">
              See All Featured <ChevronRight size={16} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="row g-4">
              {featuredProducts.slice(0, 8).map((product) => (
                <div key={product._id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard product={product} onQuickView={setQuickViewProduct} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. PROMOTIONAL DISCOUNT BANNER */}
      <section className="py-4">
        <div className="container">
          <div
            className="rounded-4 p-4 p-md-5 text-white position-relative overflow-hidden shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #7657E8 0%, #ff786e 100%)'
            }}
          >
            <div className="position-absolute end-0 top-0 bottom-0 opacity-25 d-none d-lg-flex align-items-center justify-content-center p-4" style={{ right: '40px' }}>
              <Gift size={180} color="#ffffff" strokeWidth={1.2} />
            </div>
            <div className="row align-items-center position-relative" style={{ zIndex: 1 }}>
              <div className="col-lg-8">
                <span className="badge bg-warning text-dark px-3 py-1 rounded-pill fw-bold mb-3">
                  LIMITED TIME TOY FESTIVAL
                </span>
                <h2 className="display-6 fw-bold mb-2">Get Flat 20% OFF Everything!</h2>
                <p className="lead mb-4 opacity-90">
                  Use coupon code <span className="fw-bolder bg-white text-dark px-3 py-1 rounded-3">WONDER20</span> during checkout on all orders above ₹500.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Link to="/shop" className="btn btn-light fw-bold rounded-pill px-4 py-2 text-primary">
                    Shop Festival Deals
                  </Link>
                  <Link to="/register" className="btn btn-outline-light rounded-pill px-4 py-2">
                    Join ToyWonder Club
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BEST SELLERS SECTION */}
      <section id="best-sellers" className="py-5" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-4">
            <div>
              <span className="toy-badge badge-yellow mb-2 d-inline-flex align-items-center gap-1">
                <Flame size={14} /> Crowd Favorites
              </span>
              <h2 className="fw-bolder mb-1">Best Selling Toys</h2>
              <p className="text-muted mb-0">The toys kids can't put down and parents rave about</p>
            </div>
            <Link to="/shop?bestSeller=true" className="btn btn-toy-outline btn-sm mt-3 mt-md-0">
              View All Best Sellers <ChevronRight size={16} />
            </Link>
          </div>

          <div className="row g-4">
            {bestSellers.slice(0, 4).map((product) => (
              <div key={product._id} className="col-6 col-md-4 col-lg-3">
                <ProductCard product={product} onQuickView={setQuickViewProduct} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. AGE-BASED RECOMMENDATIONS */}
      <section className="py-5" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div className="text-center max-w-700 mx-auto mb-4">
            <span className="toy-badge badge-blue mb-2">Smart Age Guide</span>
            <h2 className="fw-bolder mb-2">Find the Perfect Toy for Every Age</h2>
            <p className="text-muted">
              Select your child's age group to see developmentally tailored toys that stimulate growing minds.
            </p>

            {/* Age Filter Tabs */}
            <div className="d-flex flex-wrap justify-content-center gap-2 mt-4">
              {ageGroups.map((group) => (
                <button
                  key={group.value}
                  type="button"
                  onClick={() => setSelectedAgeTab(group.value)}
                  className={`btn rounded-pill px-3 py-2 fw-bold d-flex align-items-center gap-2 ${selectedAgeTab === group.value ? 'btn-toy-primary' : 'btn-light border'}`}
                  style={{ fontSize: '0.9rem' }}
                >
                  {group.icon && <group.icon size={18} />}
                  <span>{group.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Age Group Filtered Toys Preview */}
          <div className="row g-4 mt-2">
            {[...featuredProducts, ...bestSellers]
              .filter((p) => p.ageGroup === selectedAgeTab)
              .slice(0, 4)
              .map((product) => (
                <div key={product._id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard product={product} onQuickView={setQuickViewProduct} />
                </div>
              ))}
          </div>

          <div className="text-center mt-4">
            <Link to={`/shop?ageGroup=${encodeURIComponent(selectedAgeTab)}`} className="btn btn-toy-outline">
              Explore All Toys for {selectedAgeTab} →
            </Link>
          </div>
        </div>
      </section>

      {/* 7. PARENT TESTIMONIALS */}
      <section className="py-5" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="toy-badge badge-purple mb-2">Real Stories</span>
            <h2 className="fw-bolder mb-1">Loved by Parents Across India</h2>
            <p className="text-muted">Over 10,000+ five-star reviews from happy moms, dads, and grandparents</p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-4 rounded-4 h-100 border bg-light d-flex flex-column justify-content-between shadow-sm">
                <div>
                  <div className="d-flex text-warning mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <p className="small text-muted mb-3" style={{ fontStyle: 'italic', lineHeight: 1.6 }}>
                    "The Barnaby Honey Bear is unbelievably soft! My 2-year-old daughter won't take naps without it. Delivery was prompt and packaging was eco-friendly."
                  </p>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                    alt="Pooja S."
                    className="rounded-circle"
                    style={{ width: 44, height: 44, objectFit: 'cover' }}
                  />
                  <div>
                    <div className="fw-bold small">Pooja Sharma</div>
                    <div className="text-muted small">Bengaluru • Mom of 2</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 rounded-4 h-100 border bg-light d-flex flex-column justify-content-between shadow-sm">
                <div>
                  <div className="d-flex text-warning mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <p className="small text-muted mb-3" style={{ fontStyle: 'italic', lineHeight: 1.6 }}>
                    "We bought the WonderSolar 12-in-1 Robot kit for our son's 7th birthday. Assembling the robot together was pure joy. Really high quality STEM kit!"
                  </p>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                    alt="Vikram R."
                    className="rounded-circle"
                    style={{ width: 44, height: 44, objectFit: 'cover' }}
                  />
                  <div>
                    <div className="fw-bold small">Vikram Rao</div>
                    <div className="text-muted small">Hyderabad • Dad of 7yo</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 rounded-4 h-100 border bg-light d-flex flex-column justify-content-between shadow-sm">
                <div>
                  <div className="d-flex text-warning mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <p className="small text-muted mb-3" style={{ fontStyle: 'italic', lineHeight: 1.6 }}>
                    "The MagnaTiles are worth every single rupee. The plastic is thick, certified safe, and the magnets hold up tall castle towers easily."
                  </p>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"
                    alt="Ananya D."
                    className="rounded-circle"
                    style={{ width: 44, height: 44, objectFit: 'cover' }}
                  />
                  <div>
                    <div className="fw-bold small">Ananya Deshmukh</div>
                    <div className="text-muted small">Mumbai • Kindergarten Educator</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
