# 🌸 MercadoAcho

Plataforma web (MVP / prueba de concepto) para digitalizar las ventas de los comerciantes del **Mercado de Flores de Acho** (Lima, Perú).

> **Estado:** prototipo académico. El catálogo y los pedidos usan datos de demostración en memoria; el esquema de base de datos con RLS para Supabase está listo en `supabase/schema.sql`. No incluye pasarela de pagos ni logística externa.

## Funcionalidades

| Módulo | Implementado |
|---|---|
| Registro e inicio de sesión de comerciantes | `/login` (Supabase Auth, se activa al configurar `.env.local`) |
| Perfil público del comerciante | `/comerciante/[id]` |
| Catálogo con precios, disponibilidad, búsqueda y filtro por categoría | `/` |
| Carrito, retiro en mercado o delivery, confirmación de pedido | `/` + `POST /api/pedidos` |
| Panel de pedidos, cambio de estados e indicadores de ventas | `/panel` |

## Arquitectura

```
Navegador (Next.js + React + Tailwind)
        │
        ▼
Next.js Route Handlers (/api/pedidos)  ← validación de entradas en el servidor
        │
        ▼
Supabase (PostgreSQL + RLS, Auth, Storage)
```

```
app/            páginas y API (Next.js App Router)
lib/            lógica de negocio (carrito, validaciones, estados de pedido)
tests/          pruebas unitarias Vitest
supabase/       esquema SQL con políticas Row Level Security
.github/workflows/ci-cd.yml   pipeline CI/CD
```

**Stack:** Next.js, React, TypeScript, Tailwind CSS, Supabase, Vitest, Semgrep, npm audit, Gitleaks, GitHub Actions, Vercel.

## Instalación y ejecución

Requisitos: Node.js 20 o superior.

```bash
npm install
cp .env.example .env.local   # completar con las claves de Supabase (opcional para la demo)
npm run dev                  # http://localhost:3000
npm run test                 # pruebas Vitest
npm run build                # build de producción
```

Para la base de datos: en Supabase → SQL Editor, ejecutar `supabase/schema.sql`.

---

## Documentación académica

### 1. Estrategia de branching
- `main`: rama de producción. Solo recibe cambios mediante Pull Request.
- `test`: rama de integración. Los cambios se suben aquí primero, GitHub Actions los valida y luego se abre un Pull Request `test → main`.
- Al aprobar y fusionar el PR, el push a `main` dispara el despliegue.

### 2. Pipeline CI/CD (`.github/workflows/ci-cd.yml`)
Se ejecuta en cada push a `main`/`test` y en cada Pull Request hacia `main`. Tiene 4 jobs:
1. **BUILD:** instala dependencias (`npm ci`, o `npm install` si aún no hay `package-lock.json`) y compila con `npm run build`.
2. **TEST:** ejecuta Vitest; los resultados se ven en el log y como anotaciones. Si una prueba falla, el job falla.
3. **SECURITY:** Semgrep (SAST), `npm audit --audit-level=high` (falla con vulnerabilidades altas o críticas) y Gitleaks (falla si detecta secretos).
4. **DEPLOY:** solo corre si BUILD, TEST y SECURITY pasaron **y** el evento es un push a `main`. Los Pull Requests nunca despliegan a producción. Usa los secretos `VERCEL_TOKEN`, `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID`.

### 3. Pruebas automatizadas
`tests/` contiene pruebas unitarias con casos válidos y de error:
- Validación de productos (nombre, categoría, precio, stock).
- Cálculo de subtotal y total del carrito (con y sin delivery).
- Validación de cantidades (cero, negativos, decimales, exceso de stock).
- Validación de datos de pedidos (teléfono, dirección para delivery, pedido vacío).
- Transiciones permitidas de estado: `pendiente → confirmado → listo → entregado`, con cancelación solo antes de "listo".

### 4. Controles de seguridad
- **Autenticación:** Supabase Auth (correo y contraseña).
- **Autorización y RLS:** políticas en PostgreSQL para que cada comerciante solo lea o modifique sus productos y pedidos (`auth.uid() = comerciante_id`).
- **Validación en el servidor:** `/api/pedidos` valida los datos y recalcula precios en el servidor, sin confiar en el cliente.
- **Credenciales:** variables de entorno; `.env.local` está en `.gitignore`; solo se usa la *anon key* pública. La *service_role key* nunca se expone en el frontend.
- **HTTPS:** Vercel lo aplica por defecto, y se agrega la cabecera HSTS en `next.config.mjs`.
- **SAST, dependencias y secretos:** Semgrep, npm audit y Gitleaks en el pipeline.

### 5. Despliegue en la nube
1. Crear el proyecto en Vercel importando este repositorio.
2. Configurar en Vercel las variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. En GitHub → Settings → Secrets and variables → Actions, crear `VERCEL_TOKEN`, `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID`.
4. Cada merge a `main` despliega automáticamente con la CLI de Vercel.

## Evidencias para la evaluación
1. **Ramas:** pestaña *Code* → selector de ramas mostrando `main` y `test`.
2. **Pull Request:** pestaña *Pull requests* → PR `test → main` con los checks.
3. **Pipeline:** pestaña *Actions* → ejecución con los jobs BUILD, TEST, SECURITY y DEPLOY.
4. **Pruebas:** abrir el job TEST y capturar el log de Vitest.
5. **Seguridad:** abrir el job SECURITY y capturar Semgrep, npm audit y Gitleaks.
6. **Despliegue:** URL pública de Vercel abierta en el navegador.

> Rama `test`: integración validada por GitHub Actions antes de fusionar a `main`.
