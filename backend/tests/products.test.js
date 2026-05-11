import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import prisma from '../lib/prisma.js'
import app from '../app.js'

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key'

let viewerToken, managerToken, adminToken, categoryId, productId

beforeAll(async () => {
  await prisma.stockMovement.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()
  await prisma.category.deleteMany()

  const hashed = await bcrypt.hash('password123', 10)
  const viewer = await prisma.user.create({ data: { email: 'viewer@test.com', password: hashed, name: 'Viewer', role: 'VIEWER' } })
  const manager = await prisma.user.create({ data: { email: 'manager@test.com', password: hashed, name: 'Manager', role: 'MANAGER' } })
  const admin = await prisma.user.create({ data: { email: 'admin@test.com', password: hashed, name: 'Admin', role: 'ADMIN' } })

  viewerToken = jwt.sign({ id: viewer.id, email: viewer.email, role: viewer.role }, process.env.JWT_SECRET)
  managerToken = jwt.sign({ id: manager.id, email: manager.email, role: manager.role }, process.env.JWT_SECRET)
  adminToken = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, process.env.JWT_SECRET)

  const category = await prisma.category.create({ data: { name: 'Test Category' } })
  categoryId = category.id
})

afterAll(async () => {
  await prisma.stockMovement.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()
  await prisma.category.deleteMany()
  await prisma.$disconnect()
})

describe('GET /api/products', () => {
  it('devuelve 401 sin token', async () => {
    const res = await request(app).get('/api/products')
    expect(res.status).toBe(401)
  })

  it('devuelve lista de productos con token', async () => {
    const res = await request(app).get('/api/products').set('Authorization', `Bearer ${viewerToken}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})

describe('POST /api/products', () => {
  it('devuelve 403 si el usuario es VIEWER', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${viewerToken}`)
      .send({ name: 'Test Product', sku: 'TST-001', price: 9.99, categoryId })
    expect(res.status).toBe(403)
  })

  it('MANAGER puede crear productos', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ name: 'Test Product', sku: 'TST-001', price: 9.99, categoryId })
    expect(res.status).toBe(201)
    expect(res.body.sku).toBe('TST-001')
    productId = res.body.id
  })

  it('devuelve 409 para SKU duplicado', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ name: 'Test Product 2', sku: 'TST-001', price: 19.99, categoryId })
    expect(res.status).toBe(409)
  })
})

describe('POST /api/products/:id/movements', () => {
  it('registra una entrada de stock', async () => {
    const res = await request(app)
      .post(`/api/products/${productId}/movements`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ type: 'IN', quantity: 10, reason: 'Compra de stock' })
    expect(res.status).toBe(201)
    expect(res.body.product.stock).toBe(10)
  })

  it('devuelve 400 si stock insuficiente para salida', async () => {
    const res = await request(app)
      .post(`/api/products/${productId}/movements`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({ type: 'OUT', quantity: 999, reason: 'Venta masiva' })
    expect(res.status).toBe(400)
  })
})

describe('DELETE /api/products/:id', () => {
  it('devuelve 403 si no es ADMIN', async () => {
    const res = await request(app)
      .delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${managerToken}`)
    expect(res.status).toBe(403)
  })

  it('ADMIN puede borrar productos', async () => {
    const res = await request(app)
      .delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(204)
  })
})
