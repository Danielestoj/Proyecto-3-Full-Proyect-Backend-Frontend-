# TiendaFriki – Proyecto FullStack (Node + React + PostgreSQL)

# Descripción
TiendaFriki es una plataforma prácticamente completa de comercio electrónico enfocada en productos frikis.

El proyecto cumple todos los requisitos del enunciado, incluyendo:

    API REST con 4 recursos principales

    Autenticación JWT

    Roles (user/admin)

    Base de datos PostgreSQL con Prisma ORM

    Validaciones en todos los endpoints

    Manejo de errores centralizado

    Integración externa (EmailJS)

    Frontend en React con Context API

    Carrito persistente

    Diseño responsive

    CSS Modules

    Tests unitarios e integración

    Deploy completo

## Integración externa: EmailJS
El proyecto incluye una integración externa mediante EmailJS, usada para enviar un email automático cuando un usuario se suscribe al newsletter desde el footer.

## Estilos y diseño (Resumen)
El diseño de TiendaFriki está construido con CSS Modules, lo que permite mantener los estilos aislados por componente y evitar conflictos entre clases. Cada vista y componente tiene su propio archivo .module.css, facilitando la escalabilidad y el mantenimiento del proyecto.

El enfoque es Mobile First, con breakpoints principales para móvil (≤500px), tablet (≤780px) y escritorio (≥1080px). Esto garantiza que todas las páginas —tienda, ofertas, carrito, detalle de producto y panel admin— se adapten correctamente a cualquier dispositivo.

A nivel visual, la interfaz utiliza glassmorphism, sombras suaves, bordes redondeados y gradientes para lograr un estilo moderno y limpio. El layout combina Flexbox y CSS Grid para organizar productos, formularios y secciones de forma fluida y flexible.

En resumen, el sistema de estilos es:

    Modular (CSS Modules)

    Responsivo (Mobile First + media queries)

    Moderno (glassmorphism, sombras, gradientes)

    Escalable (estructura clara por componente)

## Stack

- **Backend:** Node.js + Express + Prisma + PostgreSQL + JWT + Zod + Vitest
- **Frontend:** React 18 + Vite + React Router v6 + CSS Modules

## Puesta en marcha

## Backend

```bash
cd backend
npm install
cp .env.example .env
# Edita .env con tu DATABASE_URL
npx prisma migrate dev --name init
node prisma/seed.js
npm run dev
```

## Frontend

```bash
cd frontend
npm install
npm install emailjs-com
cp .env.example .env
npm run dev
```

## Usuarios de prueba (tras seed)

| Email | Contraseña | Rol |
|---|---|---|
| admin@inventory.com | admin123 | ADMIN |
| manager@inventory.com | manager123 | MANAGER |

Los nuevos registros obtienen rol "user" (solo lectura).


