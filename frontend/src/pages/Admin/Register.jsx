import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import API_URL from '../../config/api.js'
import styles from './AuthForm.module.css'

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      login(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Crear cuenta</h1>
        {error && <p className={styles.error}>{error}</p>}
        <label>Nombre<input type="text" name="name" value={form.name} onChange={handleChange} required /></label>
        <label>Email<input type="email" name="email" value={form.email} onChange={handleChange} required /></label>
        <label>Contraseña<input type="password" name="password" value={form.password} onChange={handleChange} required /></label>
        <button type="submit" disabled={loading}>{loading ? 'Registrando...' : 'Crear cuenta'}</button>
        <p>¿Ya tienes cuenta? <Link to="/login">Entra aquí</Link></p>
      </form>
    </div>
  )
}
