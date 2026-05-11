const errorHandler = (err, req, res, next) => {
  console.error(err)

  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'El recurso ya existe (campo único duplicado)' })
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Recurso no encontrado' })
  }

  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' })
}

export default errorHandler
