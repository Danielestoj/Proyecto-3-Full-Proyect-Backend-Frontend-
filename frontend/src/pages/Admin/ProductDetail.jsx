import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import API_URL from '../../config/api.js'
import styles from './ProductDetail.module.css'

export default function ProductDetail() {
  const { id } = useParams()
  const { usuario } = useAuth()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    type: 'IN',
    quantity: '',
    reason: '',
  })

  const [msg, setMsg] = useState(null)
  const [msgType, setMsgType] = useState('success')
  const [submitting, setSubmitting] = useState(false)

  // NUEVO
  const [editing, setEditing] = useState(false)

  // NUEVO
  const [editForm, setEditForm] = useState({
    name: '',
    sku: '',
    supplier: '',
    supplierReference: '',
    imageUrl: '',
    price: '',
    retailPrice: '',
    sellingPrice: '',
    stock: '',
    minStock: '',
    deliveryTime: '',
  })

  const canManage = ['MANAGER', 'ADMIN'].includes(usuario?.role)

  const fetchProduct = () => {
    const token = localStorage.getItem('token')

    fetch(`${API_URL}/api/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(r => r.json())
      .then(data => {
        setProduct(data)

        // NUEVO
        setEditForm({
          name: data.name || '',
          sku: data.sku || '',
          supplier: data.supplier || '',
          supplierReference: data.supplierReference || '',
          imageUrl: data.imageUrl || '',
          price: data.price || '',
          retailPrice: data.retailPrice || '',
          sellingPrice: data.sellingPrice || '',
          stock: data.stock || '',
          minStock: data.minStock || '',
          deliveryTime: data.deliveryTime || '',
        })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchProduct()
  }, [id])

  const handleMovement = async e => {
    e.preventDefault()

    setSubmitting(true)
    setMsg(null)

    const token = localStorage.getItem('token')

    try {
      const res = await fetch(
        `${API_URL}/api/products/${id}/movements`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            quantity: Number(form.quantity),
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      setMsgType('success')
      setMsg(`Movimiento registrado. Nuevo stock: ${data.product.stock}`)

      setForm({
        type: 'IN',
        quantity: '',
        reason: '',
      })

      fetchProduct()
    } catch (err) {
      setMsgType('error')
      setMsg(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // NUEVO
  const handleSaveChanges = async () => {
    const token = localStorage.getItem('token')

    try {
      setSubmitting(true)
      setMsg(null)

      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...editForm,
          price: Number(editForm.price),
          retailPrice: Number(editForm.retailPrice),
          sellingPrice: Number(editForm.sellingPrice),
          stock: Number(editForm.stock),
          minStock: Number(editForm.minStock),
          deliveryTime: Number(editForm.deliveryTime),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar')
      }

      setMsgType('success')
      setMsg('Producto actualizado correctamente')

      setEditing(false)

      fetchProduct()
    } catch (err) {
      setMsgType('error')
      setMsg(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.center}>
        Cargando producto...
      </div>
    )
  }

  if (!product || product.error) {
    return (
      <div className={styles.center}>
        Producto no encontrado.
        <Link to="/products">Volver</Link>
      </div>
    )
  }

  return (
    <main className={styles.main}>

      {/* TOP BAR */}
      <div className={styles.topBar}>
        <Link to="/products" className={styles.back}>
          ← Volver a productos
        </Link>

        {canManage && (
          <button className={styles.editBtn} onClick={() => setEditing(!editing)} > {editing ? '✖' : '✏️'} </button>)}
      </div>


    {/* HEADER */}
    <div className={styles.header}>
      <div>
        <h1>{editing ? <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} /> : product.name}</h1>
        {editing ? <input value={editForm.sku} onChange={e => setEditForm({ ...editForm, sku: e.target.value })} /> : <span className={styles.sku}>{product.sku}</span>}
      </div>

      <span className={`${styles.badge} ${product.stock <= product.minStock ? styles.badgeAlert : styles.badgeOk}`}>
        {product.stock <= product.minStock ? '⚠ Stock bajo' : 'Stock OK'}
      </span>
    </div>

    {/* INFO */}
    <div className={styles.info}>
      <div className={styles.productInfo}>
        <div className={styles.infoItem}>
          <span>Proveedor</span>
          {editing ? <input value={editForm.supplier} onChange={e => setEditForm({ ...editForm, supplier: e.target.value })} /> : <strong>{product.supplier}</strong>}
        </div>

        <div className={styles.infoItem}>
          <span>Referencia del proveedor</span>
          {editing ? <input value={editForm.supplierReference} onChange={e => setEditForm({ ...editForm, supplierReference: e.target.value })} /> : <strong>{product.supplierReference}</strong>}
        </div>

        <div className={styles.infoItem}>
          <span>Imagen</span>
          {editing ? <input type="url" value={editForm.imageUrl} onChange={e => setEditForm({ ...editForm, imageUrl: e.target.value })} /> : <strong>{product.imageUrl && <img src={product.imageUrl} alt={product.name} />}</strong>}
        </div>
      </div>

      <div className={styles.productInfo}>
        <div className={styles.infoItem}>
          <span>Categoría</span>
          <strong>{product.category?.name}</strong>
        </div>

        <div className={styles.infoItem}>
          <span>Precio</span>
          {editing ? <input type="number" step="0.01" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} /> : <strong>€{parseFloat(product.price).toFixed(2)}</strong>}
        </div>

        <div className={styles.infoItem}>
          <span>Precio PVP</span>
          {editing ? <input type="number" step="0.01" value={editForm.retailPrice} onChange={e => setEditForm({ ...editForm, retailPrice: e.target.value })} /> : <strong>€{parseFloat(product.retailPrice).toFixed(2)}</strong>}
        </div>

        <div className={styles.infoItem}>
          <span>Precio Venta</span>
          {editing ? <input type="number" step="0.01" value={editForm.sellingPrice} onChange={e => setEditForm({ ...editForm, sellingPrice: e.target.value })} /> : <strong>€{parseFloat(product.sellingPrice).toFixed(2)}</strong>}
        </div>
      </div>

      <div className={styles.productInfo}>
        <div className={styles.infoItem}>
          <span>Stock actual</span>
          {editing ? <input type="number" value={editForm.stock} onChange={e => setEditForm({ ...editForm, stock: e.target.value })} /> : <strong className={product.stock <= product.minStock ? styles.alertText : ''}>{product.stock} uds</strong>}
        </div>

        <div className={styles.infoItem}>
          <span>Stock mínimo</span>
          {editing ? <input type="number" value={editForm.minStock} onChange={e => setEditForm({ ...editForm, minStock: e.target.value })} /> : <strong>{product.minStock} uds</strong>}
        </div>

        <div className={styles.infoItem}>
          <span>Tiempo de entrega</span>
          {editing ? <input type="number" value={editForm.deliveryTime} onChange={e => setEditForm({ ...editForm, deliveryTime: e.target.value })} /> : <strong>{product.deliveryTime} días</strong>}
        </div>
      </div>
    </div>

    {/* DESCRIPCIÓN */}
    <div className={styles.descriptionSection}>
      <h2>Información del producto</h2>
      {editing ? <textarea className={styles.descriptionTextarea} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} rows="10" /> : <p className={styles.descriptionText}>{product.description || 'Sin información'}</p>}
    </div>

    {/* GUARDAR */}
    {editing && (
      <div className={styles.saveContainer}>
        <button className={styles.saveBtn} onClick={handleSaveChanges} disabled={submitting}>
          {submitting ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    )}

    {/* MENSAJES */}
    {msg && <p className={`${styles.msg} ${styles[msgType]}`}>{msg}</p>}

    {/* MOVIMIENTOS */}
    {canManage && (
      <section className={styles.movSection}>
        <h2>Registrar movimiento</h2>

        <form className={styles.movForm} onSubmit={handleMovement}>
          <label>
            Tipo
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="IN">↑ Entrada</option>
              <option value="OUT">↓ Salida</option>
            </select>
          </label>

          <label>
            Cantidad
            <input type="number" min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} required />
          </label>

          <label>
            Motivo
            <input type="text" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="Ej: Compra proveedor..." required />
          </label>

          <button type="submit" disabled={submitting}>
            {submitting ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
      </section>
    )}

    {/* HISTORIAL */}
    <section className={styles.histSection}>
      <h2>Historial de movimientos</h2>

      {product.movements?.length === 0 ? (
        <p className={styles.empty}>Sin movimientos registrados.</p>
      ) : (
        <ul className={styles.movList}>
          {product.movements?.map(m => (
            <li key={m.id} className={styles.movItem}>
              <span className={`${styles.movType} ${m.type === 'IN' ? styles.in : styles.out}`}>
                {m.type === 'IN' ? '↑' : '↓'} {m.quantity} uds
              </span>

              <span>{m.reason}</span>

              <span className={styles.movMeta}>
                {m.user?.name} · {new Date(m.createdAt).toLocaleDateString('es-ES')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>


    </main>
  )
}