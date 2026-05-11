### 2026-05-11 — Refactor de producto + Prisma + seed + edición completa de inventario
- **Herramienta**: ChatGPT
- **Contexto**: Estaba ampliando un sistema de inventario para añadir edición de productos, nuevos campos (descripción larga, proveedor, precios extendidos) y arreglar errores de Prisma tras cambios en la base de datos.

- **Prompt usado**: 
    "Necesito que me ayudes con este proyecto. He hecho cambios a este documentos para que se asemeje a lo que yo quería, pero he modificado la parte de HTML. ¿Podrías modificar el resto del documento para que funcione todo bien? Tambien quiero que en la parte superior a la altura de volver a productos pero a la derecha aparezca un simbolito en la parte de arriba que permita editar los campos de debajo y aparezca abajo un botón de "guardar cambios" y si lo hago se guarde en la base de datos también."

    "solucionar error Prisma con error de término que no aparece en el código, apareciendo el término "existe" cuando no había ninguna palabra así."

- **Qué obtuvo** : Código completo de React para edición inline de productos, backend PUT para actualizar.

- **Qué modificó o descartó**: Hubo que eliminar referencia a columnas inexistentes (existe), hacer migrate/reset de Prisma, ajustar schema.prisma, corregir seed y configurar correctamente Prisma seed en package.json.

- **Tiempo con IA**: ~2h–3h | Tiempo sin IA (estimado): ~4–6 h

- **Aprendizaje**: Entendí cómo sincronizar Prisma con la base de datos (migrate/reset/generate), cómo añadir campos correctamente sin romper queries, y cómo estructurar edición dinámica en React con estado editable.