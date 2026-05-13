import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Header.module.css";
import { useCart } from "../../context/CartContext";

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);


  return (
    <header className={styles.header}>
      <div className={styles.logo}>🎮 FRIKI SHOP</div>

      <nav className={styles.nav}>
        <Link to="/">Inicio</Link>
        <Link to="/tienda">Tienda</Link>
        <Link to="/ofertas">Ofertas</Link>
        <Link to="/carrito">Carrito ({totalItems})</Link>
      </nav>

      <div className={styles.userActions}>
        {user ? (
          <>
            {user && ["admin", "manager"].includes(user.role.toLowerCase()) ? (
              <Link to="/admin" className={styles.userName}>
                {user.name}
              </Link>
            ) : (
              <span className={styles.userName}>Hola, {user.name}</span>
            )}
            <button className={styles.logoutBtn} onClick={logout}>Salir</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </header>
  );
}
