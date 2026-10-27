import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { adminService } from '../services/adminService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, salesRes, catRes] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getSalesAnalytics(),
          adminService.getCategoryAnalytics()
        ]);

        if (statsRes.success) {
          setStats(statsRes.stats);
          setRecentOrders(statsRes.recentOrders || []);
          setLowStockProducts(statsRes.lowStockProducts || []);
        }

        if (salesRes.success) {
          setSalesData(salesRes.salesData || []);
        }

        if (catRes.success) {
          setCategoryData(catRes.categoryDistribution || []);
          setTopProducts(catRes.topProducts || []);
        }
      } catch (err) {
        console.error('Admin dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="py-5">
        <LoadingSpinner text="Computing store analytics..." />
      </div>
    );
  }

  const COLORS = ['#7657E8', '#62C8F5', '#FF786E', '#FFD85E', '#8EE5BE', '#a78bfa', '#f43f5e', '#10b981'];

  return (
    <div>
      {/* Page Title */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bolder mb-1" style={{ color: 'var(--color-text)' }}>
            Store Performance Dashboard
          </h3>
          <p className="text-muted small mb-0">Live metrics from your MongoDB toy store database</p>
        </div>
        <Link to="/admin/products/new" className="btn btn-toy-primary btn-sm">
          + Add New Toy
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="row g-3 g-lg-4 mb-4">
        <div className="col-12 col-sm-6 col-xl-4">
          <div className="admin-card d-flex align-items-center gap-3">
            <div className="stat-icon-wrap" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
              <span className="fs-4 fw-bold">₹</span>
            </div>
            <div>
              <span className="small text-muted fw-bold d-block">Total Revenue</span>
              <h4 className="fw-bolder mb-0">₹{stats?.totalRevenue?.toLocaleString('en-IN') || 0}</h4>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-4">
          <div className="admin-card d-flex align-items-center gap-3">
            <div className="stat-icon-wrap" style={{ backgroundColor: 'var(--color-secondary-light)', color: '#0284c7' }}>
              <ShoppingBag size={24} />
            </div>
            <div>
              <span className="small text-muted fw-bold d-block">Total Orders</span>
              <h4 className="fw-bolder mb-0">{stats?.totalOrders || 0}</h4>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-4">
          <div className="admin-card d-flex align-items-center gap-3">
            <div className="stat-icon-wrap" style={{ backgroundColor: 'var(--color-mint-light)', color: '#059669' }}>
              <Package size={24} />
            </div>
            <div>
              <span className="small text-muted fw-bold d-block">Active Products</span>
              <h4 className="fw-bolder mb-0">{stats?.totalProducts || 0}</h4>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-4">
          <div className="admin-card d-flex align-items-center gap-3">
            <div className="stat-icon-wrap" style={{ backgroundColor: 'var(--color-highlight-light)', color: '#b45309' }}>
              <Users size={24} />
            </div>
            <div>
              <span className="small text-muted fw-bold d-block">Customer Accounts</span>
              <h4 className="fw-bolder mb-0">{stats?.totalCustomers || 0}</h4>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-4">
          <div className="admin-card d-flex align-items-center gap-3">
            <div className="stat-icon-wrap" style={{ backgroundColor: '#fff3cd', color: '#856404' }}>
              <Clock size={24} />
            </div>
            <div>
              <span className="small text-muted fw-bold d-block">Pending Orders</span>
              <h4 className="fw-bolder mb-0">{stats?.pendingOrders || 0}</h4>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-4">
          <div className="admin-card d-flex align-items-center gap-3">
            <div className="stat-icon-wrap" style={{ backgroundColor: '#ffe5e5', color: '#dc3545' }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <span className="small text-muted fw-bold d-block">Low Stock Items</span>
              <h4 className="fw-bolder mb-0 text-danger">{stats?.lowStockCount || 0}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="row g-4 mb-4">
        {/* Sales Trends Chart */}
        <div className="col-lg-8">
          <div className="admin-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Monthly Sales Revenue Trends</h5>
              <span className="badge badge-purple">Real Aggregation</span>
            </div>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData.length > 0 ? salesData : [{ month: 'Current', revenue: stats?.totalRevenue || 1000 }]}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7657E8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#7657E8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="month" stroke="#999" fontSize={12} />
                  <YAxis stroke="#999" fontSize={12} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#7657E8" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="col-lg-4">
          <div className="admin-card h-100">
            <h5 className="fw-bold mb-3">Category Distribution</h5>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={4}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Row: Recent Orders & Low Stock Alert */}
      <div className="row g-4">
        {/* Recent Orders */}
        <div className="col-lg-7">
          <div className="admin-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Recent Orders</h5>
              <Link to="/admin/orders" className="small text-primary fw-bold text-decoration-none">
                View All →
              </Link>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle small mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((ord) => (
                    <tr key={ord._id}>
                      <td className="fw-bold text-primary">{ord.orderNumber}</td>
                      <td>{ord.user?.name || ord.shippingAddress?.fullName || 'Customer'}</td>
                      <td className="fw-bold">₹{ord.total}</td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {ord.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="col-lg-5">
          <div className="admin-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0 text-danger d-flex align-items-center gap-2">
                <AlertTriangle size={18} /> Low Stock Watchlist
              </h5>
              <Link to="/admin/inventory" className="small text-primary fw-bold text-decoration-none">
                Inventory →
              </Link>
            </div>

            <div className="d-flex flex-column gap-2">
              {lowStockProducts.map((p) => (
                <div key={p._id} className="p-2 border rounded-3 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={p.images?.[0]}
                      alt={p.name}
                      style={{ width: 38, height: 38, objectFit: 'contain', borderRadius: 6 }}
                    />
                    <div>
                      <div className="fw-bold small text-truncate" style={{ maxWidth: 160 }}>{p.name}</div>
                      <div className="text-muted" style={{ fontSize: '0.75rem' }}>SKU: {p.SKU}</div>
                    </div>
                  </div>
                  <span className="badge bg-danger text-white rounded-pill px-2 py-1">
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
