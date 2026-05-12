import { BrowserRouter, Routes, Route } from "react-router-dom";

// 🛒 Componentes de la tienda friki
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Categories from "./components/Categories/Categories";
import FeaturedProducts from "./components/FeaturedProducts/FeaturedProducts";
import Offers from "./components/Offers/Offers";
import Footer from "./components/Footer/Footer";

// 🔐 Rutas protegidas
import ProtectedRoute from "./router/ProtectedRoute";

// 🧰 Panel Admin
import Dashboard from "./pages/Admin/Dashboard";
import ProductList from "./pages/Admin/ProductList";
import ProductDetail from "./pages/Admin/ProductDetail";
import ProductNew from "./pages/Admin/ProductNew";
import Login from "./pages/Admin/Login";
import Register from "./pages/Admin/Register";

// 🛒 Carrito
import Cart from "./pages/Cart/Cart";

export default function App() {
  return (
    <BrowserRouter>

      {/* HEADER GLOBAL */}
      <Header />

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

    </BrowserRouter>
  );
}
