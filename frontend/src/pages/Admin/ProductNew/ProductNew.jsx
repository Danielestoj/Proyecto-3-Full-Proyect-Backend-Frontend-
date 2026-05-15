
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from '../../../config/api.js'
import styles from './ProductNew.module.css'

export default function ProductNew() {
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [suppliers, setSuppliers] = useState([])

  const [form, setForm] = useState({
    name: '',
    description: '',
    categoryId: '',
    supplierId: '',

    variantName: '',
    sku: '',
    imageUrl: '',
    language: '',
    condition: '',
    isFoil: false,
    isFirstEdition: false,
    availability: 'IN_STOCK',

    supplierPrice: '',
    retailPrice: '',
    sellingPrice: '',
    compareAtPrice: '',
    salePrice: '',

    stock: '',
    reservedStock: '',
    minStock: '',

    deliveryTime: '',
    supplierReference: '',
  })

  useEffect(() => {
  const token = localStorage.getItem('token')

  fetch(`${API_URL}/api/suppliers`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setSuppliers(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')

    fetch(`${API_URL}/api/categories`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const toNumber = (v) =>
    v === '' || v === null || v === undefined ? null : Number(v)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const token = localStorage.getItem('token')

    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description || null,
          categoryId: Number(form.categoryId),
          supplierId: Number(form.supplierId),

          variants: [
            {
              name: form.variantName || 'Default',
              sku: form.sku,
              imageUrl: form.imageUrl || null,

              language: form.language || null,
              condition: form.condition || null,
              isFoil: form.isFoil,
              isFirstEdition: form.isFirstEdition,
              availability: form.availability|| 'IN_STOCK',

              supplierPrice: toNumber(form.supplierPrice),
              retailPrice: toNumber(form.retailPrice),
              sellingPrice: toNumber(form.sellingPrice),
              compareAtPrice: toNumber(form.compareAtPrice),
              salePrice: toNumber(form.salePrice),

              stock: toNumber(form.stock) ?? 0,
              reservedStock: toNumber(form.reservedStock) ?? 0,
              minStock: toNumber(form.minStock) ?? 0,

              supplierReference: form.supplierReference || null,
              deliveryTime: toNumber(form.deliveryTime) ?? 0
            }
          ]
        })
      })
      console.log("FORM DATA:", form)
      console.log("supplierPrice:", toNumber(form.supplierPrice))
      console.log("retailPrice:", toNumber(form.retailPrice))
      console.log("sellingPrice:", toNumber(form.sellingPrice))


      const data = await res.json()

      if (!res.ok) {
        console.log('BACKEND ERROR:', data)
        throw new Error(data.error || 'Error creando producto')
      }

      navigate(`/admin/products/${data.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>

        <h1>Nuevo producto</h1>

        {error && <p className={styles.error}>{error}</p>}

        <h2>📦 Datos del producto</h2>

        <label>Nombre
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label>Descripción
          <textarea name="description" value={form.description} onChange={handleChange} rows="5" />
        </label>

        <label>Proveedor
          <select
            name="supplierId"
            value={form.supplierId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar...</option>

            {suppliers.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>


        <label>Categoría
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar...</option>

            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>


        {form.categoryId === 'new' && (
          <label>
            Nueva categoría
            <input
              type="text"
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              placeholder="Ej: Fundas"
              required
            />
          </label>
        )}

        <h2>🎴 Variante principal</h2>

        <label>Nombre variante
          <input name="variantName" value={form.variantName} onChange={handleChange} />
        </label>

        <label>SKU
          <input name="sku" value={form.sku} onChange={handleChange} required />
        </label>

        <label>Imagen URL
          <input name="imageUrl" value={form.imageUrl} onChange={handleChange} />
        </label>

        <div className={styles.row}>
          <label>
            <input type="checkbox" name="isFoil" checked={form.isFoil} onChange={handleChange} />
            Foil
          </label>

          <label>
            <input type="checkbox" name="isFirstEdition" checked={form.isFirstEdition} onChange={handleChange} />
            First Edition
          </label>
        </div>

        <h2>💰 Precios</h2>

        <div className={styles.grid}>
          <label>Compra
            <input type="number" name="supplierPrice" value={form.supplierPrice} onChange={handleChange} />
          </label>

          <label>PVP
            <input type="number" name="retailPrice" value={form.retailPrice} onChange={handleChange} />
          </label>

          <label>Venta
            <input type="number" name="sellingPrice" value={form.sellingPrice} onChange={handleChange} />
          </label>

          <label>Oferta
            <input type="number" name="salePrice" value={form.salePrice} onChange={handleChange} />
          </label>
        </div>

        <h2>📊 Stock</h2>

        <div className={styles.grid}>
          <label>Stock inicial
            <input type="number" name="stock" value={form.stock} onChange={handleChange} />
          </label>

          <label>Reservado
            <input type="number" name="reservedStock" value={form.reservedStock} onChange={handleChange} />
          </label>

          <label>Stock mínimo
            <input type="number" name="minStock" value={form.minStock} onChange={handleChange} />
          </label>
        </div>

        <h2>🚚 Logística</h2>

        <div className={styles.grid}>
          <label>Referencia proveedor
            <input name="supplierReference" value={form.supplierReference} onChange={handleChange} />
          </label>

          <label>Días entrega
            <input type="number" name="deliveryTime" value={form.deliveryTime} onChange={handleChange} />
          </label>
        </div>

        <label>Disponibilidad
        <select
          name="availability"
          value={form.availability}
          onChange={handleChange}
          required
        >
          <option value="IN_STOCK">En stock</option>
          <option value="OUT_OF_STOCK">Agotado</option>
          <option value="PREORDER">Preventa</option>
          <option value="DISCONTINUED">Descatalogado</option>
        </select>
      </label>


        <button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear producto'}
        </button>

      </form>
    </div>
  )
}