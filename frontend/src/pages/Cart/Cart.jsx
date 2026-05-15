import { useCart } from "../../context/CartContext";
import styles from "./Cart.module.css";

export default function Cart() {
  const { cart, removeFromCart, clearCart, increaseQty, decreaseQty } = useCart();

  if (!cart || cart.length === 0) {
    return <h2 className={styles.empty}>Tu carrito está vacío</h2>;
  }

  // Subtotal
  const subtotal = cart.reduce((acc, item) => {
    const price = item.offerPrice ?? item.price;
    return acc + price * item.qty;
  }, 0);

  const shipping = 5;
  const total = subtotal + shipping;

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>🛒 Tu Carrito</h1>

      <div className={styles.container}>
        {/* IZQUIERDA */}
        <div className={styles.left}>
          {cart.map((item) => {
            const hasOffer = item.offerPrice !== undefined;

            return (
              <div key={`${item.productId}-${item.variantId}`} className={styles.item}>
                <img src={item.image} alt={item.name} className={styles.image} />

                <div className={styles.info}>
                  <h3>{item.name}</h3>

                  {hasOffer ? (
                    <>
                      <p className={styles.oldPrice}>{item.price}€</p>
                      <p className={styles.offerPrice}>{item.offerPrice}€</p>
                    </>
                  ) : (
                    <p className={styles.price}>{item.price}€</p>
                  )}
                </div>
                {/* 🔥 Controles de cantidad */}
                <div className={styles.qtyControls}>
                  <button onClick={() => decreaseQty({
                    productId: item.productId,
                    variantId: item.variantId
                  })}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => increaseQty({
                    productId: item.productId,
                    variantId: item.variantId
                  })}>+</button>
                </div>

                <button
                  className={styles.remove}
                  onClick={() =>
                    removeFromCart({
                      productId: item.productId,
                      variantId: item.variantId
                    })
                  }
                >
                  Eliminar
                </button>
              </div>
            );
          })}

          <button className={styles.clear} onClick={clearCart}>
            Vaciar carrito
          </button>
        </div>

        {/* DERECHA */}
        <div className={styles.right}>
          <h2>Resumen del pedido</h2>

          <div className={styles.summaryRow}>
            <span>Subtotal:</span>
            <span>{subtotal.toFixed(2)}€</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Envío:</span>
            <span>{shipping.toFixed(2)}€</span>
          </div>

          <div className={styles.totalRow}>
            <strong>Total:</strong>
            <strong>{total.toFixed(2)}€</strong>
          </div>

          <button className={styles.checkout}>Finalizar compra</button>
        </div>
      </div>
    </div>
  );
}
