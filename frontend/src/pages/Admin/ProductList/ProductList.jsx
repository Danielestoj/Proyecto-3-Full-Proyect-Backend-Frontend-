import { useState, useEffect, useMemo } from 'react'
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

  // 🔥 BUSCADOR
  const [search, setSearch] = useState('')
  const [searchType, setSearchType] = useState('product')

  const fetchProducts = (low = false) => {
    const token = localStorage.getItem('token')
    const query = low ? '?lowStock=true' : ''

    setLoading(true)

    fetch(`${API_URL}/api/products${query}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(r => r.json())
      .then(data => {
        const safe = Array.isArray(data) ? data : []

        setProducts(safe)

        // 🔥 APLANAR VARIANTES (CORREGIDO)
        const flat = safe.flatMap(product =>
          (product.variants || [])
            .filter(v => !lowStockOnly || v.stock <= v.minStock)
            .map(variant => ({
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

  // 🔥 FILTRADO + ORDENACIÓN
  const filteredRows = useMemo(() => {
    let result = [...rows]

    const term = search.toLowerCase().trim()

    // 🔍 FILTRAR
    if (term) {
      result = result.filter(row => {
        if (searchType === 'product') {
          return (
            row.productName?.toLowerCase().includes(term) ||
            row.name?.toLowerCase().includes(term) ||
            row.sku?.toLowerCase().includes(term)
          )
        }

        if (searchType === 'category') {
          return row.category?.name?.toLowerCase().includes(term)
        }

        if (searchType === 'supplier') {
          return row.supplier?.name?.toLowerCase().includes(term)
        }

        return true
      })
    }

    // 🔥 SI NO HAY TEXTO → ORDENAR
    else {
      if (searchType === 'category') {
        result.sort((a, b) =>
          (a.category?.name || '').localeCompare(b.category?.name || '')
        )
      }

      if (searchType === 'supplier') {
        result.sort((a, b) =>
          (a.supplier?.name || '').localeCompare(b.supplier?.name || '')
        )
      }

      if (searchType === 'product') {
        result.sort((a, b) =>
          (a.productName || '').localeCompare(b.productName || '')
        )
      }
    }

    return result
  }, [rows, search, searchType])

  if (loading) {
    return <div className={styles.center}>Cargando productos...</div>
  }

  return (
    <main className={styles.main}>

      {/* HEADER */}
      <div className={styles.header}>
        <h1>Productos ({filteredRows.length})</h1>

        <div className={styles.controls}>

          {/* 🔥 FILTRO */}
          <div className={styles.searchContainer}>

            <select
              value={searchType}
              onChange={e => setSearchType(e.target.value)}
              className={styles.searchSelect}
            >
              <option value="product">Producto</option>
              <option value="category">Categoría</option>
              <option value="supplier">Proveedor</option>
            </select>

            <input
              type="text"
              placeholder={
                searchType === 'product'
                  ? 'Buscar producto...'
                  : searchType === 'category'
                  ? 'Buscar categoría...'
                  : 'Buscar proveedor...'
              }
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* STOCK BAJO */}
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={e => setLowStockOnly(e.target.checked)}
            />
            Solo productos sin stock
          </label>

          {/* NUEVO PRODUCTO */}
          {['MANAGER', 'ADMIN'].includes(usuario?.role) && (
            <Link to="/products/new" className={styles.btnNew}>
              + Nuevo producto
            </Link>
          )}
        </div>
      </div>

      {/* TABLA */}
      {filteredRows.length === 0 ? (
        <p className={styles.empty}>
          No se encontraron productos.
        </p>
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
              {filteredRows.map(row => (
                <tr key={row.id}>

                  <td>
                    <Link to={`/admin/products/${row.productId}`}>
                      {row.productName}
                    </Link>
                  </td>

                  <td>{row.name}</td>

                  <td className={styles.sku}>
                    {row.sku}
                  </td>

                  <td>
                    {row.category?.name || '-'}
                  </td>

                  <td>
                    {row.supplier?.name || '-'}
                  </td>

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
                      <span className={styles.badgeAlert}>
                        ⚠ Stock bajo
                      </span>
                    ) : (
                      <span className={styles.badgeOk}>
                        OK
                      </span>
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
