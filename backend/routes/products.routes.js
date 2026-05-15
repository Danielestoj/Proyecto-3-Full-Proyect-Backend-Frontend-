import { Router } from 'express'
import prisma from '../lib/prisma.js'

import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addMovement,
  getMovements
} from '../controllers/products.controller.js'

import { verifyToken, requireRole } from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import {
  createProductSchema,
  updateProductSchema,
  movementSchema
} from '../schemas/product.schema.js'

const router = Router()
console.log("📦 PRODUCTS ROUTES CARGADO")
/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

// 🔓 Listado de productos
router.get('/', getProducts)

// 🔓 Productos destacados
router.get('/featured', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      take: 4,
      include: {
        variants: {
          include: { images: true },
          where: { active: true }
        }
      }
    })

    res.json(products)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Error obteniendo productos destacados'
    })
  }
})

// 🔓 Detalle de producto
router.get('/:id', getProduct)

/*
|--------------------------------------------------------------------------
| VARIANTS (EDITAR VARIANTE)
|--------------------------------------------------------------------------
*/

// 🔥 ACTUALIZAR VARIANTE
router.put('/variants/:id', async (req, res, next) => {
  try {
    const {
      imageUrl, // ❌ ignorado (no existe en Prisma)
      stock,
      reservedStock,
      minStock,
      supplierPrice,
      retailPrice,
      sellingPrice,
      compareAtPrice,
      salePrice,
      deliveryTime,
      ...rest
    } = req.body

    const variant = await prisma.productVariant.update({
      where: { id: Number(req.params.id) },
      data: {
        ...rest,

        // números seguros (evita undefined)
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(reservedStock !== undefined && { reservedStock: Number(reservedStock) }),
        ...(minStock !== undefined && { minStock: Number(minStock) }),
        ...(deliveryTime !== undefined && { deliveryTime: Number(deliveryTime) }),

        ...(supplierPrice !== undefined && { supplierPrice: Number(supplierPrice) }),
        ...(retailPrice !== undefined && { retailPrice: Number(retailPrice) }),
        ...(sellingPrice !== undefined && { sellingPrice: Number(sellingPrice) }),
        ...(compareAtPrice !== undefined && { compareAtPrice: Number(compareAtPrice) }),

        ...(salePrice !== undefined
          ? { salePrice: salePrice === null ? null : Number(salePrice) }
          : {}),
      },
    })

    res.json(variant)
  } catch (err) {
    next(err)
  }
})

/*
|--------------------------------------------------------------------------
| admin ROUTES
|--------------------------------------------------------------------------
*/

// 🔒 Crear producto
router.post(
  '/',
  verifyToken,
  requireRole('manager', 'admin'),
  validate(createProductSchema),
  createProduct
)

// 🔒 Actualizar producto
router.put(
  '/:id',
  verifyToken,
  requireRole('manager', 'admin'),
  validate(updateProductSchema),
  updateProduct
)

// 🔒 Eliminar producto
router.delete(
  '/:id',
  verifyToken,
  requireRole('admin'),
  deleteProduct
)

/*
|--------------------------------------------------------------------------
| STOCK MOVEMENTS
|--------------------------------------------------------------------------
*/

router.post(
  '/:id/movements',
  verifyToken,
  requireRole('manager', 'admin'),
  validate(movementSchema),
  addMovement
)

router.get(
  '/:id/movements',
  verifyToken,
  getMovements
)

export default router