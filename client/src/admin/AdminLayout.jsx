import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Tag,
  ShoppingBag,
  Users,
  Boxes,
  TicketPercent,
  BarChart3,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Manage Products', path: '/admin/products', icon: Package },
    { name: 'Add Product', path: '/admin/products/new', icon: PlusCircle },
    { name: 'Categories', path: '/admin/categories', icon: Tag },
    { name: 'Manage Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Inventory', path: '/admin/inventory', icon: Boxes },
    { name: 'Coupons & Deals', path: '/admin/coupons', icon: TicketPercent },
    { name: 'Sales Reports', path: '/admin/reports', icon: BarChart3 }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: '#f8f7fb' }}>
      {/* Sidebar Desktop */}
      <aside
        className={`admin-sidebar d-none d-lg-flex flex-column justify-content-between p-3`}
      >
        <div>
          {/* Admin Brand */}
          <div className="d-flex align-items-center gap-2 px-3 py-3 mb-3 border-bottom border-secondary border-opacity-25">
            <div className="rounded-3 p-2 bg-primary bg-opacity-25 text-white d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
              <Sparkles size={22} className="text-warning" />
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>
                Toy<span style={{ color: 'var(--color-secondary)' }}>Admin</span>
              </span>
              <span className="badge bg-primary text-white d-block mt-1" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                STORE CONTROL
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="d-flex flex-column gap-1">
            {adminLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Info & Store Link */}
        <div className="pt-3 border-top border-secondary border-opacity-25 px-2">
          <Link
            to="/"
            target="_blank"
            className="btn btn-outline-light btn-sm w-100 mb-3 d-flex align-items-center justify-content-center gap-2 rounded-pill"
          >
            <ExternalLink size={14} /> View Live Store
          </Link>

          <div className="d-flex align-items-center justify-content-between px-2">
            <div className="d-flex align-items-center gap-2">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt="Admin"
                className="rounded-circle"
                style={{ width: 34, height: 34, objectFit: 'cover' }}
              />
              <div style={{ maxWidth: '120px' }}>
                <div className="small fw-bold text-white text-truncate">{user?.name}</div>
                <div className="text-muted small" style={{ fontSize: '0.7rem' }}>Super Admin</div>
              </div>
            </div>

            <button
              className="btn btn-sm text-danger p-1"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow-1 d-flex flex-column overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-bottom px-4 py-3 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-light d-lg-none border p-2 rounded-circle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={20} />
            </button>
            <h5 className="mb-0 fw-bold" style={{ fontFamily: 'var(--font-heading)' }}>
              ToyWonder Administration
            </h5>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="d-none d-sm-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-light border small text-muted">
              <span className="p-1 rounded-circle bg-success" />
              <span>MongoDB Online</span>
            </div>

            <Link to="/" className="btn btn-sm btn-toy-outline d-none d-sm-inline-flex">
              Customer Store
            </Link>
          </div>
        </header>

        {/* Mobile Sidebar Offcanvas */}
        {sidebarOpen && (
          <div
            className="d-lg-none position-fixed top-0 bottom-0 start-0 bg-dark p-3 z-3 text-white"
            style={{ width: 260, backgroundColor: '#201a35' }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="mb-0 text-white fw-bold">ToyAdmin</h5>
              <button className="btn btn-sm text-white" onClick={() => setSidebarOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <nav className="d-flex flex-column gap-2">
              {adminLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.exact}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>
            <div className="mt-4 pt-3 border-top">
              <button className="btn btn-danger btn-sm w-100" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          </div>
        )}

        {/* Admin Page Content */}
        <div className="p-4 flex-grow-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
