import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from '../config/api.js'
import styles from './AuthForm.module.css'


export default function ProductNew() {
  const [form, setForm] = useState({ name: '', sku: '',  description: '', price: '', stock: '0', minStock: '5', categoryId: '' })
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch(`${API_URL}/api/categories`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setCategories(Array.isArray(d) ? d : []))
      .catch(() => {})
  }, [])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          retailPrice: Number(form.retailPrice),
          sellingPrice: Number(form.sellingPrice),
          stock: Number(form.stock),
          minStock: Number(form.minStock),
          categoryId: Number(form.categoryId),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      navigate(`/products/${data.id}`)
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
        <h4>Información del producto</h4>
        
          <label>Nombre<input type="text" name="name" value={form.name} onChange={handleChange} required /></label>
        <div className={styles.sectionInfo}>
          <label>SKU<input type="text" name="sku" value={form.sku} onChange={handleChange} required placeholder="Ej: LAP-HP-001" /></label>
          <label>Imagen<input type="url" name="imageUrl" value={form.imageUrl} onChange={handleChange} required placeholder="Ej: https://example.com/image.jpg" /></label>
        </div>
        <label> Información del producto <textarea name="description" value={form.description} onChange={handleChange} placeholder="Información detallada del producto..." rows="8"/> </label>
        <h4>Información de precios</h4>
        <div className={styles.sectionInfo}>
          <label>Precio (€)<input type="number" name="price" min="0" step="0.01" value={form.price} onChange={handleChange} required /></label>
          <label>Precio PVP(€)<input type="number" name="retailPrice" min="0" step="0.01" value={form.retailPrice} onChange={handleChange} required /></label>
          <label>Precio Venta(€)<input type="number" name="sellingPrice" min="0" step="0.01" value={form.sellingPrice} onChange={handleChange} required /></label>
        </div>
        <h4>Información de stock</h4>
        <div className={styles.sectionInfo}>
          <label>Stock inicial<input type="number" name="stock" min="0" value={form.stock} onChange={handleChange} /></label>
          <label>Stock mínimo<input type="number" name="minStock" min="0" value={form.minStock} onChange={handleChange} /></label>
        </div>
        <h4>Información del proveedor</h4>
        <div className={styles.sectionInfo}>
          <label>Proveedor<input type="text" name="supplier" value={form.supplier} onChange={handleChange} /></label>
          <label>Referencia del proveedor<input type="url" name="supplierReference" value={form.supplierReference} onChange={handleChange} /></label>
          <label>Tiempo de entrega<input type="number" name="deliveryTime" min="0" value={form.deliveryTime} onChange={handleChange} /></label>
        </div>
        <label>
          Categoría
          <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
            <option value="">Seleccionar categoría...</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Creando...' : 'Crear producto'}</button>
      </form>
    </div>
  )
}
