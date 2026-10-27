import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PackageOpen } from 'lucide-react';

export const EmptyState = ({
  icon = null,
  title = 'No Toys Found',
  description = 'We could not find any toys matching your criteria. Try adjusting your search or filters!',
  actionText = 'Explore All Toys',
  actionLink = '/shop'
}) => {
  const renderIcon = () => {
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === 'function') {
      const IconComp = icon;
      return <IconComp size={64} className="text-secondary" />;
    }
    return <PackageOpen size={64} className="text-secondary" strokeWidth={1.5} />;
  };

  return (
    <div
      className="text-center py-5 px-3 mx-auto"
      style={{ maxWidth: '480px' }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="d-flex justify-content-center align-items-center mb-3"
      >
        <div className="rounded-circle p-4 bg-light border shadow-sm d-inline-flex">
          {renderIcon()}
        </div>
      </motion.div>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>{title}</h3>
      <p className="text-muted mb-4">{description}</p>
      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-toy-primary">
          {actionText}
        </Link>
      )}
    </div>
  );
};
