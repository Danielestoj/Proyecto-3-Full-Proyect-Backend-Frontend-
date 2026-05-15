import { Router } from 'express'
import { getSuppliers, createSupplier, deleteSupplier } from '../controllers/suppliers.controller.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()

router.get('/', verifyToken, getSuppliers)
router.post('/', verifyToken, createSupplier)
router.delete('/:id', verifyToken, deleteSupplier)

export default router
