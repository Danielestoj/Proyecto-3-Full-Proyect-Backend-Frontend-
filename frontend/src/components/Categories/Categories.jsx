import styles from "./Categories.module.css";
import { useNavigate } from "react-router-dom";

export default function Categories() {

  const navigate = useNavigate();

  const goToCategory = (category) => {
    navigate(`/tienda?category=${category}`);
  };

  return (
    <section className={styles.categories}>

      <div
        className={styles.category}
        onClick={() => goToCategory("Accesorios")}
      >
        Accesorios
      </div>

      <div
        className={styles.category}
        onClick={() => goToCategory("Pokemon")}
      >
        Pokemon
      </div>

      <div
        className={styles.category}
        onClick={() => goToCategory("Magic")}
      >
        Magic
      </div>

      <div
        className={styles.category}
        onClick={() => goToCategory("Riftbound")}
      >
        Riftbound
      </div>

    </section>
  );
}