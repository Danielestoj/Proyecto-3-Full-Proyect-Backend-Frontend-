# Opción D: Sistema de Gestión de Inventario

Herramienta para gestionar el inventario de una tienda con alertas de stock y dashboard de estadísticas.

## Stack

- **Backend:** Node.js + Express + Prisma + PostgreSQL + JWT + Zod + Vitest
- **Frontend:** React 18 + Vite + React Router v6 + CSS Modules

## Puesta en marcha

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edita .env con tu DATABASE_URL
npx prisma migrate dev --name init
node prisma/seed.js
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Usuarios de prueba (tras seed)

| Email | Contraseña | Rol |
|---|---|---|
| admin@inventory.com | admin123 | ADMIN |
| manager@inventory.com | manager123 | MANAGER |

Los nuevos registros obtienen rol VIEWER (solo lectura).

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
