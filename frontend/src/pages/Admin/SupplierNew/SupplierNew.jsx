import { useEffect, useState } from 'react'
import API_URL from '../../../config/api'
import styles from './SupplierNew.module.css'

export default function SupplierNew() {
  const [suppliers, setSuppliers] = useState([])
  const [newSupplier, setNewSupplier] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')


  useEffect(() => {
    const token = localStorage.getItem('token')

    fetch(`${API_URL}/api/suppliers`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setSuppliers(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const exists = suppliers.some(
      s => s.name.toLowerCase() === newSupplier.toLowerCase()
    )

    if (exists) {
      setError('Ese proveedor ya existe')
      return
    }

    setLoading(true)

    const token = localStorage.getItem('token')

    try {
      const res = await fetch(`${API_URL}/api/suppliers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newSupplier, email, phone})
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error creando proveedor')
      }

      setSuppliers(prev => [...prev, data])
      setNewSupplier('')
      setEmail('')
      setPhone('')


    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Seguro que quieres eliminar este proveedor?")

    if (!confirmDelete) return

    const token = localStorage.getItem('token')

    try {
      const res = await fetch(`${API_URL}/api/suppliers/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error eliminando proveedor')
      }

      setSuppliers(prev => prev.filter(s => s.id !== id))

    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className={styles.container}>
      <h1>Nuevo proveedor</h1>

      <h2>Proveedores existentes</h2>
      <ul className={styles.list}>
        {suppliers.map(s => (
          <li key={s.id} className={styles.listItem}>
            <span>{s.name}</span>
            <button className={styles.deleteBtn} onClick={() => handleDelete(s.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>

        <form onSubmit={handleSubmit} className={styles.form}>
        <label>
            Nombre nuevo proveedor
            <input
            value={newSupplier}
            onChange={e => setNewSupplier(e.target.value)}
            required
            />
        </label>

        <label>
            Email (opcional)
            <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="proveedor@correo.com"
            />
        </label>

        <label>
            Teléfono (opcional)
            <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="Ej: 600123123"
            />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={loading}>
            {loading ? 'Creando...' : 'Crear proveedor'}
        </button>
        </form>

    </div>
  )
}
