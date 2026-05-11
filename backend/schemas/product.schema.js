import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  sku: z.string().min(3, 'El SKU debe tener al menos 3 caracteres'),
  price: z.number().positive('El precio debe ser positivo'),
  stock: z.number().int().min(0, 'El stock no puede ser negativo').optional().default(0),
  minStock: z.number().int().min(0).optional().default(5),
  categoryId: z.number().int().positive('La categoría es requerida'),
})

export const updateProductSchema = createProductSchema.omit({ sku: true }).partial()

export const movementSchema = z.object({
  type: z.enum(['IN', 'OUT'], { errorMap: () => ({ message: 'Tipo debe ser IN o OUT' }) }),
  quantity: z.number().int().positive('La cantidad debe ser positiva'),
  reason: z.string().min(3, 'El motivo es requerido'),
})
