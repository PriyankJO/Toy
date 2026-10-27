import React from 'react';
import { useLocation } from 'react-router-dom';

export const Legal = () => {
  const location = useLocation();
  const isPrivacy = location.pathname.includes('privacy');

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="bg-white rounded-4 border p-4 p-md-5 shadow-sm">
          <h2 className="fw-bolder mb-3">
            {isPrivacy ? 'Privacy Policy' : 'Terms and Conditions'}
          </h2>
          <p className="text-muted small mb-4">Last Updated: October 2026</p>

          {isPrivacy ? (
            <div className="text-muted small" style={{ lineHeight: 1.8 }}>
              <h5 className="text-dark fw-bold mt-4">1. Information We Collect</h5>
              <p>
                We collect personal information that you provide when you register an account, make a purchase, or contact customer support, such as your name, delivery address, email, and phone number.
              </p>
              <h5 className="text-dark fw-bold mt-4">2. How We Use Your Data</h5>
              <p>
                Your information is used strictly to process orders, deliver toys, verify online payments, send tracking updates, and improve your shopping experience. We never sell your personal information to third parties.
              </p>
              <h5 className="text-dark fw-bold mt-4">3. Payment Security</h5>
              <p>
                All online payments are encrypted through industry-standard 256-bit SSL encryption via Razorpay. We do not store your credit card numbers or sensitive CVV codes on our servers.
              </p>
            </div>
          ) : (
            <div className="text-muted small" style={{ lineHeight: 1.8 }}>
              <h5 className="text-dark fw-bold mt-4">1. Acceptance of Terms</h5>
              <p>
                By accessing and using the ToyWonder website, you agree to comply with and be bound by these Terms and Conditions.
              </p>
              <h5 className="text-dark fw-bold mt-4">2. Product Orders & Pricing</h5>
              <p>
                Prices are listed in Indian Rupees (INR) and include applicable taxes unless specified otherwise. We reserve the right to correct any typographical pricing errors.
              </p>
              <h5 className="text-dark fw-bold mt-4">3. Safe Usage & Supervision</h5>
              <p>
                While all toys meet strict safety regulations, parents and guardians should always adhere to the recommended age guidance and supervise infant play appropriately.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
