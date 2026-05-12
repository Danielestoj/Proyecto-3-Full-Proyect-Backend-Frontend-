import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <a href="#">Sobre Nosotros</a>
        <a href="#">Preguntas Frecuentes</a>
        <a href="#">Contacto</a>
      </div>

      <div className={styles.social}>
        <a href="#">Facebook</a>
        <a href="#">Twitter</a>
        <a href="#">Instagram</a>
      </div>

      <form className={styles.newsletter}>
        <label>Suscríbete a nuestro newsletter:</label>
        <input type="email" placeholder="Tu email" />
        <button>Suscribirse</button>
      </form>
    </footer>
  );
}
