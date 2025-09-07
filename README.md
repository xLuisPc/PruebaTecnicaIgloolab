# App CRUD Front + Back + Mobile

Entorno dockerizado con frontend React+TypeScript, backend Node + Express + Prisma y Postgres.

## Levantar con Docker

```bash
# Desde la raíz
docker compose up --build -d

- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Health: http://localhost:4000/health

## Ejecutar local (sin Docker)

Requisitos: Node 20+, Postgres en localhost:5432.

1. Backend
```bash
cd backend
cp .env.example .env   # edita DATABASE_URL si es necesario
npm install
npx prisma generate
npx prisma migrate dev --name init_products
npm run dev
```

2. Frontend
```bash
cd frontend
cp .env.example .env   # VITE_API_URL=http://localhost:4000
npm install
npm run dev
```

## Variables de entorno
- backend/.env
  - PORT=4000
  - DATABASE_URL=postgresql://postgres:postgres@db:5432/igloolab?schema=public
- frontend/.env
  - VITE_API_URL=http://localhost:4000

## Endpoints
- GET /products
- POST /products
- DELETE /products/:id

## Base de datos
- Script SQL: `sql/products.sql`
- Prisma schema: `backend/prisma/schema.prisma` con modelo `Product` mapeado a tabla `products`.

## Pruebas rápidas
```bash
# listar
curl http://localhost:4000/products
# crear
curl -X POST http://localhost:4000/products -H "Content-Type: application/json" -d '{"name":"Prod","description":"Desc","price":12.50}'
# eliminar
curl -X DELETE http://localhost:4000/products/1
```

---

## Cómo replicar la API en C# con ASP.NET (Minimal APIs) — Explicación breve

Objetivo: exponer los mismos endpoints (GET/POST/DELETE products) con validaciones básicas sobre `name`, `description` y `price` (> 0) usando .NET 8, Minimal APIs y Entity Framework Core (Npgsql).

Pasos conceptuales:
1) Crear un proyecto Web minimal en .NET 8.
2) Agregar paquetes de EF Core y el proveedor de PostgreSQL (Npgsql).
3) Definir el modelo `Product` con propiedades `Id`, `Name` (<=255, requerido), `Description` (requerido) y `Price` (decimal(10,2), >0).
4) Configurar un `DbContext` con `DbSet<Product>` y mapear la entidad a la tabla `products` (nombre de tabla, tamaño del `Name` y tipo decimal).
5) Registrar el `DbContext` en el contenedor de dependencias con la cadena de conexión (appsettings.json o variable `DATABASE_URL`).
6) Habilitar CORS (orígenes abiertos para pruebas) para que el frontend pueda consumir la API.
7) Definir endpoints Minimal APIs: GET `/products`, POST `/products` (con validaciones), DELETE `/products/{id}`.
8) Crear migración inicial y actualizar la base con herramientas de EF (`dotnet-ef`).
9) Ejecutar la API y probar.

---

## App móvil (React Native + Expo)

Proyecto mínimo en `mobile/` que consume el mismo backend.

- Requisitos: Expo SDK 51, Node 20.
- Variables: crea `mobile/.env` con tu IP local para que el teléfono pueda acceder al backend del PC:
```
EXPO_PUBLIC_API_URL=http://<IP-de-tu-PC>:4000
```
  - Obtén tu IP en Windows con `ipconfig` (IPv4), sustitúyela en la variable.

- Instalación y arranque
```bash
cd mobile
npm install
npm start -- --clear
# Abre con Expo Go escaneando el QR o usa "w" para abrir en web
```

- Qué incluye la app
  - Lista de productos (nombre, descripción, precio)
  - Formulario para crear producto (validaciones: campos obligatorios y precio > 0)
  - Botón para eliminar producto

- Troubleshooting rápido
  - Pantalla en blanco o errores de Metro: ejecuta `npm start -- --clear` o `npx expo start -c`.
  - Si el teléfono no puede conectar: verifica que `EXPO_PUBLIC_API_URL` apunte a la IP del PC y que el puerto 4000 sea accesible en tu red local.
