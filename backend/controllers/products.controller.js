import prisma from '../lib/prisma.js'

const include = { category: true, _count: { select: { movements: true } } }

export const getProducts = async (req, res, next) => {
  try {
    const { categoryId, lowStock } = req.query
    const products = await prisma.product.findMany({
      where: { ...(categoryId && { categoryId: Number(categoryId) }) },
      include,
      orderBy: { name: 'asc' },
    })
    const result = lowStock === 'true'
      ? products.filter(p => p.stock <= p.minStock)
      : products
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const getProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.findUniqueOrThrow({
      where: { id: Number(req.params.id) },
      include: {
        category: true,
        movements: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { user: { select: { name: true } } },
        },
      },
    })
    res.json(product)
  } catch (err) {
    next(err)
  }
}

export const createProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.create({ data: req.body, include })
    res.status(201).json(product)
  } catch (err) {
    next(err)
  }
}

export const updateProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: req.body,
      include,
    })
    res.json(product)
  } catch (err) {
    next(err)
  }
}

export const deleteProduct = async (req, res, next) => {
  try {
    await prisma.stockMovement.deleteMany({ where: { productId: Number(req.params.id) } })
    await prisma.product.delete({ where: { id: Number(req.params.id) } })
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export const addMovement = async (req, res, next) => {
  try {
    const productId = Number(req.params.id)
    const { type, quantity, reason } = req.body

    const product = await prisma.product.findUniqueOrThrow({ where: { id: productId } })

    if (type === 'OUT' && product.stock < quantity) {
      return res.status(400).json({ error: `Stock insuficiente. Disponible: ${product.stock}` })
    }

    const newStock = type === 'IN' ? product.stock + quantity : product.stock - quantity

    const [movement] = await prisma.$transaction([
      prisma.stockMovement.create({
        data: { productId, type, quantity, reason, userId: req.user.id },
        include: { user: { select: { name: true } } },
      }),
      prisma.product.update({ where: { id: productId }, data: { stock: newStock } }),
    ])

    if (newStock <= product.minStock && process.env.WEBHOOK_URL) {
      fetch(process.env.WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alert: 'low_stock',
          product: product.name,
          sku: product.sku,
          currentStock: newStock,
          minStock: product.minStock,
        }),
      }).catch(() => {})
    }

    const updatedProduct = await prisma.product.findUnique({ where: { id: productId }, include })
    res.status(201).json({ movement, product: updatedProduct })
  } catch (err) {
    next(err)
  }
}

export const getMovements = async (req, res, next) => {
  try {
    const movements = await prisma.stockMovement.findMany({
      where: { productId: Number(req.params.id) },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    })
    res.json(movements)
  } catch (err) {
    next(err)
  }
}
