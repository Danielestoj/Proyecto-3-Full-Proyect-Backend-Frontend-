import styles from "./Categories.module.css";

export default function Categories() {
  return (
    <section className={styles.categories}>
      <div className={styles.category}>🧸 Figuras Coleccionables</div>
      <div className={styles.category}>👕 Ropa & Accesorios</div>
      <div className={styles.category}>🎮 Juegos & Consolas</div>
    </section>
  );
}
