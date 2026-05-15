import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import prisma from '../lib/prisma.js'
import app from '../app.js'

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key'

let viewerToken, managerToken, adminToken
let categoryId, supplierId, productId, variantId

beforeAll(async () => {
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()

  await prisma.stockMovement.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.productPriceHistory.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()

  await prisma.address.deleteMany()
  await prisma.user.deleteMany()

  await prisma.category.deleteMany()
  await prisma.supplier.deleteMany()


  const hashed = await bcrypt.hash('password123', 10)

  const viewer = await prisma.user.create({
    data: { email: 'viewer@test.com', password: hashed, name: 'Viewer', role: 'user' }
  })

  const manager = await prisma.user.create({
    data: { email: 'manager@test.com', password: hashed, name: 'Manager', role: 'manager' }
  })

  const admin = await prisma.user.create({
    data: { email: 'admin@test.com', password: hashed, name: 'Admin', role: 'admin' }
  })

  viewerToken = jwt.sign({ id: viewer.id, role: viewer.role }, process.env.JWT_SECRET)
  managerToken = jwt.sign({ id: manager.id, role: manager.role }, process.env.JWT_SECRET)
  adminToken = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET)

  const category = await prisma.category.create({
    data: { name: 'Test Category', slug: 'test-category' }
  })

  const supplier = await prisma.supplier.create({
    data: { name: 'Test Supplier' }
  })

  categoryId = category.id
  supplierId = supplier.id
})

afterAll(async () => {
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()

  await prisma.stockMovement.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.productPriceHistory.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()

  await prisma.address.deleteMany()
  await prisma.user.deleteMany()

  await prisma.category.deleteMany()
  await prisma.supplier.deleteMany()

})

describe('POST /api/products', () => {
  it('VIEWER no puede crear productos', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${viewerToken}`)
      .send({
        name: 'Test Product',
        description: 'desc',
        categoryId,
        supplierId,
        variants: [
          {
            name: 'Var1',
            sku: 'SKU-1',
            language: 'ENGLISH',
            condition: 'MINT',
            isFoil: false,
            isFirstEdition: false,
            availability: 'IN_STOCK',
            stock: 5,
            reservedStock: 0,
            minStock: 1,
            supplierReference: 'REF-123',
            supplierPrice: 10,
            retailPrice: 15,
            sellingPrice: 15,
            compareAtPrice: 15,
            salePrice: null,
            deliveryTime: 5
          }
        ]
      })

    expect(res.status).toBe(403)
  })

  it('MANAGER puede crear productos con variantes', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${managerToken}`)
      .send({
        name: 'Test Product',
        description: 'desc',
        categoryId,
        supplierId,
        variants: [
          {
            name: 'Var1',
            sku: 'SKU-1',
            language: 'ENGLISH',
            condition: 'MINT',
            isFoil: false,
            isFirstEdition: false,
            availability: 'IN_STOCK',
            stock: 5,
            reservedStock: 0,
            minStock: 1,
            supplierReference: 'REF-123',
            supplierPrice: 10,
            retailPrice: 15,
            sellingPrice: 15,
            compareAtPrice: 15,
            salePrice: null,
            deliveryTime: 5
          }
        ]
      })

    expect(res.status).toBe(201)

    productId = res.body.id

    const variant = await prisma.productVariant.findFirst({
      where: { productId }
    })

    variantId = variant.id
  })
})



describe('POST /api/products/:id/movements', () => {
  it('registra una entrada de stock', async () => {
    const res = await request(app)
      .post(`/api/products/${variantId}/movements`)
      .set('Authorization', `Bearer ${managerToken}`)
      .send({
        type: 'IN',
        quantity: 10,
        reason: 'Compra de stock'
      })

    expect(res.status).toBe(201)
  })
})



describe('DELETE /api/products/:id', () => {
  it('solo ADMIN puede borrar productos', async () => {
    const res = await request(app)
      .delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${managerToken}`)

    expect(res.status).toBe(403)
  })

  it('ADMIN borra producto y variantes', async () => {
    const res = await request(app)
      .delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)

    expect(res.status).toBe(204)
  })
})

