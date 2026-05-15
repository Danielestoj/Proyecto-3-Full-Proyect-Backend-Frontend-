import prisma from '../lib/prisma.js'

export const getDashboard = async (req, res, next) => {
  try {
    const [products, recentMovements] = await Promise.all([
      prisma.product.findMany({ include: { category: true } }),
      prisma.stockMovement.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          product: { select: { name: true, sku: true } },
          user: { select: { name: true } },
        },
      }),
    ])

    const totalValue = products.reduce((sum, p) => sum + parseFloat(p.price) * p.stock, 0)
    const lowStockProducts = products.filter(p => p.stock <= p.minStock)
    const totalProducts = products.length
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0)

    res.json({
      totalValue: parseFloat(totalValue.toFixed(2)),
      totalProducts,
      totalStock,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      recentMovements,
    })
  } catch (err) {
    next(err)
  }
}
