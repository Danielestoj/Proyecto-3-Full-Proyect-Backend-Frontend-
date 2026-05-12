import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'
import API_URL from '../../../config/api.js'
import styles from './ProductList.module.css'

export default function ProductList() {
  const { usuario } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [lowStockOnly, setLowStockOnly] = useState(false)

  const fetchProducts = (low = false) => {
    const token = localStorage.getItem('token')
    const query = low ? '?lowStock=true' : ''
    setLoading(true)
    fetch(`${API_URL}/api/products${query}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setProducts(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProducts(lowStockOnly) }, [lowStockOnly])

  if (loading) return <div className={styles.center}>Cargando productos...</div>

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1>Productos ({products.length})</h1>
        <div className={styles.controls}>
          <label className={styles.toggle}>
            <input type="checkbox" checked={lowStockOnly} onChange={e => setLowStockOnly(e.target.checked)} />
            Solo stock bajo
          </label>
          {['MANAGER', 'ADMIN'].includes(usuario?.role) && (
            <Link to="/products/new" className={styles.btnNew}>+ Nuevo producto</Link>
          )}
        </div>
      </div>

      {products.length === 0 ? (
        <p className={styles.empty}>No se encontraron productos.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>SKU</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Precio Venta</th>
                <th>Stock</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td><Link to={`/products/${p.id}`}>{p.name}</Link></td>
                  <td className={styles.sku}>{p.sku}</td>
                  <td>{p.category?.name}</td>
                  <td>€{parseFloat(p.price).toFixed(2)}</td>
                  <td>€{parseFloat(p.sellingPrice).toFixed(2)}</td>
                  <td className={p.stock <= p.minStock ? styles.lowStock : ''}>{p.stock}</td>
                  <td>
                    {p.stock <= p.minStock
                      ? <span className={styles.badgeAlert}>⚠ Stock bajo</span>
                      : <span className={styles.badgeOk}>OK</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
