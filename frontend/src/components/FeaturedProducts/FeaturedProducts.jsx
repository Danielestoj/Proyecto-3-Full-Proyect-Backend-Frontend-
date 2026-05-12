import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import API_URL from "../../config/api.js";
import styles from "./FeaturedProducts.module.css";

export default function FeaturedProducts() {
  const { addToCart } = useCart();

  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/products/featured`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        // Asegurar array
        setFeatured(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  return (
    <section className={styles.featured}>
      <h2>Productos Destacados</h2>

      <div className={styles.grid}>
        {featured.map((product) => (
          <div key={product.id} className={styles.card}>
            <img
              src={product.image}
              alt={product.name}
            />

            <h3>{product.name}</h3>

            <div className={styles.prices}>
              <p className={styles.price}>
                €{parseFloat(product.sellingPrice).toFixed(2)}
              </p>
            </div>

            <button
              className={styles.addToCartBtn}
              onClick={() => addToCart(product)}
            >
              Añadir al carrito
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}