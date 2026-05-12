import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Inventory from "../pages/Admin/Inventory";
import Login from "../pages/Login/Login";
import ProtectedRoute from "./ProtectedRoute";
import Cart from "../pages/Cart/Cart";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/carrito" element={<Cart />} />


        {/* RUTA PROTEGIDA */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin", "manager"]}>
              <Inventory />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
