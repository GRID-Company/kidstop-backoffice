# Architecture Documentation

Documentación de la arquitectura de **Kidstop Carpeta Digital** — aplicación web orientada al cliente para navegar inventario y realizar pedidos de cartas singles.

## Tabla de Contenidos

- [Visión General](#visión-general)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura Feature-First](#arquitectura-feature-first)
- [Módulos del Sistema](#módulos-del-sistema)
- [Estructura de Capas](#estructura-de-capas)
- [Patrones de Código](#patrones-de-código)
- [Convenciones](#convenciones)
- [Flujo de Datos](#flujo-de-datos)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Routing y Middleware](#routing-y-middleware)
- [Seguridad](#seguridad)

## Visión General

Aplicación web para clientes de Kidstop que permite navegar el inventario de cartas singles de **Pokémon TCG** y **Magic: The Gathering**, agregar cartas al carrito y realizar pedidos. Se publica en dos dominios independientes (uno por TCG) con autenticación compartida.

Roles de usuario: **Público** (sin cuenta), **Cliente**, **VIP** (compra remota) y **Kiosk** (iPad en tienda).

### Principios Fundamentales

1. **Feature-First**: Organización por características de negocio
2. **Separation of Concerns**: Cada capa tiene responsabilidades específicas
3. **Dependency Inversion**: Las capas superiores no dependen de las inferiores
4. **Single Responsibility**: Cada módulo tiene una única razón para cambiar
5. **DRY (Don't Repeat Yourself)**: Reutilización de código mediante shared components
6. **Mobile-First**: Diseño responsive partiendo de móvil

## Stack Tecnológico

### Core

- **Next.js 16** — Framework React con App Router
- **React 19** — Biblioteca UI con Server Components
- **TypeScript 5** — Tipado estático
- **Tailwind CSS 4** — Utility-first CSS framework

### UI Components

- **HeroUI 2.8+** — Componentes UI base
- **Framer Motion** — Animaciones
- **React Hook Form** — Gestión de formularios
- **Zod** — Validación de schemas
- **@iconify/react** — Iconos

### State Management

- **Zustand** — State management global (auth, TCG context, cart)

### API & Data

- **Apollo Client 4** — Cliente GraphQL
- **GraphQL Codegen** — Generación automática de tipos desde el schema del backend

### Integraciones

- **Google Maps JavaScript API** — Geolocalización y geofencing

### Utilidades

- **dayjs** — Manipulación de fechas
- **react-hot-toast** — Notificaciones toast

### Development

- **ESLint** — Linting con reglas TypeScript
- **Prettier** — Formateo de código con plugin Tailwind
- **eslint-plugin-unused-imports** — Limpieza de imports

## Arquitectura Feature-First

### Estructura Base

```
src/
├── app/                        # Next.js App Router
│   ├── (public)/               # Rutas sin autenticación
│   │   ├── layout.tsx
│   │   ├── page.tsx            # Catálogo (landing)
│   │   ├── carta/[id]/
│   │   └── most-wanted/
│   ├── (authenticated)/        # Rutas protegidas
│   │   ├── layout.tsx
│   │   ├── carrito/
│   │   ├── checkout/
│   │   ├── perfil/
│   │   ├── pedidos/
│   │   └── wishlist/
│   ├── (not-authenticated)/    # Login, registro
│   │   ├── login/
│   │   ├── registro/
│   │   └── recuperar-contrasena/
│   └── api/                    # API routes (cookies de sesión)
├── features/                   # Features del negocio
│   ├── auth/                   # Login, registro, recuperar contraseña
│   ├── catalog/                # Navegación, búsqueda, detalle
│   ├── cart/                   # Carrito + checkout
│   ├── wishlist/               # Lista de deseos
│   ├── orders/                 # Historial de pedidos
│   ├── profile/                # Perfil de usuario
│   └── most-wanted/            # Página pública Most Wanted
├── lib/                        # Core compartido
│   ├── api/                    # Apollo Client + codegen
│   │   ├── graphql/            # Archivos .gql
│   │   ├── generated/          # Tipos auto-generados
│   │   └── schema-types.ts     # Tipos del schema
│   ├── auth/                   # Hooks de autenticación
│   ├── consts/                 # Constantes globales
│   ├── store/                  # Zustand stores
│   ├── types/                  # Tipos globales compartidos
│   └── utils/                  # Utilidades
└── shared/                     # Componentes compartidos
    ├── base/                   # Componentes base
    ├── layouts/                # Header, footer, navegación
    └── providers/              # Apollo, HeroUI
```

## Módulos del Sistema

### auth
Login con email/contraseña, registro de nuevos clientes, recuperación de contraseña vía email. Cuenta unificada entre dominios Pokémon y Magic. Sesión via cookies HTTP-only.

### catalog
Página principal de la aplicación. Grid de cartas disponibles con búsqueda por nombre, filtros (set, rareza, precio, stock), detalle de carta con variantes y condiciones. Botones de agregar al carrito y wishlist.

### cart
Carrito de compras con store Zustand persistido en localStorage. Vista de carrito con controles de cantidad. Checkout con validación de stock, modal de faltantes, geofencing (Google Maps) para no-VIP, formulario Kiosk (nombre + correo) y confirmación de pedido.

### wishlist
Lista de deseos del usuario autenticado. Grid de cartas con indicador de stock. Agregar al carrito si disponible. No accesible para Público ni Kiosk.

### orders
Historial de pedidos del cliente filtrado por TCG del dominio. Listado con código, fecha, total y estado. Detalle con items y timeline de estados. No accesible para Kiosk.

### profile
Datos del usuario autenticado (nombre, email, teléfono, tipo). Edición inline y cambio de contraseña. No accesible para Kiosk.

### most-wanted
Página pública sin autenticación. Grid de cartas más buscadas por TCG. Optimizada para pantalla/TV (modo display fullscreen). Auto-refresh periódico.

### Estado Actual de Integración

Todos los features operan con **datos mock** (`*.mock.ts`). La migración a Apollo seguirá la guía `MOCK_TO_APOLLO_MIGRATION.md` del backoffice cuando el backend esté disponible.

## Estructura de Capas

### Feature Structure

Cada feature sigue esta estructura:

```
features/{feature-name}/
├── adapters/              # Capa de adaptación
│   ├── api/               # Mocks (luego queries/mutations GraphQL)
│   ├── forms/             # Schemas Zod + hooks useForm
│   └── mappers/           # Transformación de datos
├── domain/                # Capa de dominio
│   ├── types.ts           # Tipos TypeScript
│   └── constants.ts       # Constantes del módulo
└── ui/                    # Capa de presentación
    ├── components/        # Componentes React
    ├── hooks/             # Custom hooks del feature
    └── views/             # Vistas/páginas principales
```

### Adapters Layer

Responsable de la comunicación con el exterior:

- **api/**: Mocks inicialmente, luego queries y mutations GraphQL
- **forms/**: Schemas de validación con Zod + hooks `useForm` con `zodResolver`
- **mappers/**: Funciones puras que transforman datos entre capas

### Domain Layer

Lógica de negocio pura, sin dependencias de UI ni framework:

- **types.ts**: Interfaces y tipos del módulo
- **constants.ts**: Constantes, enums, opciones

### UI Layer

Presentación y interacción:

- **components/**: Componentes React reutilizables dentro del feature
- **hooks/**: Custom hooks que orquestan estado y datos
- **views/**: Componentes de página que componen la vista completa

## Patrones de Código

### Componentes

```typescript
type CardItemProps = {
  card: CatalogCard;
  onAddToCart?: (card: CatalogCard) => void;
};

export default function CardItem({ card, onAddToCart }: CardItemProps) {
  return (
    <div className="...">
      {/* ... */}
    </div>
  );
}
```

### Custom Hooks

```typescript
export function useCatalog(search?: string, filters?: CatalogFilters) {
  const tcg = useTCGContext();
  // ... lógica de datos
  return { cards, loading, totalCount };
}
```

### Form Schemas

```typescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

export type LoginForm = z.infer<typeof loginSchema>;
```

### Mappers

```typescript
export const toCreateOrderInput = (cart: CartItem[]): CreateOrderInput => ({
  items: cart.map((item) => ({
    cardId: item.cardId,
    variantId: item.variantId,
    condition: item.condition,
    quantity: item.quantity,
  })),
});
```

## Convenciones

### Naming

- **Archivos**: kebab-case (`card-item.tsx`, `use-catalog.ts`)
- **Componentes**: PascalCase (`CardItem`, `CatalogFilters`)
- **Funciones/variables**: camelCase (`formatCurrency`, `selectedTCG`)
- **Constantes**: UPPER_SNAKE_CASE (`TCG_TYPES`, `ORDER_STATUSES`)
- **Tipos**: PascalCase con prefijo I para interfaces de dominio (`ICatalogCard`)
- **Schemas**: sufijo `.schema.ts` (`login.schema.ts`)
- **Mocks**: sufijo `.mock.ts` (`catalog.mock.ts`)

### File Organization

- Un componente por archivo
- Exports default para componentes y vistas
- Named exports para hooks, tipos y utilidades
- Imports absolutos con alias `@/` (`@/lib/store/auth`)

## Flujo de Datos

```
Vista (view)
  ↓ usa
Hook del feature (use-catalog.ts)
  ↓ consume
Mock / Apollo Query (catalog.mock.ts → luego catalog.gql)
  ↓ retorna
Datos tipados
  ↓ renderiza
Componentes (card-item.tsx, card-grid.tsx)
```

Para mutations (crear pedido, editar perfil):

```
Formulario (React Hook Form + Zod)
  ↓ onSubmit
Mapper (toCreateOrderInput)
  ↓ transforma
Mock / Apollo Mutation
  ↓ resultado
Toast + navegación
```

## State Management

### Local State (useState)

Para estado de componente:

```typescript
const [isOpen, setIsOpen] = useState(false);
const [quantity, setQuantity] = useState(1);
```

### Global State (Zustand)

Tres stores globales con persistencia:

**auth.ts** — Sesión del usuario (user, token, role):
```typescript
const { user, token, setSession, clearSession } = useAuthStore();
```

**tcg-context.ts** — TCG derivado del dominio (read-only):
```typescript
const tcg = useTCGContext(); // POKEMON o MAGIC, según hostname
```

**cart.ts** — Carrito de compras:
```typescript
const { items, addItem, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore();
```

### Server State (Apollo Client)

Para datos del servidor (cuando se integre el backend):

```typescript
const { data, loading, error, refetch } = useQuery(DocumentNode, {
  variables: { tcgType: tcg, ...filters },
  fetchPolicy: 'cache-and-network',
});
```

## API Integration

### GraphQL Setup

Mismo setup que el backoffice:
- Apollo Client con auth link (Bearer token)
- Error link con logout automático en 401
- GraphQL Codegen para tipos automáticos

### Codegen

```bash
npm run codegen
```

Genera tipos desde el schema del backend en:
- `src/lib/api/schema-types.ts` — Tipos base
- `src/lib/api/generated/*.generated.ts` — DocumentNodes tipados

## Routing y Middleware

### Grupos de Rutas

| Grupo | Rutas | Acceso |
|-------|-------|--------|
| `(public)` | `/`, `/carta/[id]`, `/most-wanted` | Todos |
| `(authenticated)` | `/carrito`, `/checkout`, `/perfil`, `/pedidos`, `/wishlist` | Autenticados |
| `(not-authenticated)` | `/login`, `/registro`, `/recuperar-contrasena` | Solo no autenticados |

### Middleware (proxy.ts)

```typescript
// Rutas públicas: catálogo, most-wanted
// Rutas protegidas: carrito, checkout, perfil, pedidos, wishlist
// Si autenticado en /login → redirect a /
// Si no autenticado en ruta protegida → redirect a /login
// Si Kiosk en /perfil, /pedidos, /wishlist → redirect a /
```

## Seguridad

### Authentication
- Cookie-based auth (HTTP-only)
- Sesión compartida entre dominios Pokémon y Magic

### Authorization por Rol
- Público: solo catálogo y most-wanted
- Cliente: todo excepto compra remota
- VIP: todo, sin restricción de geofence
- Kiosk: catálogo + carrito + checkout, sin perfil/pedidos/wishlist

### Geofencing
- Validación de ubicación en checkout para no-VIP
- Google Maps JavaScript API
- Coordenadas y radio configurables via env

### Input Validation
- Validar en cliente (Zod)
- Validar en servidor (siempre)

## Diseño

- **Figma:** https://www.figma.com/design/OVJt5MDixgpKHhfO6Bk2bq/ks-UI-MVP?node-id=6403-11874
- Usar como base/inspiración para todas las vistas
- Cada tarea en ClickUp referencia el frame de Figma correspondiente

## Documentación Relacionada

- [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) — Plan de implementación por fases
- [CLICKUP_STRUCTURE.md](CLICKUP_STRUCTURE.md) — Estructura de tareas en ClickUp

### Del Backoffice (referencia)

- [CARPETA_DIGITAL_TEMPLATE.md](../CARPETA_DIGITAL_TEMPLATE.md) — Template y archivos a copiar
- [MOCK_TO_APOLLO_MIGRATION.md](../MOCK_TO_APOLLO_MIGRATION.md) — Guía de migración mock → Apollo
- [BACKEND_SPEC.md](../BACKEND_SPEC.md) — Especificación GraphQL del backend

## Referencias Externas

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react)
- [HeroUI Documentation](https://heroui.com)
- [Zustand Documentation](https://zustand.docs.pmnd.rs)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
