import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API_URL from '../../../config/api'
import styles from './CategoryNew.module.css'

export default function CategoryNew() {
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')

    fetch(`${API_URL}/api/categories`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {})
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const exists = categories.some(
      c => c.name.toLowerCase() === newCategory.toLowerCase()
    )

    if (exists) {
      setError('Esa categoría ya existe')
      return
    }

    setLoading(true)

    const token = localStorage.getItem('token')

    try {
      const res = await fetch(`${API_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCategory })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error creando categoría')
      }
      setCategories(prev => [...prev, data])
      setNewCategory('')


    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("¿Seguro que quieres eliminar esta categoría?")

  if (!confirmDelete) return

  const token = localStorage.getItem('token')

    try {
    const res = await fetch(`${API_URL}/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
        Authorization: `Bearer ${token}`
        }
    })

    const data = await res.json()

    if (!res.ok) {
        throw new Error(data.error || 'Error eliminando categoría')
    }

    // Si se elimina correctamente
    setCategories(prev => prev.filter(c => c.id !== id))

    } catch (err) {
    setError(err.message)   // mostrará "No puedes eliminar una categoría que tiene productos asociados"
    }

}


  return (
    <div className={styles.container}>
      <h1>Nueva categoría</h1>

      <h2>Categorías existentes</h2>
      <ul className={styles.list}>
        {categories.map(c => (
        <li key={c.id} className={styles.listItem}>
        <span>{c.name}</span>

        <button
            className={styles.deleteBtn}
            onClick={() => handleDelete(c.id)}
        >
            Eliminar
        </button>
        </li>

        ))}
        </ul>


      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          Nombre nueva categoría
          <input
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            required
          />
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear categoría'}
        </button>
      </form>
    </div>
  )
}
