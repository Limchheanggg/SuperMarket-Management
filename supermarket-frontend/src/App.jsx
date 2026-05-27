import { Routes, Route } from "react-router-dom"
import Layout from "./components/layout/Layout"
import Home from "./pages/Home"
import Shop from "./pages/Shop"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import OrderHistory from "./pages/OrderHistory"
import AccountSetting from "./pages/AccountSetting"
import Wishlist from "./pages/Wishlist"
import About from "./pages/About"
import Contact from "./pages/Contact"
import FAQ from "./pages/FAQ"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/common/ProtectedRoute"
import AdminLayout from "./pages/admin/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminInventory from "./pages/admin/AdminInventory"
import AdminUsers from "./pages/admin/AdminUsers"
import AdminSales from "./pages/admin/AdminSales"
import AdminMembership from "./pages/admin/AdminMembership"
import AdminReports from "./pages/admin/AdminReports"
import AdminRoute from "./components/common/AdminRoute"

export default function App() {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/account" element={<AccountSetting />} />
        </Route>
      </Route>

      {/* Admin Routes - fixed nesting */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="sales" element={<AdminSales />} />
          <Route path="membership" element={<AdminMembership />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
