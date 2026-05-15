import { Router } from 'express'
import { getCategories, createCategory, deleteCategory } from '../controllers/categories.controller.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()

router.get('/', verifyToken, getCategories)
router.post('/', verifyToken, createCategory)
router.delete('/:id', verifyToken, deleteCategory)


export default router
