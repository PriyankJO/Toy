import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Plus, Trash2, KeyRound, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const Profile = () => {
  const { user, updateUser } = useAuth();

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // New Address fields
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: 'Karnataka',
    postalCode: '',
    isDefault: false
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setUpdatingProfile(true);
      const res = await authService.updateProfile({ name, phone });
      if (res.success) {
        updateUser(res.user);
        toast.success('Profile updated successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      setUpdatingPassword(true);
      const res = await authService.changePassword(currentPassword, newPassword);
      if (res.success) {
        toast.success(res.message);
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not change password');
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.addAddress(newAddress);
      if (res.success) {
        toast.success('Address saved successfully!');
        updateUser({ ...user, addresses: res.addresses });
        setShowAddressModal(false);
        setNewAddress({
          fullName: user?.name || '',
          phone: user?.phone || '',
          street: '',
          city: '',
          state: 'Karnataka',
          postalCode: '',
          isDefault: false
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not save address');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const res = await authService.deleteAddress(id);
      if (res.success) {
        toast.success('Address removed');
        updateUser({ ...user, addresses: res.addresses });
      }
    } catch (err) {
      toast.error('Could not delete address');
    }
  };

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--color-bg)', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <h2 className="fw-bolder mb-1">My Account</h2>
        <p className="text-muted small mb-4">Manage your personal profile, addresses, and account security</p>

        <div className="row g-4">
          {/* Profile Details Form */}
          <div className="col-md-6">
            <div className="bg-white rounded-4 border p-4 shadow-sm h-100">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <User size={20} className="text-primary" /> Personal Details
              </h5>

              <form onSubmit={handleUpdateProfile}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Full Name</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Email (Read-only)</label>
                  <input
                    type="email"
                    className="form-control rounded-3 bg-light"
                    disabled
                    value={user?.email || ''}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control rounded-3"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-toy-primary btn-sm px-4"
                  disabled={updatingProfile}
                >
                  {updatingProfile ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          </div>

          {/* Change Password Form */}
          <div className="col-md-6">
            <div className="bg-white rounded-4 border p-4 shadow-sm h-100">
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <KeyRound size={20} className="text-primary" /> Change Password
              </h5>

              <form onSubmit={handleChangePassword}>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Current Password</label>
                  <input
                    type="password"
                    className="form-control rounded-3"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">New Password (min 6 chars)</label>
                  <input
                    type="password"
                    className="form-control rounded-3"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-toy-secondary btn-sm px-4"
                  disabled={updatingPassword}
                >
                  {updatingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>

          {/* Saved Addresses Book */}
          <div className="col-12">
            <div className="bg-white rounded-4 border p-4 shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <MapPin size={20} className="text-primary" /> Saved Delivery Addresses
                </h5>
                <button
                  type="button"
                  className="btn btn-sm btn-toy-primary"
                  onClick={() => setShowAddressModal(true)}
                >
                  <Plus size={16} /> Add New Address
                </button>
              </div>

              {(!user?.addresses || user.addresses.length === 0) ? (
                <p className="text-muted small mb-0">
                  No saved addresses yet. Add an address for faster 1-click checkout!
                </p>
              ) : (
                <div className="row g-3">
                  {user.addresses.map((addr) => (
                    <div key={addr._id} className="col-md-6">
                      <div className="p-3 rounded-3 border bg-light h-100 position-relative">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <span className="fw-bold">{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="badge badge-mint small">Default</span>
                          )}
                        </div>
                        <div className="small text-muted mb-1">{addr.street}</div>
                        <div className="small text-muted mb-2">
                          {addr.city}, {addr.state} - {addr.postalCode}
                        </div>
                        <div className="small text-muted mb-2 d-flex align-items-center gap-1">
                          <Phone size={13} className="text-primary" /> {addr.phone}
                        </div>

                        <button
                          type="button"
                          className="btn btn-sm text-danger p-0 d-flex align-items-center gap-1 small"
                          onClick={() => handleDeleteAddress(addr._id)}
                        >
                          <Trash2 size={14} /> Remove Address
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div
          className="position-fixed inset-0 bg-dark bg-opacity-50 z-3 d-flex align-items-center justify-content-center p-3"
          style={{ top: 0, bottom: 0, left: 0, right: 0, zIndex: 1060 }}
          onClick={() => setShowAddressModal(false)}
        >
          <div
            className="bg-white rounded-4 p-4 shadow-lg"
            style={{ maxWidth: 500, width: '100%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="fw-bold mb-3">Add New Shipping Address</h5>
            <form onSubmit={handleAddAddress}>
              <div className="mb-2">
                <label className="form-label small fw-bold text-muted">Full Name *</label>
                <input
                  type="text"
                  className="form-control form-control-sm rounded-3"
                  required
                  value={newAddress.fullName}
                  onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                />
              </div>

              <div className="mb-2">
                <label className="form-label small fw-bold text-muted">Phone *</label>
                <input
                  type="tel"
                  className="form-control form-control-sm rounded-3"
                  required
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                />
              </div>

              <div className="mb-2">
                <label className="form-label small fw-bold text-muted">Street / Flat *</label>
                <input
                  type="text"
                  className="form-control form-control-sm rounded-3"
                  required
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                />
              </div>

              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted">City *</label>
                  <input
                    type="text"
                    className="form-control form-control-sm rounded-3"
                    required
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-bold text-muted">State *</label>
                  <input
                    type="text"
                    className="form-control form-control-sm rounded-3"
                    required
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">PIN Code *</label>
                <input
                  type="text"
                  maxLength={6}
                  className="form-control form-control-sm rounded-3"
                  required
                  value={newAddress.postalCode}
                  onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-light btn-sm"
                  onClick={() => setShowAddressModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-toy-primary btn-sm px-4">
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
