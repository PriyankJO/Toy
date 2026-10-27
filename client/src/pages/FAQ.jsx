import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const FAQ = () => {
  const faqs = [
    {
      q: 'Are all toys on ToyWonder safe and non-toxic?',
      a: 'Yes, absolutely. 100% of our products undergo stringent lab testing for EN71 and ASTM compliance. All plush toys use hypoallergenic filling and all plastics are BPA-free, lead-free, and phthalate-free.'
    },
    {
      q: 'What are the delivery charges and timelines?',
      a: 'Shipping is completely FREE on all orders over ₹499! For orders below ₹499, a flat fee of ₹50 applies. Standard metro delivery takes 2 to 3 business days, while non-metro regions typically receive delivery within 3 to 5 business days.'
    },
    {
      q: 'Can I pay via Cash on Delivery (COD)?',
      a: 'Yes! We support Cash on Delivery nationwide for all orders. You can also pay securely online using UPI, Credit/Debit cards, or Netbanking via Razorpay.'
    },
    {
      q: 'What is your return and refund policy?',
      a: 'We offer an easy 7-day return and replacement policy. If your toy arrives damaged, missing parts, or defective, contact us within 7 days of delivery for an instant replacement or refund.'
    },
    {
      q: 'How do I cancel an order?',
      a: 'You can cancel any order directly from your "My Orders" page as long as the status is "Pending" or "Confirmed". Once cancelled, your inventory is restored immediately.'
    },
    {
      q: 'How do discount coupons work?',
      a: 'Simply enter your coupon code (such as WONDER20 for 20% off) during checkout. The discount will instantly recalculate and display on your order summary before payment.'
    }
  ];

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        <div className="text-center mb-5">
          <span className="toy-badge badge-yellow mb-2">Help Center</span>
          <h1 className="display-6 fw-bolder mb-2">Frequently Asked Questions</h1>
          <p className="text-muted">Everything you need to know about ToyWonder toys, shipping, and guarantees.</p>
        </div>

        <div className="accordion d-flex flex-column gap-3 mb-5" id="faqAccordion">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-3 border p-3 shadow-sm">
              <h5 className="fw-bold mb-2 text-primary" style={{ fontSize: '1.05rem' }}>
                Q: {faq.q}
              </h5>
              <p className="text-muted small mb-0" style={{ lineHeight: 1.7 }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center p-4 bg-white rounded-4 border">
          <h5 className="fw-bold mb-2">Still have questions?</h5>
          <p className="text-muted small mb-3">Our friendly toy support specialists are always happy to assist you.</p>
          <Link to="/contact" className="btn btn-toy-primary btn-sm px-4">
            Contact Support Team
          </Link>
        </div>
      </div>
    </div>
  );
};
