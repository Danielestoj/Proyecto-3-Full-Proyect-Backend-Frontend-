import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/HeaderAdmin/Navbar";

// 🛒 Componentes de la tienda friki
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Categories from "./components/Categories/Categories";
import FeaturedProducts from "./components/FeaturedProducts/FeaturedProducts";
import Offers from "./components/Offers/Offers";
import Footer from "./components/Footer/Footer";
import StorePage from "./pages/Store/StorePage";

// 🔐 Rutas protegidas
import ProtectedRoute from "./router/ProtectedRoute";

// 🧰 Panel Admin
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import ProductList from "./pages/Admin/ProductList/ProductList";
import ProductDetail from "./pages/Admin/ProductDetail/ProductDetail";
import ProductNew from "./pages/Admin/ProductNew";
import Login from "./pages/Admin/Login";
import Register from "./pages/Admin/Register";

// 🛒 Carrito
import Cart from "./pages/Cart/Cart";

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* HEADER GLOBAL */}
      {isAdminRoute ? <Navbar /> : <Header />}

      <Routes>

        {/* 🏠 HOME (Tienda Friki) */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Categories />
              <FeaturedProducts />
              <Offers />
              <Footer />
            </>
          }
        />
        {/* 🛍️ TIENDA */}
        <Route path="/tienda" element={<StorePage />} />

        {/* 🔐 LOGIN / REGISTER */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🛒 CARRITO */}
        <Route path="/carrito" element={<Cart />} />

        {/* 🛠 PANEL ADMIN (solo admin/manager) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <ProductList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products/new"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <ProductNew />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products/:id"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <ProductDetail />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}