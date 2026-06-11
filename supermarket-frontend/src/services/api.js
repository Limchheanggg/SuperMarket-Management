import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const login = (data) => API.post("/api/auth/login", data);
export const register = (data) => API.post("/api/auth/register", data);
export const getMe = () => API.get("/api/auth/me");
export const updateMe = (data) => API.put("/api/auth/me", data);

// Products
export const getProducts = (params) => API.get("/api/products", { params });
export const getProduct = (id) => API.get(`/api/products/${id}`);
export const getCategories = () => API.get("/api/products/categories");
export const createProduct = (data) => API.post("/api/products/", data);
export const updateProduct = (id, data) => API.put(`/api/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/api/products/${id}`);

// Cart
export const getCart = () => API.get("/api/cart");
export const addToCart = (data) => API.post("/api/cart", data);
export const removeFromCart = (id) => API.delete(`/api/cart/${id}`);


// Inventory
export const getInventory = () => API.get("/api/inventory/");
export const restockProduct = (data) =>
  API.post("/api/inventory/restock", data);
export const adjustStock = (id, data) => API.put(`/api/inventory/${id}`, data);
export const getStockMovements = (id) =>
  API.get(`/api/inventory/movements/${id}`);

// Users
export const getEmployees = () => API.get("/api/users/employees");
export const createEmployee = (data) => API.post("/api/users/employees", data);
export const updateEmployee = (id, data) =>
  API.put(`/api/users/employees/${id}`, data);
export const deleteEmployee = (id) => API.delete(`/api/users/employees/${id}`);
export const getCustomers = () => API.get("/api/users/customers");
export const createCustomer = (data) => API.post("/api/users/customers", data);
export const updateCustomer = (id, data) =>
  API.put(`/api/users/customers/${id}`, data);
export const deleteCustomer = (id) => API.delete(`/api/users/customers/${id}`);

// Sales
export const getSales = () => API.get("/api/sales/");
export const getSaleDetail = (id) => API.get(`/api/sales/${id}`);
export const createSale = (data) => API.post("/api/sales/", data);
export const clearAllSales = () => API.delete("/api/sales/clear");
export const getDailyReport = () => API.get("/api/sales/reports/daily");
export const getSummaryReport = () => API.get("/api/sales/reports/summary");

// Membership
export const getMemberships = () => API.get("/api/membership/");
export const registerMembership = (data) =>
  API.post("/api/membership/register", data);
export const redeemPoints = (data) => API.post("/api/membership/redeem", data);
export const getCustomerMembership = (id) =>
  API.get(`/api/membership/customer/${id}`);
export const addPoints = (id, data) =>
  API.put(`/api/membership/add-points/${id}`, data);

export default API;

// Coupons
export const getCoupons       = ()       => API.get('/api/coupons/')
export const getActiveCoupons = ()       => API.get('/api/coupons/active')
export const createCoupon     = (data)   => API.post('/api/coupons/', data)
export const updateCoupon     = (id, data) => API.put(`/api/coupons/${id}`, data)
export const deleteCoupon     = (id)     => API.delete(`/api/coupons/${id}`)
export const validateCoupon   = (data)   => API.post('/api/coupons/validate', data)

// Suppliers
export const getSuppliers   = ()         => API.get('/api/suppliers/')
export const getSupplier    = (id)       => API.get(`/api/suppliers/${id}`)
export const createSupplier = (data)     => API.post('/api/suppliers/', data)
export const updateSupplier = (id, data) => API.put(`/api/suppliers/${id}`, data)
export const deleteSupplier = (id)       => API.delete(`/api/suppliers/${id}`)
