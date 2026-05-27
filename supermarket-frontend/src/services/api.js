import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
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

// Products
export const getProducts = (params) => API.get("/api/products", { params });
export const getProduct = (id) => API.get(`/api/products/${id}`);
export const getCategories = () => API.get("/api/categories");
export const createProduct = (data) => API.post("/api/products/", data);

// Cart
export const getCart = () => API.get("/api/cart");
export const addToCart = (data) => API.post("/api/cart", data);
export const removeFromCart = (id) => API.delete(`/api/cart/${id}`);

// Orders
export const getOrders = () => API.get("/api/orders");
export const createOrder = (data) => API.post("/api/orders", data);

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
