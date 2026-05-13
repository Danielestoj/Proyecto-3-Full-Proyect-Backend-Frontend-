import prisma from '../lib/prisma.js'

export const getDashboard = async (req, res, next) => {
  try {
    const [products, recentMovements] = await Promise.all([
      prisma.product.findMany({
        include: {
          category: true,
          variants: true
        }
      }),

      prisma.stockMovement.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          variant: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          },
          user: {
            select: {
              name: true
            }
          }
        }
      })
    ])

    const totalValue = products.reduce((sum, p) => {
      const stock = p.variants?.reduce((s, v) => s + v.stock, 0) || 0
      return sum + stock
    }, 0)

    const lowStockProducts = products.filter(p =>
      p.variants?.some(v => v.stock <= v.minStock)
    )

    const totalProducts = products.length

    const totalStock = products.reduce((sum, p) => {
      return (
        sum +
        (p.variants?.reduce((s, v) => s + v.stock, 0) || 0)
      )
    }, 0)

    res.json({
      totalValue,
      totalProducts,
      totalStock,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      recentMovements
    })
  } catch (err) {
    console.error('DASHBOARD ERROR:', err)
    next(err)
  }
}