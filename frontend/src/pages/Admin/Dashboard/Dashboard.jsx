import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API_URL from '../../../config/api.js'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')

    fetch(`${API_URL}/api/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setData)
      .catch(err => {
        console.error('Dashboard error:', err)
        setData(null)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className={styles.center}>Cargando dashboard...</div>
  if (!data) return <div className={styles.center}>Error cargando datos.</div>

  return (
    <main className={styles.main}>
      <h1>Dashboard de Inventario</h1>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{data.totalProducts}</span>
          <span className={styles.statLabel}>Productos</span>
        </div>

        <div className={styles.stat}>
          <span className={styles.statValue}>{data.totalStock}</span>
          <span className={styles.statLabel}>Unidades en stock</span>
        </div>

        <div className={`${styles.stat} ${data.lowStockCount > 0 ? styles.warning : ''}`}>
          <span className={styles.statValue}>{data.lowStockCount}</span>
          <span className={styles.statLabel}>Alertas de stock bajo</span>
        </div>

        <div className={styles.stat}>
          <span className={styles.statValue}>
            €{data.totalValue?.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </span>
          <span className={styles.statLabel}>Valor total del inventario</span>
        </div>
      </div>

      {data.lowStockProducts?.length > 0 && (
        <section className={styles.section}>
          <h2>⚠️ Productos con stock bajo</h2>

          <ul className={styles.list}>
            {data.lowStockProducts.map(product => (
              <li key={product.id} className={`${styles.item} ${styles.alert}`}>
                
                <div>
                  <Link to={`/admin/products/${product.id}`} className={styles.productName}>
                    {product.name}
                  </Link>

                  <span className={styles.sku}>
                    {product.sku}
                  </span>
                </div>

                <div className={styles.stockBadge}>
                  {product.variants.map(v => (
                    <div key={v.id}>
                      Stock: {v.stock} / Mínimo: {v.minStock}
                    </div>
                  ))}
                </div>

              </li>
            ))}
          </ul>
        </section>
      )}

      <section className={styles.section}>
        <h2>Últimos movimientos</h2>

        <ul className={styles.list}>
          {data.recentMovements?.map(m => {
            const product = m.variant?.product

            return (
              <li key={m.id} className={styles.item}>
                <div>
                  <span
                    className={`${styles.movType} ${
                      m.type === 'IN' ? styles.in : styles.out
                    }`}
                  >
                    {m.type === 'IN' ? '↑ ENTRADA' : '↓ SALIDA'}
                  </span>

                  <Link to={`/products/${product?.id}`}>
                    {product?.name}
                  </Link>
                </div>

                <span className={styles.movMeta}>
                  {m.quantity} uds · {m.reason} · {m.user?.name}
                </span>
              </li>
            )
          })}
        </ul>
      </section>
    </main>
  )
}