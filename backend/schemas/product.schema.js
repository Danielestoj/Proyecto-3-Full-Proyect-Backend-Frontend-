import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().optional().nullable(),

  categoryId: z.number({
    required_error: 'La categoría es requerida'
  }),

  supplierId: z.number().optional().nullable(),

  variants: z.array(
    z.object({
      name: z.string().min(1, 'El nombre de la variante es requerido'),
      sku: z.string().min(3, 'El SKU debe tener al menos 3 caracteres'),

      imageUrl: z.string().url().optional().nullable(),

      language: z.string().optional().nullable(),
      condition: z.string().optional().nullable(),

      isFoil: z.boolean(),
      isFirstEdition: z.boolean(),

      availability: z.enum([
        'IN_STOCK',
        'OUT_OF_STOCK',
        'PREORDER',
        'DISCONTINUED'
      ]),

      supplierPrice: z.number(),
      retailPrice: z.number(),
      sellingPrice: z.number(),

      compareAtPrice: z.number().nullable().optional(),
      salePrice: z.number().nullable().optional(),

      stock: z.number(),
      reservedStock: z.number(),
      minStock: z.number(),

      supplierReference: z.string().optional().nullable(),
      deliveryTime: z.number()
    })
  )
})

export const updateProductSchema = createProductSchema.partial()

export const movementSchema = z.object({
  type: z.enum(['IN', 'OUT']),
  quantity: z.number().int().positive(),
  reason: z.string().min(3)
})


