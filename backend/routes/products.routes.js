import { Router } from 'express'
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addMovement,
  getMovements,
} from '../controllers/products.controller.js'

import { verifyToken, requireRole } from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import {
  createProductSchema,
  updateProductSchema,
  movementSchema
} from '../schemas/product.schema.js'

import prisma from '../lib/prisma.js'

const router = Router()

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES (CATALOG)
|--------------------------------------------------------------------------
*/

// 🔓 Público: listado de productos (CATÁLOGO)
router.get('/', getProducts)

// 🔓 Público: productos destacados
router.get('/featured', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      take: 4,
      include: {
        variants: {
          include: {
            images: true,
          },
          where: {
            active: true,
          },
        },
      },
    })

    res.json(products)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Error obteniendo productos destacados'
    })
  }
})

// 🔓 Público: detalle de producto
router.get('/:id', getProduct)

/*
|--------------------------------------------------------------------------
| PRIVATE ROUTES (ADMIN / MANAGEMENT)
|--------------------------------------------------------------------------
*/

// 🔒 Crear producto
router.post(
  '/',
  verifyToken,
  requireRole('MANAGER', 'ADMIN'),
  validate(createProductSchema),
  createProduct
)

// 🔒 Actualizar producto
router.put(
  '/:id',
  verifyToken,
  requireRole('MANAGER', 'ADMIN'),
  validate(updateProductSchema),
  updateProduct
)

// 🔒 Eliminar producto (solo admin)
router.delete(
  '/:id',
  verifyToken,
  requireRole('ADMIN'),
  deleteProduct
)

// 🔒 Movimientos de stock
router.post(
  '/:id/movements',
  verifyToken,
  requireRole('MANAGER', 'ADMIN'),
  validate(movementSchema),
  addMovement
)

router.get(
  '/:id/movements',
  verifyToken,
  getMovements
)

export default router