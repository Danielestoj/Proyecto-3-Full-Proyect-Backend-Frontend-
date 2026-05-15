import { Router } from 'express'
import { getCategories } from '../controllers/categories.controller.js'
import { verifyToken } from '../middleware/auth.js'

const router = Router()

router.get('/', verifyToken, getCategories)

export default router
