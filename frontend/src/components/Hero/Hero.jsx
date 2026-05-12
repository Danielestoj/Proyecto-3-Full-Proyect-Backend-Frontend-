import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <h1>¡Tu tienda geek favorita!</h1>
      <p>Encuentra figuras, ropa, juegos y mucho más.</p>
      <button className={styles.btnPrimary}>Compra ahora</button>
    </section>
  );
}
