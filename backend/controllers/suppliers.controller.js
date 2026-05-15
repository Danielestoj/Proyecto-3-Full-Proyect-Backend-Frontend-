import prisma from '../lib/prisma.js'

function createSlug(text) {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export const getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } }
    })
    res.json(suppliers)
  } catch (err) {
    next(err)
  }
}

export const createSupplier = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Name is required' })
    }

    const slug = createSlug(name)

    const supplier = await prisma.supplier.create({
       data: {
        name,
        email: email || null,
        phone: phone || null
      }
    })

    res.json(supplier)
  } catch (err) {
    next(err)
  }
}

export const deleteSupplier = async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    // Comprobar si tiene productos asociados
    const count = await prisma.product.count({
      where: { supplierId: id }
    })

    if (count > 0) {
      return res.status(400).json({
        error: "No puedes eliminar un proveedor que tiene productos asociados"
      })
    }

    // Eliminar si no tiene productos
    await prisma.supplier.delete({
      where: { id }
    })

    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}
