import prisma from '../lib/prisma.js'

function createSlug(text) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

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

export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Name is required' })
    }

    const slug = createSlug(name)

    const category = await prisma.category.create({
      data: { name, slug }
    })

    return res.json(category)

  } catch (err) {
    // Detectar duplicado de Prisma
    if (err.code === 'P2002') {
      return res.status(400).json({
        error: 'Ya existe una categoría con ese nombre'
      })
    }

    console.error("ERROR CREANDO CATEGORÍA:", err)
    next(err)
  }
}


export const deleteCategory = async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    // Comprobar si tiene productos asociados
    const count = await prisma.product.count({
      where: { categoryId: id }
    })

    if (count > 0) {
      return res.status(400).json({
        error: "No puedes eliminar una categoría que tiene productos asociados"
      })
    }

    //Si no tiene productos, eliminarla
    await prisma.category.delete({
      where: { id }
    })

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}



