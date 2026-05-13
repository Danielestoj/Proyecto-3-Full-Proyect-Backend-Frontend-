import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.brand}>📦 InventoryPro</Link>
      <div className={styles.links}>
        {user ? (
          <>
            <Link to="/">Página Principal</Link>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/products">Productos</Link>
            {['manager', 'admin'].includes(user.role) && (
              <Link to="/admin/products/new" className={styles.btnPrimary}>+ Producto</Link>
            )}
            <span className={styles.roleTag}>{user.role}</span>
            <button className={styles.btnLogout} onClick={logout}>Salir</button>
          </>
        ) : (
          <>
            <Link to="/login">Entrar</Link>
            <Link to="/register" className={styles.btnPrimary}>Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  )
}
