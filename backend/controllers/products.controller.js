import prisma from '../lib/prisma.js'

/* ============================================================
   GET ALL PRODUCTS
============================================================ */
export const getProducts = async (req, res, next) => {
  try {
    const { categoryId, lowStock } = req.query

    const products = await prisma.product.findMany({
      where: {
        ...(categoryId && { categoryId: Number(categoryId) })
      },
      include: {
        category: true,
        supplier: true,
        variants: {
          include: {
            images: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    const result =
      lowStock === 'true'
        ? products.filter(p =>
            p.variants.some(v => v.stock <= v.minStock)
          )
        : products

    res.json(result)
  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err)
    next(err)
  }
}

/* ============================================================
   GET PRODUCT WITH VARIANTS + MOVEMENTS
============================================================ */
export const getProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.findUniqueOrThrow({
      where: { id: Number(req.params.id) },

      include: {
        category: true,
        supplier: true,

        variants: {
          include: {
            images: true,

            movements: {
              orderBy: { createdAt: 'desc' },
              include: {
                user: { select: { name: true } }
              }
            }
          }
        }
      }
    })

    res.json(product)
  } catch (err) {
    console.error("GET PRODUCT ERROR:", err)
    next(err)
  }
}

/* ============================================================
   GET PRODUCT BASIC
============================================================ */
export const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: Number(req.params.id)
      },
      include: {
        category: true,
        variants: true
      }
    })

    res.json(product)

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error getting product" })
  }
}

/* ============================================================
   CREATE PRODUCT + VARIANTS
============================================================ */
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      categoryId,
      supplierId,
      variants
    } = req.body

    const product = await prisma.product.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        description,
        categoryId,
        supplierId: supplierId || null,

        variants: {
          create: variants.map(v => ({
            name: v.name,
            sku: v.sku,
            language: v.language,
            condition: v.condition,
            isFoil: v.isFoil,
            isFirstEdition: v.isFirstEdition,
            availability: v.availability,
            stock: v.stock,
            reservedStock: v.reservedStock,
            minStock: v.minStock,
            supplierReference: v.supplierReference,
            supplierPrice: v.supplierPrice,
            retailPrice: v.retailPrice,
            sellingPrice: v.sellingPrice,
            compareAtPrice: v.compareAtPrice,
            salePrice: v.salePrice,
            deliveryTime: v.deliveryTime,

            images: v.imageUrl
              ? {
                  create: [{ url: v.imageUrl }]
                }
              : undefined
          }))
        }
      },

      include: {
        supplier: true,
        category: true,
        variants: {
          include: { images: true }
        }
      }
    })

    res.status(201).json(product)

  } catch (err) {
    console.error(err)
    next(err)
  }
}

/* ============================================================
   UPDATE PRODUCT
============================================================ */
export const updateProduct = async (req, res, next) => {
  try {
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: req.body,
      include: {
        category: true,
        _count: { select: { movements: true } }
      }
    })
    res.json(product)
  } catch (err) {
    next(err)
  }
}

/* ============================================================
   DELETE PRODUCT + VARIANTS + RELATED TABLES
============================================================ */
export const deleteProduct = async (req, res, next) => {
  try {
    const productId = Number(req.params.id)

    const variants = await prisma.productVariant.findMany({
      where: { productId }
    })

    const variantIds = variants.map(v => v.id)

    await prisma.stockMovement.deleteMany({
      where: { productVariantId: { in: variantIds } }
    })

    await prisma.productImage.deleteMany({
      where: { productVariantId: { in: variantIds } }
    })

    await prisma.productPriceHistory.deleteMany({
      where: { productVariantId: { in: variantIds } }
    })

    await prisma.cartItem.deleteMany({
      where: { productVariantId: { in: variantIds } }
    })

    await prisma.orderItem.deleteMany({
      where: { productVariantId: { in: variantIds } }
    })

    await prisma.productVariant.deleteMany({
      where: { productId }
    })

    await prisma.product.delete({
      where: { id: productId }
    })

    res.status(204).send()

  } catch (err) {
    console.error(err)
    next(err)
  }
}

/* ============================================================
   ADD MOVEMENT (VARIANT-BASED)
============================================================ */
export const addMovement = async (req, res, next) => {
  try {
    const variantId = Number(req.params.id)
    const { type, quantity, reason } = req.body

    const variant = await prisma.productVariant.findUniqueOrThrow({
      where: { id: variantId }
    })

    if (type === 'OUT' && variant.stock < quantity) {
      return res.status(400).json({
        error: `Stock insuficiente. Disponible: ${variant.stock}`
      })
    }

    const newStock =
      type === 'IN'
        ? variant.stock + quantity
        : variant.stock - quantity

    const [movement] = await prisma.$transaction([
      prisma.stockMovement.create({
        data: {
          productVariantId: variantId,
          type,
          quantity,
          reason,
          userId: req.user.id
        }
      }),
      prisma.productVariant.update({
        where: { id: variantId },
        data: { stock: newStock }
      })
    ])

    const updatedVariant = await prisma.productVariant.findUnique({
      where: { id: variantId }
    })

    res.status(201).json({ movement, variant: updatedVariant })

  } catch (err) {
    console.error(err)
    next(err)
  }
}

/* ============================================================
   GET MOVEMENTS (VARIANT-BASED)
============================================================ */
export const getMovements = async (req, res, next) => {
  try {
    const variantId = Number(req.params.id)

    const movements = await prisma.stockMovement.findMany({
      where: { productVariantId: variantId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    })

    res.json(movements)

  } catch (err) {
    next(err)
  }
}
