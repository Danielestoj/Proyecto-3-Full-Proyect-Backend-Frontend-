import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import productsRoutes from './routes/products.routes.js'
import categoriesRoutes from './routes/categories.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
import errorHandler from './middleware/errorHandler.js'
import suppliersRoutes from './routes/suppliers.routes.js'

const app = express()
console.log("🔥 APP.JS CARGADO")
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/categories', categoriesRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/suppliers', suppliersRoutes)

app.use(errorHandler)

export default app
