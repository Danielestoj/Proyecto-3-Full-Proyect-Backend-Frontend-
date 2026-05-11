import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import API_URL from '../config/api.js'
import styles from './AuthForm.module.css'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
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
        <h1>Iniciar sesión</h1>
        {error && <p className={styles.error}>{error}</p>}
        <label>Email<input type="email" name="email" value={form.email} onChange={handleChange} required /></label>
        <label>Contraseña<input type="password" name="password" value={form.password} onChange={handleChange} required /></label>
        <button type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
        <p>¿No tienes cuenta? <Link to="/register">Regístrate</Link></p>
      </form>
    </div>
  )
}
