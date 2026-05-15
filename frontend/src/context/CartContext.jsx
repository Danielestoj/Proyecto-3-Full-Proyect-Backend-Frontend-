import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {

  const [cart, setCart] = useState([]);
  console.log("Carrito:", cart);

  // Cargar carrito desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // Guardar carrito en localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find(
        (p) =>
          p.productId === product.productId &&
          p.variantId === product.variantId
      );

      if (exists) {
        return prev.map((p) =>
          p.productId === product.productId &&
          p.variantId === product.variantId
            ? { ...p, qty: p.qty + 1 }
            : p
        );
      }

      return [...prev, { ...product, qty: 1 }];
    });
  };


  const removeFromCart = ({ productId, variantId }) => {
    setCart((prev) =>
      prev.filter(
        (p) =>
          !(p.productId === productId && p.variantId === variantId)
      )
    );
  };


  const clearCart = () => setCart([]);

  const increaseQty = ({ productId, variantId }) => {
    setCart(prev =>
      prev.map(item =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    );
  };

  const decreaseQty = ({ productId, variantId }) => {
    setCart(prev =>
      prev.map(item =>
        item.productId === productId &&
        item.variantId === variantId &&
        item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    );
  };



  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, increaseQty, decreaseQty }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
