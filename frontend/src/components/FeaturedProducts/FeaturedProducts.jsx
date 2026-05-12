import { useCart } from "../../context/CartContext";
import { mockProducts } from "../../mocks/mockProducts";
import styles from "./FeaturedProducts.module.css";

export default function FeaturedProducts() {
  const { addToCart } = useCart();

  // Tomar solo los 4 primeros productos
  const featured = mockProducts.slice(0, 4);

  return (
    <section className={styles.featured}>
      <h2>Productos Destacados</h2>

      <div className={styles.grid}>
        {featured.map((product) => {
          const hasOffer = product.offerPrice !== undefined;

          return (
            <div key={product.id} className={styles.card}>
              <img src={product.image} alt={product.name} />

              <h3>{product.name}</h3>
              <div className={styles.prices}>
                {/* Precios dinámicos */}
                {hasOffer ? (
                    <>
                    <p className={styles.oldPrice}>{product.sellingPrice}€</p>
                    <p className={styles.offerPrice}>{product.offerPrice}€</p>
                    </>
                ) : (
                    <p className={styles.price}>{product.price}€</p>
                )}
              </div>

              <button className={styles.addToCartBtn} onClick={() => addToCart(product)}>
                Añadir al carrito
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
