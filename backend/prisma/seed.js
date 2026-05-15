import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const slugify = t =>
  t.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// 🔥 helper seguro para Decimal nullable
const toDecimal = (v) =>
  v !== null && v !== undefined
    ? new Prisma.Decimal(v)
    : null;

async function main() {
  console.log('🌱 Iniciando seed...');

  /*
  |--------------------------------------------------------------------------
  | Categories
  |--------------------------------------------------------------------------
  */

  const categoriesData = ['Accesorios', 'Pokemon', 'Magic', 'Riftbound'];
  const categories = {};

  for (const name of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: slugify(name) },
      update: {},
      create: { name, slug: slugify(name) }
    });

    categories[name] = category;
  }

  /*
  |--------------------------------------------------------------------------
  | Suppliers
  |--------------------------------------------------------------------------
  */

  const suppliersData = ['TCGFACTORY', 'DISPERSA JUGUETES', 'ASMODEE'];
  const suppliers = {};

  for (const name of suppliersData) {
    const supplier = await prisma.supplier.upsert({
      where: { name },
      update: {},
      create: { name }
    });

    suppliers[name] = supplier;
  }

  /*
  |--------------------------------------------------------------------------
  | Users
  |--------------------------------------------------------------------------
  */

  const adminPassword = await bcrypt.hash('admin123', 10);
  const managerPassword = await bcrypt.hash('manager123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@inventory.com' },
    update: {},
    create: {
      email: 'admin@inventory.com',
      password: adminPassword,
      name: 'Admin',
      role: 'admin'
    }
  });

  await prisma.user.upsert({
    where: { email: 'manager@inventory.com' },
    update: {},
    create: {
      email: 'manager@inventory.com',
      password: managerPassword,
      name: 'Manager',
      role: 'manager'
    }
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@inventory.com' },
    update: {},
    create: {
      email: 'user@inventory.com',
      password: userPassword,
      name: 'User',
      role: 'user'
    }
  });

  /*
  |--------------------------------------------------------------------------
  | Address
  |--------------------------------------------------------------------------
  */

  await prisma.address.create({
    data: {
      userId: user.id,
      fullName: 'User Test',
      address1: 'Calle Inventada 123',
      city: 'Las Palmas',
      postalCode: '35001',
      country: 'España',
      phone: '600123123'
    }
  });

  /*
  |--------------------------------------------------------------------------
  | Products + Variants
  |--------------------------------------------------------------------------
  */

  const products = [
    {
      name: 'Archivador Portfolio Ultra Pro',
      category: 'Accesorios',
      supplier: 'TCGFACTORY',
      description: 'Archivador 9 bolsillos.',
      variants: [
        {
          name: 'Azul',
          sku: 'PF-UP-AZUL',
          language: null,
          condition: null,
          isFoil: false,
          isFirstEdition: false,
          availability: 'IN_STOCK',
          stock: 5,
          reservedStock: 1,
          minStock: 2,
          supplierReference: '074427813673',
          supplierPrice: 15.99,
          retailPrice: 19.99,
          sellingPrice: 19.99,
          compareAtPrice: 19.99,
          salePrice: 17.99,
          deliveryTime: 15,
          imageUrl:
            'https://tcgfactory.com/2414-thickbox_default/archivador-9-bolsillos-portfolio-collector-s-azul-ultra-pro.jpg'
        }
      ]
    },

    {
      name: 'ETB Heroes Ascendentes',
      category: 'Pokemon',
      supplier: 'DISPERSA JUGUETES',
      description: 'Elite Trainer Box.',
      variants: [
        {
          name: 'Español',
          sku: 'PKMN-ETB-HA-ESP',
          language: 'SPANISH',
          condition: 'MINT',
          isFoil: false,
          isFirstEdition: false,
          availability: 'IN_STOCK',
          stock: 12,
          reservedStock: 2,
          minStock: 5,
          supplierReference: 'BANPC10315-SPA',
          supplierPrice: 49.99,
          retailPrice: 69.99,
          sellingPrice: 69.99,
          compareAtPrice: 69.99,
          salePrice: 59.99,
          deliveryTime: 20,
          imageUrl:
            'https://cardzone.es/cdn/shop/files/caja-de-entrenador-elite-trainer-box-etb-heroes-ascendentes-ascended-heroes-cartas-pokemon-tcg-cardzone.png?v=1771326806&width=600'
        },

        {
          name: 'English',
          sku: 'PKMN-ETB-HA-ENG',
          language: 'ENGLISH',
          condition: 'MINT',
          isFoil: false,
          isFirstEdition: false,
          availability: 'BACKORDER',
          stock: 0,
          reservedStock: 0,
          minStock: 0,
          supplierReference: 'BANPC10315-EN',
          supplierPrice: 44.99,
          retailPrice: 64.99,
          sellingPrice: 64.99,
          compareAtPrice: 64.99,
          salePrice: null,
          deliveryTime: 25,
          imageUrl:
            'https://cardzone.es/cdn/shop/files/caja-de-entrenador-elite-trainer-box-etb-ascended-heroes-cartas-pokemon-tcg-cardzone.png?v=1771327393&width=600'
        }
      ]
    },

    {
      name: 'Marvel Spider-Man Booster Box',
      category: 'Magic',
      supplier: 'TCGFACTORY',
      description: 'Display Play Booster.',
      variants: [
        {
          name: 'English',
          sku: 'MTG-SPIDERMAN-ENG',
          language: 'ENGLISH',
          condition: 'MINT',
          isFoil: false,
          isFirstEdition: false,
          availability: 'BACKORDER',
          stock: 0,
          reservedStock: 0,
          minStock: 0,
          supplierReference: '195166289762',
          supplierPrice: 89.99,
          retailPrice: 129.99,
          sellingPrice: 129.99,
          compareAtPrice: 129.99,
          salePrice: null,
          deliveryTime: 15,
          imageUrl:
            'https://tcgfactory.com/74923-thickbox_default/play-booster-display-30-sobres-marvel-s-spider-man-ingles-magic-the-gathering.jpg'
        }
      ]
    },

    {
      name: 'Riftbound VEX Champion Deck',
      category: 'Riftbound',
      supplier: 'ASMODEE',
      description: 'Champion Deck.',
      variants: [
        {
          name: 'First Edition English',
          sku: 'RIF-VEX-1ST',
          language: 'ENGLISH',
          condition: 'MINT',
          isFoil: false,
          isFirstEdition: true,
          availability: 'PREORDER',
          releaseDate: new Date('2026-07-15'),
          stock: 0,
          reservedStock: 0,
          minStock: 0,
          supplierReference: '810155274320',
          supplierPrice: 12.99,
          retailPrice: 19.99,
          sellingPrice: 19.99,
          compareAtPrice: 19.99,
          salePrice: null,
          deliveryTime: 10,
          imageUrl:
            'https://www.generacionx.es/Imagenes/Articulos/0810155274337.jpg'
        }
      ]
    }
  ];

  for (const p of products) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: slugify(p.name),
        description: p.description,
        categoryId: categories[p.category].id,
        supplierId: suppliers[p.supplier].id
      }
    });

    for (const v of p.variants) {
      const variant = await prisma.productVariant.create({
        data: {
          productId: product.id,
          name: v.name,
          sku: v.sku,
          language: v.language,
          condition: v.condition,
          isFoil: v.isFoil,
          isFirstEdition: v.isFirstEdition,
          availability: v.availability,
          releaseDate: v.releaseDate,
          stock: v.stock,
          reservedStock: v.reservedStock,
          minStock: v.minStock,
          supplierReference: v.supplierReference,

          supplierPrice: toDecimal(v.supplierPrice),
          retailPrice: toDecimal(v.retailPrice),
          sellingPrice: toDecimal(v.sellingPrice),
          compareAtPrice: toDecimal(v.compareAtPrice),
          salePrice: toDecimal(v.salePrice),

          deliveryTime: v.deliveryTime
        }
      });

      await prisma.productImage.create({
        data: {
          productVariantId: variant.id,
          url: v.imageUrl,
          position: 0
        }
      });

      await prisma.productPriceHistory.create({
        data: {
          productVariantId: variant.id,
          oldPrice: new Prisma.Decimal(v.retailPrice),
          newPrice: new Prisma.Decimal(v.sellingPrice)
        }
      });

      if (v.stock > 0) {
        await prisma.stockMovement.create({
          data: {
            productVariantId: variant.id,
            userId: admin.id,
            type: 'IN',
            quantity: v.stock,
            reason: 'Stock inicial'
          }
        });
      }
    }
  }

  /*
  |--------------------------------------------------------------------------
  | Cart + Order
  |--------------------------------------------------------------------------
  */

  const cart = await prisma.cart.create({
    data: {
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 15)
    }
  });

  const pokemonVariant = await prisma.productVariant.findUnique({
    where: {
      sku: 'PKMN-ETB-HA-ESP'
    }
  });

  if (pokemonVariant) {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productVariantId: pokemonVariant.id,
        quantity: 1
      }
    });

    await prisma.stockMovement.create({
      data: {
        productVariantId: pokemonVariant.id,
        userId: user.id,
        type: 'RESERVED',
        quantity: 1,
        reason: 'Producto reservado en carrito'
      }
    });

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: 'PAID',
        total: new Prisma.Decimal(69.99)
      }
    });

    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productVariantId: pokemonVariant.id,
        quantity: 1,
        productName: 'ETB Heroes Ascendentes',
        variantName: 'Español',
        productSku: pokemonVariant.sku,
        unitPrice: new Prisma.Decimal(69.99),
        totalPrice: new Prisma.Decimal(69.99)
      }
    });
  }

  console.log('✅ Seed completado');
  console.log('👤 Admin: admin@inventory.com / admin123');
  console.log('👤 Manager: manager@inventory.com / manager123');
  console.log('👤 User: user@inventory.com / user123');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
