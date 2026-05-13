import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext.jsx'
import API_URL from '../../../config/api.js'
import styles from './ProductDetail.module.css'

export default function ProductDetail() {
  const { id } = useParams()
  const { user: usuario } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  const [selectedVariant, setSelectedVariant] = useState(null)
  const [editing, setEditing] = useState(false)

  const [editForm, setEditForm] = useState({})

  const [form, setForm] = useState({
    type: 'IN',
    quantity: '',
    reason: '',
  })

  const [msg, setMsg] = useState(null)
  const [msgType, setMsgType] = useState('success')
  const [submitting, setSubmitting] = useState(false)

  const canManage = ['MANAGER', 'ADMIN'].includes(usuario?.role?.toUpperCase())

  const fetchProduct = () => {
    const token = localStorage.getItem('token')

    fetch(`${API_URL}/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        setProduct(data)
        setSelectedVariant(data.variants?.[0] || null)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchProduct()
  }, [id])

  useEffect(() => {
    if (!selectedVariant) return

    setEditForm({
      name: selectedVariant.name || '',
      sku: selectedVariant.sku || '',

      supplierReference: selectedVariant.supplierReference || '',
      availability: selectedVariant.availability || '',

      supplierPrice: selectedVariant.supplierPrice || '',
      retailPrice: selectedVariant.retailPrice || '',
      sellingPrice: selectedVariant.sellingPrice || '',
      compareAtPrice: selectedVariant.compareAtPrice || '',
      salePrice: selectedVariant.salePrice || '',

      stock: selectedVariant.stock || 0,
      reservedStock: selectedVariant.reservedStock || 0,
      minStock: selectedVariant.minStock || 0,
      deliveryTime: selectedVariant.deliveryTime || 0,

      imageUrl: selectedVariant.imageUrl || '',
    })
  }, [selectedVariant])

  const handleSave = async () => {
    const token = localStorage.getItem('token')

    const res = await fetch(`${API_URL}/api/variants/${selectedVariant.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...editForm,
        supplierPrice: Number(editForm.supplierPrice),
        retailPrice: Number(editForm.retailPrice),
        sellingPrice: Number(editForm.sellingPrice),
        compareAtPrice: Number(editForm.compareAtPrice),
        salePrice: editForm.salePrice ? Number(editForm.salePrice) : null,
        stock: Number(editForm.stock),
        reservedStock: Number(editForm.reservedStock),
        minStock: Number(editForm.minStock),
        deliveryTime: Number(editForm.deliveryTime),
      }),
    })

    if (!res.ok) {
      setMsgType('error')
      setMsg('Error al guardar variante')
      return
    }

    setEditing(false)
    fetchProduct()
  }

  if (loading) return <div className={styles.center}>Cargando...</div>
  if (!product) return <div className={styles.center}>No encontrado</div>

  const v = selectedVariant

  return (
    <main className={styles.main}>

      {/* TOP BAR */}
      <div className={styles.topBar}>
        <Link to="/admin/products" className={styles.back}>← Volver</Link>

        {canManage && (
          <button className={styles.editBtn} onClick={() => setEditing(!editing)}>
            {editing ? '✖' : '✏️'}
          </button>
        )}
      </div>

      {/* HEADER */}
      <div className={styles.header}>
        <h1>{product.name}</h1>
        <span className={styles.sku}>{v?.sku}</span>
      </div>

      {/* VARIANTES */}
      <div className={styles.variants}>
        {product.variants?.map(x => (
          <button
            key={x.id}
            onClick={() => setSelectedVariant(x)}
            className={v?.id === x.id ? styles.activeVariant : ''}
          >
            {x.name}
          </button>
        ))}
      </div>

      {/* INFO GRID */}
      <div className={styles.grid}>

        {/* PRODUCTO */}
        <section className={styles.card}>
          <h3>Producto</h3>

          <label>Nombre</label>
          <input disabled={!editing} value={editForm.name}
            onChange={e => setEditForm({ ...editForm, name: e.target.value })} />

          <label>SKU</label>
          <input disabled={!editing} value={editForm.sku}
            onChange={e => setEditForm({ ...editForm, sku: e.target.value })} />

          <label>Imagen URL</label>
          <img src={selectedVariant?.images?.[0]?.url} alt="Imagen del producto" className={styles.productImage} />
          <input disabled={!editing} value={editForm.imageUrl}
            onChange={e => setEditForm({ ...editForm, imageUrl: e.target.value })} />
        </section>

        {/* PROVEEDOR */}
        <section className={styles.card}>
          <h3>Proveedor</h3>

          <label>Referencia proveedor</label>
          <input disabled={!editing} value={editForm.supplierReference}
            onChange={e => setEditForm({ ...editForm, supplierReference: e.target.value })} />

          <label>Disponibilidad</label>
          <input disabled={!editing} value={editForm.availability}
            onChange={e => setEditForm({ ...editForm, availability: e.target.value })} />
        </section>

        {/* PRECIOS */}
        <section className={styles.card}>
          <h3>Precios</h3>

          <label>Precio compra</label>
          <input type="number" disabled={!editing} value={editForm.supplierPrice}
            onChange={e => setEditForm({ ...editForm, supplierPrice: e.target.value })} />

          <label>Precio PVP</label>
          <input type="number" disabled={!editing} value={editForm.retailPrice}
            onChange={e => setEditForm({ ...editForm, retailPrice: e.target.value })} />

          <label>Precio venta</label>
          <input type="number" disabled={!editing} value={editForm.sellingPrice}
            onChange={e => setEditForm({ ...editForm, sellingPrice: e.target.value })} />

          <label>Precio comparativo</label>
          <input type="number" disabled={!editing} value={editForm.compareAtPrice}
            onChange={e => setEditForm({ ...editForm, compareAtPrice: e.target.value })} />

          <label>Precio oferta</label>
          <input type="number" disabled={!editing} value={editForm.salePrice}
            onChange={e => setEditForm({ ...editForm, salePrice: e.target.value })} />
        </section>

        {/* STOCK */}
        <section className={styles.card}>
          <h3>Stock</h3>

          <label>Stock actual</label>
          <input type="number" disabled={!editing} value={editForm.stock}
            onChange={e => setEditForm({ ...editForm, stock: e.target.value })} />

          <label>Reservado</label>
          <input type="number" disabled={!editing} value={editForm.reservedStock}
            onChange={e => setEditForm({ ...editForm, reservedStock: e.target.value })} />

          <label>Stock mínimo</label>
          <input type="number" disabled={!editing} value={editForm.minStock}
            onChange={e => setEditForm({ ...editForm, minStock: e.target.value })} />
        </section>

        {/* LOGÍSTICA */}
        <section className={styles.card}>
          <h3>Logística</h3>

          <label>Días de entrega</label>
          <input type="number" disabled={!editing} value={editForm.deliveryTime}
            onChange={e => setEditForm({ ...editForm, deliveryTime: e.target.value })} />
        </section>
      </div>

      {/* SAVE */}
      {editing && (
        <button className={styles.saveBtn} onClick={handleSave}>
          Guardar cambios
        </button>
      )}
    </main>
  )
}