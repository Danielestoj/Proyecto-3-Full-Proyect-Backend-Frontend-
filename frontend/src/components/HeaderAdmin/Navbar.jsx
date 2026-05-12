import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { usuario, logout } = useAuth()
  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.brand}>📦 InventoryPro</Link>
      <div className={styles.links}>
        {usuario ? (
          <>
            <Link to="/">Dashboard</Link>
            <Link to="/products">Productos</Link>
            {['MANAGER', 'ADMIN'].includes(usuario.role) && (
              <Link to="/products/new" className={styles.btnPrimary}>+ Producto</Link>
            )}
            <span className={styles.roleTag}>{usuario.role}</span>
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
