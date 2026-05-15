import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useState } from 'react'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

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
              <div className={styles.dropdownContainer}>
                <button
                  className={styles.btnPrimary}
                  onClick={() => setShowDropdown(prev => !prev)}
                >
                  + Nuevo
                </button>

                {showDropdown && (
                  <div className={styles.dropdownMenu}>
                    <Link to="/admin/products/new">Producto</Link>
                    <Link to="/admin/products/newSupplier">Proveedor</Link>
                    <Link to="/admin/products/newCategory">Categoría</Link>
                  </div>
                )}
              </div>
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
