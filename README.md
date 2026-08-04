# Frontend — Gestión de productos Rhiscom

Aplicación React para registrar, consultar, editar y eliminar productos mediante la API Spring Boot del mini proyecto Fullstack.

## Tecnologías

- React 19 y Vite.
- Tailwind CSS 4 mediante `@tailwindcss/vite`.
- Lucide React para la iconografía.

## Requisitos

- Node.js 20 o superior.
- Backend Spring Boot ejecutándose en `http://localhost:8080`.

## Ejecución

```bash
npm install
cp .env.example .env
npm run dev
```

Vite mostrará la aplicación en `http://localhost:5173`.

## Compilación

```bash
npm run build
npm run preview
```

## Variables de entorno

| Variable | Valor predeterminado | Descripción |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:8080` | Dirección del backend. |
| `VITE_PRODUCTS_PATH` | `/productos` | Ruta base del recurso. |
| `VITE_API_STYLE` | `document` | Contrato HTTP que utilizará el frontend. |

El modo `document` sigue literalmente el enunciado de la prueba:

- `GET /productos`: listar.
- `POST /productos`: crear o actualizar; para actualizar envía el `id` en el JSON.
- `POST /productos/{id}`: eliminar.

Si el backend implementa una API REST convencional, cambia `VITE_API_STYLE=rest` para usar:

- `POST /productos`: crear.
- `PUT /productos/{id}`: actualizar.
- `DELETE /productos/{id}`: eliminar.

## Estructura principal

```text
src/
├── components/
│   ├── ConfirmDialog.jsx
│   ├── IconButton.jsx
│   ├── ProductForm.jsx
│   ├── ProductTable.jsx
│   └── StatusBanner.jsx
├── services/
│   └── productApi.js
├── App.jsx
├── index.css
└── main.jsx
```

## Funcionalidades

- Formulario controlado con validación de nombre, precio y stock.
- Listado responsive para escritorio y dispositivos móviles.
- Creación, edición y eliminación de productos.
- Confirmación antes de eliminar.
- Búsqueda local por nombre.
- Resumen de referencias, unidades y valor del inventario.
- Estados de carga, error, éxito y lista vacía.
- URL y estilo de la API configurables.
