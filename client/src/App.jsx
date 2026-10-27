import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Compass } from 'lucide-react';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './admin/AdminLayout';

// Public Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Categories } from './pages/Categories';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Wishlist } from './pages/Wishlist';
import { Checkout } from './pages/Checkout';
import { OrderSuccess } from './pages/OrderSuccess';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';
import { Legal } from './pages/Legal';

// Customer Pages
import { Profile } from './pages/Profile';
import { MyOrders } from './pages/MyOrders';
import { OrderDetailsPage } from './pages/OrderDetailsPage';

// Admin Pages
import { Dashboard } from './admin/Dashboard';
import { Products as AdminProducts } from './admin/Products';
import { ProductForm as AdminProductForm } from './admin/ProductForm';
import { Categories as AdminCategories } from './admin/Categories';
import { Orders as AdminOrders } from './admin/Orders';
import { Customers as AdminCustomers } from './admin/Customers';
import { Inventory as AdminInventory } from './admin/Inventory';
import { Coupons as AdminCoupons } from './admin/Coupons';
import { Reports as AdminReports } from './admin/Reports';

// Protected Route Component for Logged-In Customers
const CustomerRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Protected Route Component for Store Admins
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated && isAdmin ? children : <Navigate to="/login" replace />;
};

// 404 Page Component
const NotFound = () => (
  <div className="container py-5 text-center my-5">
    <div className="d-flex justify-content-center mb-3">
      <div className="rounded-circle p-4 bg-primary bg-opacity-10 text-primary d-inline-flex">
        <Compass size={64} />
      </div>
    </div>
    <h1 className="fw-bolder mt-3">404 - Page Rolled Away</h1>
    <p className="text-muted mb-4">
      The toy page you were looking for doesn't exist or has moved to another playroom.
    </p>
    <a href="/" className="btn btn-toy-primary">
      Return to ToyWonder Home
    </a>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#25253A',
                color: '#ffffff',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                borderRadius: '16px',
                padding: '12px 18px'
              }
            }}
          />

          <Routes>
            {/* Public & Customer Routes under PublicLayout */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="categories" element={<Categories />} />
              <Route path="products/:idOrSlug" element={<ProductDetails />} />
              <Route path="cart" element={<Cart />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-success/:id" element={<OrderSuccess />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="privacy-policy" element={<Legal />} />
              <Route path="terms" element={<Legal />} />

              {/* Protected Customer Routes */}
              <Route
                path="profile"
                element={
                  <CustomerRoute>
                    <Profile />
                  </CustomerRoute>
                }
              />
              <Route
                path="my-orders"
                element={
                  <CustomerRoute>
                    <MyOrders />
                  </CustomerRoute>
                }
              />
              <Route
                path="orders/:id"
                element={
                  <CustomerRoute>
                    <OrderDetailsPage />
                  </CustomerRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Protected Admin Routes under AdminLayout */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<AdminProductForm />} />
              <Route path="products/:id/edit" element={<AdminProductForm />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="coupons" element={<AdminCoupons />} />
              <Route path="reports" element={<AdminReports />} />
            </Route>
          </Routes>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
