import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success('Thank you for reaching out! Our support team will reply within 24 hours');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitting(false);
    }, 800);
  };

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        <div className="text-center mb-5">
          <span className="toy-badge badge-blue mb-2">We Are Here To Help</span>
          <h1 className="display-5 fw-bolder mb-2">Get in Touch with ToyWonder</h1>
          <p className="text-muted">Have a question about a toy, order status, or wholesale inquiry? Send us a message!</p>
        </div>

        <div className="row g-4">
          <div className="col-md-5">
            <div className="bg-white rounded-4 border p-4 shadow-sm h-100">
              <h5 className="fw-bold mb-3">Contact Information</h5>

              <div className="d-flex flex-column gap-3 small text-muted mb-4">
                <div className="d-flex gap-3 align-items-start">
                  <MapPin size={20} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-dark d-block">Headquarters</strong>
                    ToyWonder Plaza, MG Road, Bengaluru, Karnataka, 560001
                  </div>
                </div>

                <div className="d-flex gap-3 align-items-start">
                  <Phone size={20} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-dark d-block">Call Us</strong>
                    +91 (800) 123-4567 (Mon-Sat, 9AM - 8PM)
                  </div>
                </div>

                <div className="d-flex gap-3 align-items-start">
                  <Mail size={20} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-dark d-block">Email Support</strong>
                    support@toywonder.com
                  </div>
                </div>
              </div>

              <div className="p-3 bg-light rounded-3 small">
                <strong className="d-block mb-1 d-flex align-items-center gap-1"><Zap size={14} className="text-warning" /> Instant Answers?</strong>
                Check our <a href="/faq" className="text-primary fw-bold text-decoration-none">Frequently Asked Questions</a> for fast answers regarding shipping, tracking, and returns.
              </div>
            </div>
          </div>

          <div className="col-md-7">
            <div className="bg-white rounded-4 border p-4 shadow-sm">
              <h5 className="fw-bold mb-3">Send Us a Message</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Your Name *</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Email Address *</label>
                  <input
                    type="email"
                    className="form-control rounded-3"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Subject</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="e.g. Question about STEM robot kit"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">Message *</label>
                  <textarea
                    rows={4}
                    className="form-control rounded-3"
                    required
                    placeholder="Write your question or request..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-toy-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                  disabled={submitting}
                >
                  <Send size={16} /> {submitting ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
