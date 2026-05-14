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

    // -----------------------------
    // TOTAL PRODUCTS
    // -----------------------------
    const totalProducts = products.length

    // -----------------------------
    // TOTAL STOCK (VARIANTS)
    // -----------------------------
    const totalStock = products.reduce((sum, product) => {
      const productStock = (product.variants || []).reduce((acc, v) => {
        return acc + (Number(v.stock) || 0)
      }, 0)

      return sum + productStock
    }, 0)

    // -----------------------------
    // TOTAL VALUE (VARIANTS)
    // -----------------------------
    const totalValue = products.reduce((sum, product) => {
      const productValue = (product.variants || []).reduce((acc, v) => {
        const stock = Number(v.stock) || 0
        const price = Number(v.sellingPrice) || 0
        return acc + stock * price
      }, 0)

      return sum + productValue
    }, 0)

    // -----------------------------
    // LOW STOCK (VARIANT LEVEL)
    // -----------------------------
    const lowStockProducts = products
      .map(product => {
        const lowVariants = (product.variants || []).filter(
          v => Number(v.stock) <= Number(v.minStock)
        )

        return {
          ...product,
          variants: lowVariants
        }
      })
      .filter(product => product.variants.length > 0)

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