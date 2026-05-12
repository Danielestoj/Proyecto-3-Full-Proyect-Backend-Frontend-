### 2026-05-11 — Refactor de producto + Prisma + seed + edición de inventario
- **Herramienta**: ChatGPT
- **Contexto**: Estaba ampliando un sistema de inventario para añadir edición de productos, nuevos campos (descripción larga, proveedor, precios extendidos) y arreglar errores de Prisma tras cambios en la base de datos.

- **Prompt usado**: 
    "Necesito que me ayudes con este proyecto. He hecho cambios a este documentos para que se asemeje a lo que yo quería, pero he modificado la parte de HTML. ¿Podrías modificar el resto del documento para que funcione todo bien? Tambien quiero que en la parte superior a la altura de volver a productos pero a la derecha aparezca un simbolito en la parte de arriba que permita editar los campos de debajo y aparezca abajo un botón de "guardar cambios" y si lo hago se guarde en la base de datos también."

    "solucionar error Prisma con error de término que no aparece en el código, apareciendo el término "existe" cuando no había ninguna palabra así."

- **Qué obtuvo** : Código completo de React para edición inline de productos, backend PUT para actualizar.

- **Qué modificó o descartó**: Hubo que eliminar referencia a columnas inexistentes (existe), hacer migrate/reset de Prisma, ajustar schema.prisma, corregir seed y configurar correctamente Prisma seed en package.json.

- **Tiempo con IA**: ~2h–3h | Tiempo sin IA (estimado): ~4–6 h

- **Aprendizaje**: Entendí cómo sincronizar Prisma con la base de datos (migrate/reset/generate), cómo añadir campos correctamente sin romper queries, y cómo estructurar edición dinámica en React con estado editable.


### 2026-05-12 — Integración del carrito + refactor de componentes dinámicos.
- **Herramienta**: Copilot

- **Contexto**: Estaba integrando un sistema de carrito global en una tienda React, migrando componentes estáticos a dinámicos y corrigiendo problemas de rutas, contextos y estilos. Al ser día presencial y mi ordenador no soportar Prisma no podía usar la base de datos e hice un mock para ver si funcionaban las funciones y los apartados.

- **Problemas principales del día**:
    Cart.jsx sin layout adecuado → se rediseñó en dos columnas con subtotal, envío y total.
    Precios con oferta → se implementó lógica para mostrar precio tachado, precio rebajado y cálculo automático del descuento.
    FeaturedProducts y Offers estaban hardcodeados → se refactorizaron para leer datos desde mockProducts.

- **Qué obtuvo**:
    Cart.jsx completo con diseño profesional, envío, ofertas y total dinámico.
    FeaturedProducts y Offers totalmente dinámicos, conectados al carrito y con cálculo automático de descuentos.

- **Qué modificó o descartó**:
    Eliminado el AuthProvider duplicado en App.jsx.
    Eliminado código hardcodeado de productos destacados y ofertas.
    Sustituido layout inline por CSS Modules limpios.
    Corregidos errores de sintaxis CSS que rompían estilos.

- **Tiempo con IA**: ~3h | **Tiempo sin IA (estimado)**: ~5–7h

- **Aprendizaje**:
    Cómo estructurar correctamente los Providers para evitar contextos rotos.
    Cómo convertir componentes estáticos en dinámicos basados en datos.
    Buenas prácticas de CSS Modules y debugging de estilos.
