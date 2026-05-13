import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'
import API_URL from '../../../config/api.js'
import styles from './ProductList.module.css'

export default function ProductList() {
  const { usuario } = useAuth()
  const [products, setProducts] = useState([])
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [lowStockOnly, setLowStockOnly] = useState(false)

  const fetchProducts = (low = false) => {
    const token = localStorage.getItem('token')
    const query = low ? '?lowStock=true' : ''

    setLoading(true)

    fetch(`${API_URL}/api/products${query}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => {
        const safe = Array.isArray(data) ? data : []
        setProducts(safe)

        // 🔥 APLANAR: cada variante = una fila
        const flat = safe.flatMap(product =>
          (product.variants || []).map(variant => ({
            productId: product.id,
            productName: product.name,
            category: product.category,
            supplier: product.supplier,
            ...variant
          }))
        )

        setRows(flat)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchProducts(lowStockOnly)
  }, [lowStockOnly])

  if (loading) return <div className={styles.center}>Cargando productos...</div>

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1>Productos ({rows.length})</h1>

        <div className={styles.controls}>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={e => setLowStockOnly(e.target.checked)}
            />
            Solo stock bajo
          </label>

          {['MANAGER', 'ADMIN'].includes(usuario?.role) && (
            <Link to="/products/new" className={styles.btnNew}>
              + Nuevo producto
            </Link>
          )}
        </div>
      </div>

      {rows.length === 0 ? (
        <p className={styles.empty}>No se encontraron productos.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Variante</th>
                <th>SKU</th>
                <th>Categoría</th>
                <th>Proveedor</th>
                <th>Precio compra</th>
                <th>Precio venta</th>
                <th>Oferta</th>
                <th>Stock</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {rows.map(row => (
                <tr key={row.id}>
                  <td>
                    <Link to={`/admin/products/${row.productId}`}>
                      {row.productName}
                    </Link>
                  </td>

                  <td>{row.name}</td>

                  <td className={styles.sku}>{row.sku}</td>

                  <td>{row.category?.name}</td>

                  <td>{row.supplier?.name}</td>

                  <td>
                    €{parseFloat(row.supplierPrice).toFixed(2)}
                  </td>

                  <td>
                    €{parseFloat(row.sellingPrice).toFixed(2)}
                  </td>

                  <td>
                    {row.salePrice
                      ? `€${parseFloat(row.salePrice).toFixed(2)}`
                      : '-'}
                  </td>

                  <td className={row.stock <= row.minStock ? styles.lowStock : ''}>
                    {row.stock}
                  </td>

                  <td>
                    {row.stock <= row.minStock ? (
                      <span className={styles.badgeAlert}>⚠ Stock bajo</span>
                    ) : (
                      <span className={styles.badgeOk}>OK</span>
                    )}
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