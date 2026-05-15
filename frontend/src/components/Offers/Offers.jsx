import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import API_URL from "../../config/api.js";
import styles from "./Offers.module.css";

export default function Offers() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/api/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();

        // 🔥 Sacamos SOLO variantes en oferta
        const offerVariants = [];

        data.forEach((product) => {
          const variants = product.variants || [];

          variants.forEach((variant) => {
            if (variant.salePrice !== null && variant.salePrice !== undefined) {
              offerVariants.push({
                productId: product.id,
                productName: product.name,
                ...variant,
              });
            }
          });
        });

        setOffers(offerVariants);
      } catch (err) {
        console.error("Error fetching offers:", err);
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  if (loading) {
    return <p>Cargando ofertas...</p>;
  }

  return (
    <section className={styles.offers}>
      <h2>Ofertas Especiales</h2>

      <div className={styles.banner}>🔥 SUPER OFERTAS DE HASTA EL -50%</div>

      <div className={styles.grid}>
        {offers.map((variant) => {
          const originalPrice = parseFloat(variant.compareAtPrice ?? variant.sellingPrice);
          const offerPrice = parseFloat(variant.salePrice);

          const discount = Math.round(
            ((originalPrice - offerPrice) / originalPrice) * 100
          );

          return (
            <div key={variant.id} className={styles.card}                 
              onClick={() =>
                navigate(`/product/${variant.id}`)
              }>
              <img
                src={variant.images?.[0]?.url || "/placeholder.jpg"}
                alt={`${variant.productName} ${variant.name}`}
              />
              <h3>
                {variant.productName}{" "}
                {variant.name ? `- ${variant.name}` : ""}
              </h3>

              <p className={styles.priceRow}>
                <span className={styles.old}>
                  €{originalPrice.toFixed(2)}
                </span>

                <span className={styles.new}>
                  €{offerPrice.toFixed(2)}
                </span>

                <span className={styles.discount}>
                  -{discount}%
                </span>
              </p>

              <button
                className={styles.addToCartBtn}
                onClick={() =>
                  addToCart({
                    productId: variant.productId,
                    variantId: variant.id,
                    name: variant.productName,
                    variantName: variant.name,
                    price: offerPrice,
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