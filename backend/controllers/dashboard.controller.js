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
            select: { name: true }
          }
        }
      })
    ])

    // -----------------------------
    // TOTAL PRODUCTS
    // -----------------------------
    const totalProducts = products.length

    // -----------------------------
    // TOTAL STOCK (VARIANTS)
    // -----------------------------
    const totalStock = products.reduce((sum, product) => {
      return sum + product.variants.reduce((acc, v) => acc + v.stock, 0)
    }, 0)

    // -----------------------------
    // TOTAL VALUE (VARIANTS)
    // -----------------------------
    const totalValue = products.reduce((sum, product) => {
      return sum + product.variants.reduce((acc, v) => {
        return acc + v.stock * Number(v.sellingPrice || 0)
      }, 0)
    }, 0)

    // -----------------------------
    // LOW STOCK (VARIANT LEVEL)
    // -----------------------------
    const lowStockProducts = products
      .map(product => {
        const lowVariants = product.variants.filter(
          v => v.stock <= v.minStock
        )

        return lowVariants.length > 0
          ? {
              id: product.id,
              name: product.name,
              variants: lowVariants
            }
          : null
      })
      .filter(Boolean)

    const lowStockCount = lowStockProducts.length

    res.json({
      totalProducts,
      totalStock,
      totalValue,
      lowStockCount,
      lowStockProducts,
      recentMovements
    })

  } catch (err) {
    console.error('DASHBOARD ERROR:', err)
    next(err)
  }
}
