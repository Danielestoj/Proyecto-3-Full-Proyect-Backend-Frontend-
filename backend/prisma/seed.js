import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const categories = await Promise.all([
    prisma.category.upsert({ where: { name: 'Accesorios' }, update: {}, create: { name: 'Accesorios' } }),
    prisma.category.upsert({ where: { name: 'Pokemon' }, update: {}, create: { name: 'Pokemon' } }),
    prisma.category.upsert({ where: { name: 'Magic' }, update: {}, create: { name: 'Magic' } }),
    prisma.category.upsert({ where: { name: 'Riftbound' }, update: {}, create: { name: 'Riftbound' } }),
  ])

  const adminPassword = await bcrypt.hash('admin123', 10)
  const managerPassword = await bcrypt.hash('manager123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@inventory.com' },
    update: {},
    create: { email: 'admin@inventory.com', password: adminPassword, name: 'Admin', role: 'ADMIN' },
  })

  const manager = await prisma.user.upsert({
    where: { email: 'manager@inventory.com' },
    update: {},
    create: { email: 'manager@inventory.com', password: managerPassword, name: 'Manager', role: 'MANAGER' },
  })

  const products = [
    { name:'Archivador 9 bolsillos portfolio Collectors azul Ultra Pro', sku:'PF-UP-COL-9BOL-180-AZU', description:'Archivador 9 bolsillos portfolio Collectors azul Ultra Pro. Contiene 10 hojas de calidad. Color Azul. Para 90 cartas individuales o 180 a doble cara.',
       imageUrl:'https://tcgfactory.com/2414-thickbox_default/archivador-9-bolsillos-portfolio-collector-s-azul-ultra-pro.jpg', supplier:'TCGFACTORY', supplierReference:'074427813673', deliveryTime:15, price:15.99, retailPrice:19.99, sellingPrice:19.99, stock:2, minStock:5, categoryId:categories[0].id },
    { name:'Fortress Card Drawers (4 cajones horizontales) Negro - Dragon Shield', sku:'DragonShield-AT-33708', description:'Fortress Card Drawers es una solución de almacenamiento segura, elegante y organizada para colecciones de TCG, ideal para mantener tus cartas protegidas y siempre accesibles en la estantería. Incorpora 4 cajones con capacidad para más de 620 cartas con funda simple, 8 cajas Dragon Shield DS100 o 25 Cube Shells cada uno. Cada cajón incluye un separador de espuma para fijar y organizar mejor la colección, con posibilidad de añadir separadores adicionales. Fabricado en cartón rígido con superficie resistente a arañazos y un diseño de colores discretos que se integra fácilmente en cualquier estantería. Medidas: 335 × 109 × 390 mm; interior por cajón: 71 × 96 × 380 mm.', imageUrl:'https://tcgfactory.com/2414-thickbox_default/fortress-card-drawers-4-cajones-horizontales-negro-dragon-shield.jpg', supplier:'TCGFACTORY', supplierReference:'5706569337087', deliveryTime:15, price:19.99, retailPrice:29.99, sellingPrice:39.99, stock:5, minStock:2, categoryId:categories[0].id },
    { name:'ETB Caja de Entrenador Elite Heroes Ascendentes - Español', sku:'PKMN-CEE-HA-ESP', description:'Pokemon TCG en español contiene: 9 sobres de mejora de Heroes Ascendentes de JCC Pokémon TCG. 1 carta promocional de Zekrom de N. 65 fundas para cartas con diseño de Mega Dragonite. 40 cartas de Energía de JCC Pokémon. 1 guía para jugadores de la expansión Heroes Ascendentes : Ascended Heroes. Dados y marcadores de condición. 1 caja de coleccionista para guardarlo todo con 4 divisores para mantenerlo todo organizado. 1 carta con código para usar en JCC Pokémon Online o en JCC Pokémon Live', imageUrl:'https://cardzone.es/cdn/shop/files/caja-de-entrenador-elite-trainer-box-etb-heroes-ascendentes-ascended-heroes-cartas-pokemon-tcg-cardzone.png?v=1771326806&width=600', supplier:'DISPERSA JUGUETES', supplierReference:'BANPC10315', deliveryTime:20, price:49.99, retailPrice:69.99, sellingPrice:69.99, stock:12, minStock:5, categoryId:categories[1].id },
    { name:'Booster Display (30 Sobres) Marvels Spider-Man Inglés', sku:'MagictheGathering-D45240001', description:'Play Boosters (30 sobres) Marvels Spider-Man (inglés) – Magic: The Gathering. Caja con 30 sobres Play-Booster. Cada sobre contiene 14 cartas y 1 ficha, con combinaciones variables de rareza: entre 1 y 4 cartas raras o superiores, 3 a 5 infrecuentes, 6 a 9 comunes y 1 tierra. Incluye 1 carta foil tradicional garantizada por sobre. En el 20 % de los sobres, la tierra también será foil. Distribución ideal para tiendas enfocadas en juego sellado y draft entre jugadores.', imageUrl:'https://tcgfactory.com/74923-thickbox_default/play-booster-display-30-sobres-marvel-s-spider-man-ingles-magic-the-gathering.jpg', supplier:'TGCFACTORY', supplierReference:'195166289762', deliveryTime:15, price:89.99, retailPrice:129.99, sellingPrice:129.99, stock:2, minStock:0, categoryId:categories[2].id },
    { name:'Unleashed Champion Deck - VEX', sku:'RIF-UNL-MZ-VEX', description:'RIFTBOUND UNLEASHED! VEX CHAMPION DECK. This is going to be... awful, in a very good way! Vex drags her foes down into despairing depths with this Champion Deck. This preconstructed 56-card deck is built to thwart your opponent at every turn, forcing them to make difficult decision after decision. Whether you´re a new player ready to jump in or a seasoned schemer looking for a fresh deck, Vex is ready to make your opponent miserable straight out of the box. Includes 1 Riftbound: Unleashed booster! Ready to Play – A full 56-card preconstructed deck featuring Vex, designed for accessible and dynamic gameplay +1 Unleashed booster awful, in a very good way! – This deck loves to play slow and steady, letting you incrementally pick apart your foes while you hold battlefields. Extras to Keep You in the Action – Comes with a full-size paper playmat, a booster pack for customization, and deck-building tips.Booklet Included – Learn the game with an easy-to-follow rules and deck-building guide. Custom Paper Deckbox – A durable, foldable deckbox that ships flat and assembles quickly, keeping your cards safe and portable.', imageUrl:'https://www.generacionx.es/Imagenes/Articulos/0810155274337.jpg', supplier:'ASMODEE', supplierReference:'810155274320', deliveryTime:10, price:12.99, retailPrice:19.99, sellingPrice:19.99, stock:6, minStock:6, categoryId:categories[3].id },
  ]

  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: p,
    })

    await prisma.stockMovement.create({
      data: { productId: product.id, type: 'IN', quantity: p.stock, reason: 'Stock inicial', userId: admin.id },
    })
  }

  console.log('✅ Seed completado')
  console.log('👤 Admin:   admin@inventory.com / admin123')
  console.log('👤 Manager: manager@inventory.com / manager123')
}

main().catch(console.error).finally(() => prisma.$disconnect())
