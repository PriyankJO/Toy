import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setSubmitting(true);
    const res = await register({ name, email, phone, password });
    setSubmitting(false);

    if (res.success) {
      navigate(redirect);
    }
  };

  return (
    <div
      className="py-5 d-flex align-items-center"
      style={{
        backgroundColor: 'var(--color-bg)',
        minHeight: '85vh',
        background: 'radial-gradient(circle at 90% 10%, rgba(98, 200, 245, 0.08) 0%, rgba(255, 253, 248, 1) 90%)'
      }}
    >
      <div className="container" style={{ maxWidth: '480px' }}>
        <div className="bg-white rounded-4 border p-4 p-md-5 shadow-sm">
          <div className="text-center mb-4">
            <div className="rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-2 shadow-sm text-white" style={{ background: 'linear-gradient(135deg, #FF786E 0%, #FFD85E 100%)' }}>
              <Sparkles size={32} />
            </div>
            <h3 className="fw-bolder mt-2 mb-1">Create Account</h3>
            <p className="text-muted small">Join ToyWonder and give your child the joy of playtime!</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Parent / Guardian Name *</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 rounded-start-3 text-muted">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 rounded-end-3"
                  placeholder="e.g. Ananya Deshmukh"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Email Address *</label>
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
              <label className="form-label small fw-bold text-muted">Phone Number</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 rounded-start-3 text-muted">
                  <Phone size={18} />
                </span>
                <input
                  type="tel"
                  className="form-control border-start-0 rounded-end-3"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">Password (min 6 characters) *</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 rounded-start-3 text-muted">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control border-start-0 border-end-0"
                  placeholder="Create secure password"
                  required
                  minLength={6}
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

            <div className="mb-4">
              <label className="form-label small fw-bold text-muted">Confirm Password *</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 rounded-start-3 text-muted">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  className="form-control border-start-0 rounded-end-3"
                  placeholder="Confirm password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-toy-primary w-100 py-2 mb-3 d-flex align-items-center justify-content-center gap-2"
              disabled={submitting}
            >
              {submitting ? 'Creating Account...' : 'Register Account'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="text-center small text-muted pt-2 border-top">
            Already have an account?{' '}
            <Link to={`/login${redirect !== '/' ? `?redirect=${redirect}` : ''}`} className="fw-bold text-primary text-decoration-none">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
