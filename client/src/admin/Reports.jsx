import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Printer, TrendingUp, Calendar } from 'lucide-react';
import { adminService } from '../services/adminService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const Reports = () => {
  const [salesData, setSalesData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const [salesRes, statsRes] = await Promise.all([
          adminService.getSalesAnalytics(),
          adminService.getDashboardStats()
        ]);

        if (salesRes.success) setSalesData(salesRes.salesData || []);
        if (statsRes.success) setStats(statsRes.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-5">
        <LoadingSpinner text="Compiling financial sales report..." />
      </div>
    );
  }

  const avgOrderValue = stats?.totalOrders > 0
    ? Math.round(stats.totalRevenue / stats.totalOrders)
    : 0;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bolder mb-1" style={{ color: 'var(--color-text)' }}>
            Sales Reports & Analytics
          </h3>
          <p className="text-muted small mb-0">Financial statements and revenue metrics</p>
        </div>
        <button className="btn btn-outline-primary btn-sm rounded-pill px-3 d-flex align-items-center gap-1" onClick={handlePrint}>
          <Printer size={16} /> Print / Save PDF
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="admin-card text-center">
            <span className="small text-muted fw-bold d-block mb-1">Gross Store Revenue</span>
            <h3 className="fw-bolder text-primary mb-0">₹{stats?.totalRevenue?.toLocaleString('en-IN') || 0}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="admin-card text-center">
            <span className="small text-muted fw-bold d-block mb-1">Completed Order Volume</span>
            <h3 className="fw-bolder text-dark mb-0">{stats?.totalOrders || 0} orders</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="admin-card text-center">
            <span className="small text-muted fw-bold d-block mb-1">Average Order Value (AOV)</span>
            <h3 className="fw-bolder text-success mb-0">₹{avgOrderValue.toLocaleString('en-IN')}</h3>
          </div>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="bg-white rounded-4 border shadow-sm p-4">
        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
          <Calendar size={18} className="text-primary" /> Monthly Revenue Breakdown
        </h5>

        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle mb-0 small">
            <thead className="table-light">
              <tr>
                <th>Billing Period</th>
                <th>Orders Fulfilled</th>
                <th>Total Revenue (INR)</th>
                <th>Estimated Profit (est. 40%)</th>
              </tr>
            </thead>
            <tbody>
              {salesData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-3">No closed sales recorded yet.</td>
                </tr>
              ) : (
                salesData.map((row, i) => (
                  <tr key={i}>
                    <td><strong>{row.month}</strong></td>
                    <td>{row.orders} orders</td>
                    <td><strong className="text-primary">₹{row.revenue.toLocaleString('en-IN')}</strong></td>
                    <td className="text-success fw-bold">₹{Math.round(row.revenue * 0.4).toLocaleString('en-IN')}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
