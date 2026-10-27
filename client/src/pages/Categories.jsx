import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../services/categoryService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Sparkles, ChevronRight } from 'lucide-react';

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        setLoading(true);
        const res = await categoryService.getCategories();
        if (res.success) {
          setCategories(res.categories || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCats();
  }, []);

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--color-bg)', minHeight: '80vh' }}>
      <div className="container">
        <div className="text-center mb-5" style={{ maxWidth: 650, margin: '0 auto' }}>
          <span className="toy-badge badge-purple mb-2">Toy Universes</span>
          <h2 className="display-6 fw-bolder mb-2">Explore All Categories</h2>
          <p className="text-muted">
            From huggable plushies to brain-boosting STEM robots, find exactly what sparks your little one's curiosity.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading toy worlds..." />
        ) : (
          <div className="row g-4">
            {categories.map((cat) => (
              <div key={cat._id} className="col-12 col-md-6 col-lg-3">
                <Link
                  to={`/shop?category=${cat.slug}`}
                  className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden text-decoration-none text-dark hover-lift"
                  style={{
                    backgroundColor: '#ffffff',
                    transition: 'all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)'
                  }}
                >
                  <div
                    className="p-4 d-flex align-items-center justify-content-center"
                    style={{
                      height: 200,
                      backgroundColor: cat.color ? `${cat.color}15` : '#f6f2fe'
                    }}
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      style={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                        objectFit: 'contain',
                        borderRadius: 16
                      }}
                    />
                  </div>
                  <div className="p-4 d-flex flex-column justify-content-between flex-grow-1">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <h5 className="fw-bolder mb-0" style={{ color: 'var(--color-text)' }}>
                          {cat.name}
                        </h5>
                        <span className="toy-badge badge-purple" style={{ fontSize: '0.72rem' }}>
                          {cat.itemCount || 0} Toys
                        </span>
                      </div>
                      <p className="text-muted small mt-2 mb-3">
                        {cat.description || 'Delightful toys for creative minds.'}
                      </p>
                    </div>
                    <div className="d-flex align-items-center gap-1 text-primary fw-bold small">
                      Explore Collection <ChevronRight size={16} />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
