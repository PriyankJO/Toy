import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Heart, ShieldCheck, Truck, RefreshCw, Send, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      toast.success('Thank you for subscribing to ToyWonder club! Check your inbox for ₹100 welcome gift code.');
      setEmail('');
    }
  };

  return (
    <footer className="pt-5 border-top" style={{ backgroundColor: '#ffffff', color: 'var(--color-text)' }}>
      {/* Trust Badges Bar */}
      <div className="container pb-5 border-bottom">
        <div className="row g-4 text-center">
          <div className="col-6 col-md-3">
            <div className="d-flex flex-column align-items-center">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mb-2 shadow-sm"
                style={{ width: 56, height: 56, backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
              >
                <ShieldCheck size={26} />
              </div>
              <h6 className="fw-bold mb-1">100% Certified Safe</h6>
              <p className="text-muted small mb-0">Non-toxic & EN71 compliant</p>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="d-flex flex-column align-items-center">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mb-2 shadow-sm"
                style={{ width: 56, height: 56, backgroundColor: 'var(--color-secondary-light)', color: '#0284c7' }}
              >
                <Truck size={26} />
              </div>
              <h6 className="fw-bold mb-1">Superfast Delivery</h6>
              <p className="text-muted small mb-0">Free shipping on orders &gt; ₹499</p>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="d-flex flex-column align-items-center">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mb-2 shadow-sm"
                style={{ width: 56, height: 56, backgroundColor: '#ffebeb', color: 'var(--color-accent)' }}
              >
                <RefreshCw size={26} />
              </div>
              <h6 className="fw-bold mb-1">7-Day Easy Returns</h6>
              <p className="text-muted small mb-0">Hassle-free replacements</p>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="d-flex flex-column align-items-center">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mb-2 shadow-sm"
                style={{ width: 56, height: 56, backgroundColor: 'var(--color-highlight-light)', color: '#b45309' }}
              >
                <Heart size={26} />
              </div>
              <h6 className="fw-bold mb-1">Loved by 50,000+ Kids</h6>
              <p className="text-muted small mb-0">Top-rated joyful toys</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container py-5">
        <div className="row g-4">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="rounded-circle p-2 bg-primary bg-opacity-10 text-primary d-inline-flex">
                <Sparkles size={24} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-primary)' }}>
                Toy<span style={{ color: 'var(--color-accent)' }}>Wonder</span>
              </span>
            </div>
            <p className="text-muted small mb-3" style={{ lineHeight: 1.7 }}>
              ToyWonder is on a mission to spark boundless imaginations, inspire early STEM learning, and deliver safe, durable smiles to children across India.
            </p>
            <div className="small text-muted d-flex flex-column gap-2">
              <div className="d-flex align-items-center gap-2">
                <MapPin size={16} color="var(--color-primary)" /> ToyWonder Plaza, MG Road, Bengaluru, 560001
              </div>
              <div className="d-flex align-items-center gap-2">
                <Phone size={16} color="var(--color-primary)" /> +91 (800) 123-4567 (Mon-Sat, 9AM-8PM)
              </div>
              <div className="d-flex align-items-center gap-2">
                <Mail size={16} color="var(--color-primary)" /> support@toywonder.com
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="fw-bold mb-3" style={{ color: 'var(--color-text)' }}>Top Categories</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-muted mb-0">
              <li><Link to="/shop?category=soft-toys" className="hover-link">Soft Plush Toys</Link></li>
              <li><Link to="/shop?category=educational-toys" className="hover-link">STEM & Robots</Link></li>
              <li><Link to="/shop?category=building-blocks" className="hover-link">Magnetic Blocks</Link></li>
              <li><Link to="/shop?category=remote-control-toys" className="hover-link">RC Cars & Drones</Link></li>
              <li><Link to="/shop?category=board-games" className="hover-link">Family Games</Link></li>
              <li><Link to="/shop?category=baby-toys" className="hover-link">Infant & Teething</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="fw-bold mb-3" style={{ color: 'var(--color-text)' }}>Customer Care</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-muted mb-0">
              <li><Link to="/my-orders" className="hover-link">Track Your Order</Link></li>
              <li><Link to="/about" className="hover-link">About Our Toys</Link></li>
              <li><Link to="/faq" className="hover-link">Help & FAQs</Link></li>
              <li><Link to="/contact" className="hover-link">Contact Support</Link></li>
              <li><Link to="/privacy-policy" className="hover-link">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover-link">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="col-lg-4 col-md-6">
            <h6 className="fw-bold mb-2 d-flex align-items-center gap-2">
              <Sparkles size={18} className="text-warning" /> Join the ToyWonder Club
            </h6>
            <p className="text-muted small mb-3">
              Get secret promotional coupons, birthday surprise treats for your child, and new toy releases!
            </p>
            <form onSubmit={handleSubscribe}>
              <div className="input-group mb-2">
                <input
                  type="email"
                  className="form-control rounded-start-pill py-2"
                  placeholder="Enter parent's email address..."
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="btn btn-toy-primary rounded-end-pill px-4">
                  <Send size={16} />
                </button>
              </div>
            </form>
            <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
              We respect your inbox. No spam, ever.
            </span>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="py-3 text-center border-top text-muted small" style={{ backgroundColor: '#fdfbf7' }}>
        <div className="container d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
          <span className="d-inline-flex align-items-center flex-wrap">
            © {new Date().getFullYear()} ToyWonder Inc. All rights reserved. Crafted with <Heart size={14} className="text-danger mx-1 inline" fill="currentColor" /> for curious little minds.
          </span>
          <div className="d-flex gap-3">
            <Link to="/privacy-policy" className="text-muted hover-link">Privacy</Link>
            <Link to="/terms" className="text-muted hover-link">Terms</Link>
            <Link to="/faq" className="text-muted hover-link">Safety Standards</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
