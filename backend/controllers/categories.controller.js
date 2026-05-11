import prisma from '../lib/prisma.js'

export const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } },
    })
    res.json(categories)
  } catch (err) {
    next(err)
  }
}
