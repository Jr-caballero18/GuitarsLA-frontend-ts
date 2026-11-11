# GuitarLA – Frontend (React + TypeScript + Vite)

Tienda de guitarras en React. El catálogo se lee desde la API del backend (`GET /api/guitars`) y el formulario **Agregar Guitarra** guarda en PostgreSQL (`POST /api/guitars`).

## Requisitos

- Node.js 18 o superior
- El **backend** de GuitarLA corriendo (ver `guitarsla-backend/README.md`)

## Instalación

```bash
npm install
```

## Variables de entorno

```bash
 .env.
VITE_API_URL=http://localhost:4000/api

 .env.template
 VITE_API_URL=http://localhost:4000/api

```

| Variable       | Descripción                  | Valor por defecto           |
| -------------- | ---------------------------- | --------------------------- |
| `VITE_API_URL` | URL base de la API (backend) | `http://localhost:4000/api` |

## Cómo arrancar todo

1. **Backend** (en su carpeta): `npm run dev` → `http://localhost:4000`
2. **Frontend** (en esta carpeta): `npm run dev` → `http://localhost:5173`

Abre `http://localhost:5173`. El origen del frontend debe coincidir con `CORS_ORIGIN` del backend.

## Funcionalidad

- **Catálogo (Read):** `src/hooks/useCart.ts` consume `getGuitars()` (`src/api/guitars.ts`) y muestra estados de carga, error y lista vacía.
- **Formulario (Create):** `src/components/GuitarForm.tsx` valida en el cliente (campos vacíos, precio no numérico o ≤ 0) antes de llamar a `createGuitar()`; muestra los errores del servidor si los hay y recarga el catálogo al guardar.
- El carrito sigue funcionando igual que antes (guardado en `localStorage`).

## Pruebas E2E manuales

1. Con ambos servidores arriba, el catálogo muestra las guitarras de la base de datos (si está vacía, corre `npm run seed` en el backend).
2. Envía el formulario vacío → aparecen mensajes de error y no hay petición.
3. Precio `-5` → error "El precio debe ser mayor a 0".
4. Datos válidos → mensaje de éxito y la guitarra aparece en el catálogo.
5. Revisa que no haya errores en la consola del navegador ni en la del servidor.

## Scripts

`npm run dev` · `npm run build` · `npm run lint` · `npm run preview`
