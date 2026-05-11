import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children, roles }) {
  const { usuario, cargando } = useAuth()
  if (cargando) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Cargando...</div>
  if (!usuario) return <Navigate to="/login" replace />
  if (roles && !roles.includes(usuario.role)) return <Navigate to="/" replace />
  return children
}
