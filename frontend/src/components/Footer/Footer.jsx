import emailjs from "emailjs-com";
import { useState } from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      "service_9xbnfcx",
      "template_nyq9kwq",
      e.target,
      "b4Rp_U0UTQ-VANP7p"
    )
    .then(() => {
      setStatus("¡Gracias por suscribirte!");
      e.target.reset();
    })
    .catch(() => {
      setStatus("Hubo un error, inténtalo más tarde.");
    });
  };

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

      <form className={styles.newsletter} onSubmit={handleSubmit}>
        <input
          type="email"
          name="user_email"
          placeholder="Tu email..."
          required
        />
        <button type="submit">Suscribirse</button>
      </form>

      {status && <p className={styles.status}>{status}</p>}

    </footer>
  );
}
