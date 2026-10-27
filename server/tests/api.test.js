const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const app = require('../src/app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

let server;
let baseUrl;

test.before(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/toywonder');
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  baseUrl = `http://localhost:${port}/api`;
});

test.after(async () => {
  await mongoose.disconnect();
  await new Promise((resolve) => server.close(resolve));
});

test('GET /api/health should return ok status', async () => {
  const res = await fetch(`${baseUrl}/health`);
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(data.status, 'ok');
});

test('GET /api/categories should return all 8 categories with product counts', async () => {
  const res = await fetch(`${baseUrl}/categories`);
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(data.success, true);
  assert.equal(data.categories.length, 8);
});

test('GET /api/products should return paginated products', async () => {
  const res = await fetch(`${baseUrl}/products?page=1&limit=6`);
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(data.success, true);
  assert.equal(data.products.length, 6);
  assert.ok(data.total >= 24);
});

test('GET /api/products/featured should return featured sections', async () => {
  const res = await fetch(`${baseUrl}/products/featured`);
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(data.success, true);
  assert.ok(Array.isArray(data.data.featured));
  assert.ok(Array.isArray(data.data.bestSellers));
});

test('POST /api/coupons/validate should validate valid coupon', async () => {
  const res = await fetch(`${baseUrl}/coupons/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: 'WONDER20', orderSubtotal: 1000 })
  });
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(data.success, true);
  assert.equal(data.coupon.discountAmount, 200);
});

test('POST /api/auth/login with invalid credentials should fail with 401', async () => {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'fake@example.com', password: 'wrong' })
  });
  const data = await res.json();
  assert.equal(res.status, 401);
  assert.equal(data.success, false);
});

test('POST /api/auth/login with admin credentials should return admin role and token', async () => {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@toywonder.com', password: 'Admin@123' })
  });
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(data.success, true);
  assert.equal(data.user.role, 'admin');
  assert.ok(data.token);
});

test('Customer token accessing admin dashboard should be blocked with 403', async () => {
  // Login as customer
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'alice@example.com', password: 'Customer@123' })
  });
  const loginData = await loginRes.json();
  const customerToken = loginData.token;

  // Try to access admin dashboard
  const adminRes = await fetch(`${baseUrl}/admin/dashboard/stats`, {
    headers: { Authorization: `Bearer ${customerToken}` }
  });
  const adminData = await adminRes.json();
  assert.equal(adminRes.status, 403);
  assert.equal(adminData.success, false);
});
