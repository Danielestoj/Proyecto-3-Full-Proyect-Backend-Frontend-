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
import { createProductSchema, updateProductSchema, movementSchema } from '../schemas/product.schema.js'

const router = Router()

router.get('/', verifyToken, getProducts)
router.get('/:id', verifyToken, getProduct)
router.post('/', verifyToken, requireRole('MANAGER', 'ADMIN'), validate(createProductSchema), createProduct)
router.put('/:id', verifyToken, requireRole('MANAGER', 'ADMIN'), validate(updateProductSchema), updateProduct)
router.delete('/:id', verifyToken, requireRole('ADMIN'), deleteProduct)
router.post('/:id/movements', verifyToken, requireRole('MANAGER', 'ADMIN'), validate(movementSchema), addMovement)
router.get('/:id/movements', verifyToken, getMovements)

export default router
