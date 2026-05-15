import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom"
import API_URL from "../../config/api.js";
import styles from "./FeaturedProducts.module.css";

export default function FeaturedProducts() {
  const { addToCart } = useCart();
  const navigate = useNavigate()

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
        {featured.map((product) => {

          const variant = product.variants?.[0];

          if (!variant) return null;

          return (
            <div key={variant.id} className={styles.card}
                onClick={() =>
                  navigate(`/product/${product.id}`)
                }>
              <img
                src={variant.images?.[0]?.url || "/placeholder.jpg"}
                alt={`${product.name} ${variant.name}`}
              />

              <h3>
                {product.name}
                {variant.name && ` - ${variant.name}`}
              </h3>

              <div className={styles.prices}>
                <p className={styles.price}>
                  €{parseFloat(variant.sellingPrice).toFixed(2)}
                </p>
              </div>

              <button
                className={styles.addToCartBtn}
                onClick={() =>
                  addToCart({
                    productId: product.id,
                    variantId: variant.id,
                    name: product.name,
                    variantName: variant.name,
                    price: variant.sellingPrice,
                    image: variant.images?.[0]?.url,
                    sku: variant.sku,
                  })
                }
              >
                Añadir al carrito
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}