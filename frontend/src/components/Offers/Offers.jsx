import { useCart } from "../../context/CartContext";
import { mockProducts } from "../../mocks/mockProducts";
import styles from "./Offers.module.css";

export default function Offers() {
  const { addToCart } = useCart();

  // Filtrar productos que tengan oferta
  const offers = mockProducts.filter(p => p.offerPrice !== undefined);

  return (
    <section className={styles.offers}>
      <h2>Ofertas Especiales</h2>

      <div className={styles.banner}>🔥 SUPER OFERTAS DE HASTA EL -50%</div>

      <div className={styles.grid}>
        {offers.map((product) => {
          const discount =
            Math.round(((product.sellingPrice - product.offerPrice) / product.sellingPrice) * 100);

          return (
            <div key={product.id} className={styles.card}>
              <h3>{product.name}</h3>

              <p className={styles.priceRow}>
                <span className={styles.old}>{product.sellingPrice}€</span>
                <span className={styles.new}>{product.offerPrice}€</span>
                <span className={styles.discount}>-{discount}%</span>
              </p>

              <button
                className={styles.addToCartBtn}
                onClick={() => addToCart(product)}
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
