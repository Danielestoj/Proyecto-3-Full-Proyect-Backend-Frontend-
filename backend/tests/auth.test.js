import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import prisma from '../lib/prisma.js'
import app from '../app.js'

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key'

beforeAll(async () => {
  await prisma.stockMovement.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await prisma.stockMovement.deleteMany()
  await prisma.productVariant.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()
  await prisma.$disconnect()
})

describe('POST /api/auth/register', () => {
  it('registra un nuevo usuario', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'viewer@test.com',
      password: 'password123',
      name: 'Viewer User',
    })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('token')
    expect(res.body.user.role).toBe('user')
  })

  it('devuelve 400 si faltan campos', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'otro@test.com',
    })
    expect(res.status).toBe(400)
  })

  it('devuelve 409 para email duplicado', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'viewer@test.com',
      password: 'password123',
      name: 'Duplicado',
    })
    expect(res.status).toBe(409)
  })
})

describe('POST /api/auth/login', () => {
  it('login correcto devuelve token', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'viewer@test.com',
      password: 'password123',
    })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
  })

  it('devuelve 401 con contraseña incorrecta', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'viewer@test.com',
      password: 'wrongpassword',
    })
    expect(res.status).toBe(401)
  })
})
