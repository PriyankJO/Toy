import React from 'react';
import { ShieldCheck, Heart, Sparkles, Smile, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <div className="py-5" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        <div className="text-center mb-5">
          <span className="toy-badge badge-purple mb-2">Our Story</span>
          <h1 className="display-5 fw-bolder mb-3">Sparking Smiles & Wonder Everyday!</h1>
          <p className="lead text-muted">
            ToyWonder was founded with one playful mission: to give every child safe, durable, and imaginative toys that turn screen-time into creative playtime.
          </p>
        </div>

        <div className="bg-white rounded-4 border p-4 p-md-5 shadow-sm mb-5">
          <h3 className="fw-bolder mb-3">Why Parents Choose ToyWonder</h3>
          <p className="text-muted" style={{ lineHeight: 1.8 }}>
            We believe play is the highest form of research for a child. Every toy on ToyWonder is rigorously tested for material safety, non-toxicity (BPA-free & lead-free), smooth finishes, and age-appropriate developmental enrichment. Whether it is a soft cuddly friend that comforts toddlers to sleep or a solar-powered robotics kit that teaches renewable engineering, our toys are made to last.
          </p>

          <div className="row g-4 mt-3">
            <div className="col-md-4">
              <div className="p-3 rounded-3 bg-light text-center h-100">
                <div className="p-2 rounded-circle bg-primary bg-opacity-10 text-primary d-inline-block mb-2">
                  <ShieldCheck size={28} />
                </div>
                <h6 className="fw-bold">100% Certified Safe</h6>
                <p className="small text-muted mb-0">EN71 & ASTM international child safety standards.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-3 rounded-3 bg-light text-center h-100">
                <div className="p-2 rounded-circle bg-success bg-opacity-10 text-success d-inline-block mb-2">
                  <Sparkles size={28} />
                </div>
                <h6 className="fw-bold">STEM & Creativity</h6>
                <p className="small text-muted mb-0">Curated by educators to boost problem-solving and motor skills.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-3 rounded-3 bg-light text-center h-100">
                <div className="p-2 rounded-circle bg-warning bg-opacity-10 text-warning d-inline-block mb-2">
                  <Heart size={28} />
                </div>
                <h6 className="fw-bold">Built for Long Play</h6>
                <p className="small text-muted mb-0">Ultra-durable, premium materials that endure energetic kids.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/shop" className="btn btn-toy-primary btn-lg px-5 d-inline-flex align-items-center gap-2">
            <span>Explore All Toys Now</span> <Sparkles size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
};
