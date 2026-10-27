import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      if (result.user.role === 'admin' && redirect === '/') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    }
  };

  const handleQuickCustomer = () => {
    setEmail('alice@example.com');
    setPassword('Customer@123');
  };

  const handleQuickAdmin = () => {
    setEmail('admin@toywonder.com');
    setPassword('Admin@123');
  };

  return (
    <div
      className="py-5 d-flex align-items-center"
      style={{
        backgroundColor: 'var(--color-bg)',
        minHeight: '80vh',
        background: 'radial-gradient(circle at 10% 20%, rgba(118, 87, 232, 0.05) 0%, rgba(255, 253, 248, 1) 90%)'
      }}
    >
      <div className="container" style={{ maxWidth: '460px' }}>
        <div className="bg-white rounded-4 border p-4 p-md-5 shadow-sm">
          {/* Logo / Header */}
          <div className="text-center mb-4">
            <div className="rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-2 shadow-sm text-white" style={{ background: 'linear-gradient(135deg, #7657E8 0%, #62C8F5 100%)' }}>
              <Sparkles size={32} />
            </div>
            <h3 className="fw-bolder mt-2 mb-1">Welcome Back!</h3>
            <p className="text-muted small">Sign in to your ToyWonder account</p>
          </div>

          {/* Quick Demo Autofill Bar */}
          <div className="p-3 mb-4 rounded-3 border bg-light text-center">
            <div className="small fw-bold text-muted mb-2 d-flex align-items-center justify-content-center gap-1">
              <Zap size={14} className="text-warning" /> Quick Demo One-Click Testing:
            </div>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-primary flex-grow-1 rounded-pill"
                onClick={handleQuickCustomer}
              >
                Demo Customer
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-dark flex-grow-1 rounded-pill"
                onClick={handleQuickAdmin}
              >
                Demo Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 rounded-start-3 text-muted">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  className="form-control border-start-0 rounded-end-3"
                  placeholder="parent@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 rounded-start-3 text-muted">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control border-start-0 border-end-0"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="input-group-text bg-light border-start-0 rounded-end-3 text-muted"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-toy-primary w-100 py-2 mt-2 mb-3 d-flex align-items-center justify-content-center gap-2"
              disabled={submitting}
            >
              {submitting ? 'Signing In...' : 'Sign In to ToyWonder'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="text-center small text-muted pt-2 border-top">
            Don't have an account yet?{' '}
            <Link to={`/register${redirect !== '/' ? `?redirect=${redirect}` : ''}`} className="fw-bold text-primary text-decoration-none">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