## Rutas principales
    / – Home

    /tienda – Tienda

    /offers – Ofertas

    /product/:id – Detalle

    /cart – Carrito

    /login – Login

    /register – Registro

    /admin/* – Panel admin (protegido)

## Carrito de compra
    Implementado con Context API:

    Añadir productos

    Variantes

    Aumentar / disminuir cantidad

    Eliminar producto

    Vaciar carrito

    Persistencia en localStorage



## Tests

```bash
cd backend
npm test
```

## Endpoints de la API

| Método | Ruta | Descripción | Auth | Rol |
|---|---|---|---|---|
| POST | /api/auth/register | Registro | — | — |
| POST | /api/auth/login | Login | — | — |
| GET | /api/dashboard | Estadísticas e inventario | ✓ | any |
| GET | /api/products | Lista de productos | ✓ | any |
| GET | /api/products/:id | Detalle + movimientos | ✓ | any |
| POST | /api/products | Crear producto | ✓ | MANAGER/ADMIN |
| PUT | /api/products/:id | Editar producto | ✓ | MANAGER/ADMIN |
| DELETE | /api/products/:id | Borrar producto | ✓ | ADMIN |
| POST | /api/products/:id/movements | Registrar movimiento | ✓ | MANAGER/ADMIN |
| GET | /api/products/:id/movements | Historial | ✓ | any |
| GET | /api/categories | Lista categorías | ✓ | any |

## Estructuras de carpetas

# Backend
backend/
│
├── app.js
├── server.js
├── package.json
├── package-lock.json
├── .env
├── .env.example
├── .gitignore
│
├── controllers/
│   ├── auth.controller.js
│   ├── categories.controller.js
│   ├── dashboard.controller.js
│   ├── products.controller.js
│   └── suppliers.controller.js
│
├── routes/
│   ├── auth.routes.js
│   ├── categories.routes.js
│   ├── dashboard.routes.js
│   ├── products.routes.js
│   └── suppliers.routes.js
│
├── middleware/
│   ├── auth.js
│   ├── isAdmin.js
│   └── errorHandler.js
│
├── schemas/
│   ├── auth.schema.js
│   └── product.schema.js
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│       └── ... (migraciones generadas)
│
└── tests/
    ├── auth.test.js
    └── products.test.js

# Frontend

frontend/
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .env
├── .env.example
├── .gitignore
│
├── public/
│
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    │
    ├── config/
    │   └── api.js
    │
    ├── context/
    │   ├── AuthContext.jsx
    │   └── CartContext.jsx
    │
    ├── hooks/
    │   └── useApi.js
    │
    ├── components/
    │   ├── Header/
    │   │   ├── Header.jsx
    │   │   └── Header.module.css
    │   │
    │   ├── Footer/
    │   │   ├── Footer.jsx
    │   │   └── Footer.module.css
    │   │
    │   ├── Categories/
    │   │   ├── Categories.jsx
    │   │   └── Categories.module.css
    │   │
    │   ├── FeaturedProducts/
    │   │   ├── FeaturedProducts.jsx
    │   │   └── FeaturedProducts.module.css
    │   │
    │   ├── Offers/
    │   │   ├── Offers.jsx
    │   │   └── Offers.module.css
    │   │
    │   ├── Hero/
    │   │   ├── Hero.jsx
    │   │   └── Hero.module.css
    │   │
    │   └── HeaderAdmin/
    │       ├── Navbar.jsx
    │       ├── Navbar.module.css
    │       └── ProtectedRoute.jsx
    │
    ├── pages/
    │   ├── Store/
    │   │   ├── StorePage.jsx
    │   │   └── StorePage.module.css
    │   │
    │   ├── OffersPage/
    │   │   ├── OffersPage.jsx
    │   │   └── OffersPage.module.css
    │   │
    │   ├── Product/
    │   │   ├── ProductPage.jsx
    │   │   └── ProductPage.module.css
    │   │
    │   ├── Cart/
    │   │   ├── Cart.jsx
    │   │   └── Cart.module.css
    │   │
    │   ├── Admin/
    │   │   ├── CategoryNew/
    │   │   │   ├── CategoryNew.jsx
    │   │   │   └── CategoryNew.module.css
    │   │   │
    │   │   ├── ProductNew/
    │   │   │   ├── ProductNew.jsx
    │   │   │   └── ProductNew.module.css
    │   │   │
    │   │   ├── SupplierNew/
    │   │   │   ├── SupplierNew.jsx
    │   │   │   └── SupplierNew.module.css
    │   │   │
    │   │   ├── ProductList/
    │   │   │   ├── ProductList.jsx
    │   │   │   └── ProductList.module.css
    │   │   │
    │   │   └── Dashboard/
    │   │       ├── Dashboard.jsx
    │   │       └── Dashboard.module.css
    │   │
    │   ├── Login/
    │   │   ├── Login.jsx
    │   │   └── AuthForm.module.css
    │   │
    │   └── Register/
    │       ├── Register.jsx
    │       └── AuthForm.module.css
    │
    └── router/
        ├── AppRouter.jsx
        └── ProtectedRoute.jsx

