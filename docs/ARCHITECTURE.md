# Architecture Documentation

Documentación de la arquitectura del **Kidstop Backoffice** — panel administrativo de Kidstop Singles Platform.

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

## Visión General

Panel administrativo web para operar compras de singles, administración de inventario y procesos de venta de cartas de **Pokémon TCG** y **Magic: The Gathering**, con roles **Administrador**, **Recepción** y **Comprador**.

El proyecto implementa una arquitectura **Feature-First** con separación clara de responsabilidades en tres capas principales: **Adapters**, **Domain** y **UI**.

### Principios Fundamentales

1. **Feature-First**: Organización por características de negocio
2. **Separation of Concerns**: Cada capa tiene responsabilidades específicas
3. **Dependency Inversion**: Las capas superiores no dependen de las inferiores
4. **Single Responsibility**: Cada módulo tiene una única razón para cambiar
5. **DRY (Don't Repeat Yourself)**: Reutilización de código mediante shared components

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
- **@iconify/react** — Iconos (Lucide, Material Design, etc.)

### State Management

- **Zustand** — State management global (auth, TCG context, privacy mode)

### API & Data

- **Apollo Client 4** — Cliente GraphQL
- **GraphQL Codegen** — Generación automática de tipos desde el schema del backend
- **Apollo Upload Client** — Upload de archivos

### Utilidades

- **dayjs** — Manipulación de fechas
- **jspdf** — Generación de PDF (picking list)
- **@dnd-kit** — Drag & drop (Most Wanted)
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
│   ├── (authenticated)/        # Rutas protegidas
│   │   ├── catalogo/
│   │   ├── compras/
│   │   ├── ventas/
│   │   ├── inventario-cartas/
│   │   ├── clientes/
│   │   ├── usuarios/
│   │   ├── most-wanted/
│   │   ├── configuracion/
│   │   └── deck-builder/
│   ├── (not-authenticated)/    # Rutas públicas
│   │   └── login/
│   └── api/                    # API routes (login/logout cookies)
├── features/                   # Features del negocio
│   ├── login/                  # Autenticación
│   ├── users/                  # Gestión de usuarios internos
│   ├── catalog/                # Catálogo de cartas
│   ├── purchases/              # Compras (buylist/negociación)
│   ├── inventory-cards/        # Inventario y movimientos
│   ├── sales/                  # Ventas/pedidos
│   ├── customers/              # Gestión de clientes
│   ├── most-wanted/            # Most Wanted (config + preview)
│   └── settings/               # Configuración global
├── lib/                        # Utilidades y configuración
│   ├── api/                    # Apollo Client + GraphQL codegen
│   │   ├── graphql/            # Archivos .gql (queries/mutations)
│   │   ├── generated/          # Tipos auto-generados por codegen
│   │   └── schema-types.ts     # Tipos del schema GraphQL
│   ├── auth/                   # Hooks de autenticación
│   ├── consts/                 # Constantes globales
│   ├── hooks/                  # Hooks globales
│   ├── store/                  # Zustand stores
│   ├── types/                  # Tipos globales compartidos
│   └── utils/                  # Utilidades
└── shared/                     # Componentes compartidos
    ├── base/                   # Componentes base (buttons, search, card, skeleton)
    ├── blocks/                 # Bloques compuestos (EntitiesPage, DataTable)
    ├── layouts/                # Layouts (sidebar, authenticated layout)
    └── providers/              # Providers (Apollo, HeroUI)
```

## Módulos del Sistema

### login
Autenticación con email/contraseña, manejo de sesión via cookies y recuperación de contraseña.

### users
CRUD de usuarios internos del backoffice. Roles: Administrador, Recepción, Comprador. Activar/desactivar usuarios.

### catalog
Búsqueda y consulta de cartas singles con contexto TCG (Pokémon/Magic). Catálogo interno con respaldo de proveedores externos (Price Charting, Card Kingdom). Configuración de precio de venta al público. Incluye buscador avanzado (deck builder) para importar listas de cartas.

### purchases
Flujo de compra de singles: Draft → Cotizado → Esperando precio → Finalizado / Rechazado. Incluye búsqueda con métricas operativas, control de presupuesto por comprador, envío de cotización por WhatsApp, modo privacidad y registro de pago.

### inventory-cards
Control de stock por Carta + Variante + Condición. Registro de movimientos (entrada por compra, salida por venta, ajuste manual). Historial con filtros. Métricas: última venta, tiempo promedio en inventario.

### sales
Gestión de pedidos originados en la Carpeta Digital. Estados: Nuevo → En surtido → Listo para recolección → Completado / Cancelado. Generación de PDF (picking list), notificación por email, código de venta para Shopify.

### customers
Gestión de clientes con clasificación VIP, bloqueos por pedidos no concretados y validación de ubicación. Historial de pedidos por cliente.

### most-wanted
Configuración de páginas públicas "Most Wanted" por TCG. Agregar/quitar/ordenar cartas con drag & drop. Preview en tiempo real.

### settings
Configuración global: geofence, umbrales de bloqueo, presupuestos por comprador, límites de inventario, horarios de operación.

### Estado Actual de Integración

Todos los features de Kidstop operan actualmente con **datos mock** (`*.mock.ts`). El feature `windows` (heredado del template base) es el único con integración Apollo real y sirve como referencia del patrón. Ver `docs/MOCK_TO_APOLLO_MIGRATION.md` para la guía de migración.

### Feature Structure

Cada feature sigue esta estructura:

```
features/{feature-name}/
├── adapters/              # Capa de adaptación
│   ├── api/              # GraphQL queries/mutations
│   ├── forms/            # Schemas y hooks de formularios
│   └── mappers/          # Transformación de datos
├── domain/               # Capa de dominio
│   ├── types.ts          # Tipos TypeScript
│   ├── constants.ts      # Constantes
│   └── {feature}.domain.ts # Lógica de negocio
└── ui/                   # Capa de presentación
    ├── components/       # Componentes React
    ├── views/            # Páginas/vistas principales
    └── hooks/            # Custom hooks
```

## Estructura de Capas

### 1. Adapters Layer (Adaptadores)

**Responsabilidad**: Adaptar datos externos al formato interno de la aplicación.

#### api/

Contiene queries y mutations de GraphQL.

```typescript
// features/inventory/adapters/api/inventory.gql
query GetInventories($args: FindInventoriesArgs!) {
  inventories(args: $args) {
    items {
      id
      name
      type
    }
    total
  }
}
```

#### forms/

Schemas de validación y hooks de formularios.

```typescript
// features/inventory/adapters/forms/inventory-form.schema.ts
import { z } from 'zod';

export const inventoryFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['profile', 'glass', 'chape']),
  quantity: z.number().min(0),
});

export type InventoryFormData = z.infer<typeof inventoryFormSchema>;
```

```typescript
// features/inventory/adapters/forms/use-inventory-form.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export const useInventoryForm = () => {
  return useForm<InventoryFormData>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: {
      name: '',
      type: 'profile',
      quantity: 0,
    },
  });
};
```

#### mappers/

Transformación de datos entre API y UI.

```typescript
// features/inventory/adapters/mappers/inventory.mapper.ts
export const mapInventoryToForm = (inventory: Inventory): InventoryFormData => {
  return {
    name: inventory.name,
    type: inventory.type,
    quantity: inventory.quantity,
  };
};

export const mapFormToInventory = (form: InventoryFormData): CreateInventoryInput => {
  return {
    name: form.name,
    type: form.type,
    quantity: form.quantity,
  };
};
```

### 2. Domain Layer (Dominio)

**Responsabilidad**: Lógica de negocio, tipos y constantes.

#### types.ts

Tipos TypeScript específicos del dominio.

```typescript
// features/inventory/domain/types.ts
export interface InventoryFilters {
  type?: InventoryType;
  search?: string;
  branchOfficeGuid?: string;
}

export type InventoryType = 'profile' | 'glass' | 'chape' | 'various';
```

#### constants.ts

Constantes del dominio.

```typescript
// features/inventory/domain/constants.ts
export const INVENTORY_TYPES = {
  PROFILE: 'profile',
  GLASS: 'glass',
  CHAPE: 'chape',
  VARIOUS: 'various',
} as const;

export const DEFAULT_PAGE_SIZE = 10;
```

#### {feature}.domain.ts

Lógica de negocio y funciones de utilidad.

```typescript
// features/inventory/domain/inventory.domain.ts
export const getInventoryVars = (
  args: IPaginatedApiArgs,
  filters: InventoryFilters
): GetInventoriesQueryVariables => {
  return {
    findInventoriesArgs: {
      ...args,
      filters: {
        ...filters,
        branchOfficeGuid: filters.branchOfficeGuid || '',
      },
    },
  };
};

export const calculateInventoryValue = (
  quantity: number,
  unitPrice: number
): number => {
  return quantity * unitPrice;
};
```

### 3. UI Layer (Presentación)

**Responsabilidad**: Componentes React y lógica de presentación.

#### components/

Componentes reutilizables de la feature.

```typescript
// features/inventory/ui/components/inventory-card.tsx
interface InventoryCardProps {
  inventory: Inventory;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const InventoryCard = ({ inventory, onEdit, onDelete }: InventoryCardProps) => {
  return (
    <Card>
      <CardHeader>{inventory.name}</CardHeader>
      <CardBody>
        <p>Type: {inventory.type}</p>
        <p>Quantity: {inventory.quantity}</p>
      </CardBody>
      <CardFooter>
        <Button onClick={() => onEdit(inventory.id)}>Edit</Button>
        <Button onClick={() => onDelete(inventory.id)}>Delete</Button>
      </CardFooter>
    </Card>
  );
};
```

#### views/

Páginas o vistas principales de la feature.

```typescript
// features/inventory/ui/views/inventories.tsx
export const InventoriesView = () => {
  const { data, loading } = useInventories();
  
  return (
    <EntitiesPage>
      <EntitiesPage.Title>Inventories</EntitiesPage.Title>
      <EntitiesPage.CardContainer>
        {loading ? (
          <GridSkeleton />
        ) : (
          data?.map(inventory => (
            <InventoryCard key={inventory.id} inventory={inventory} />
          ))
        )}
      </EntitiesPage.CardContainer>
    </EntitiesPage>
  );
};
```

#### hooks/

Custom hooks específicos de la feature.

```typescript
// features/inventory/ui/hooks/use-inventories.ts
export const useInventories = () => {
  const [filters, setFilters] = useState<InventoryFilters>({});
  const { data, loading, error } = useQuery(GET_INVENTORIES, {
    variables: getInventoryVars(paginationArgs, filters),
  });
  
  return {
    inventories: data?.inventories.items || [],
    loading,
    error,
    filters,
    setFilters,
  };
};
```

## Patrones de Código

### 1. Compound Components Pattern

Usado en componentes complejos como `EntitiesPage`:

```typescript
// shared/blocks/entities-page/index.tsx
export const EntitiesPage = ({ children }: PropsWithChildren) => {
  return <Root>{children}</Root>;
};

EntitiesPage.Title = Title;
EntitiesPage.CardContainer = CardContainer;

// Uso
<EntitiesPage>
  <EntitiesPage.Title>My Page</EntitiesPage.Title>
  <EntitiesPage.CardContainer>
    {/* content */}
  </EntitiesPage.CardContainer>
</EntitiesPage>
```

### 2. Custom Hooks Pattern

Encapsular lógica reutilizable:

```typescript
export const usePaginatedDataTable = <T,>(config: Config) => {
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>();
  
  // Lógica de paginación, ordenamiento, filtros
  
  return {
    data,
    loading,
    page,
    setPage,
    sortDescriptor,
    onSortChange,
  };
};
```

### 3. Render Props Pattern

Para componentes con lógica compartida pero UI diferente:

```typescript
interface DataTableProps<T> {
  data: T[];
  renderRow: (item: T) => ReactNode;
}

export const DataTable = <T,>({ data, renderRow }: DataTableProps<T>) => {
  return (
    <Table>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index}>{renderRow(item)}</TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
```

### 4. Provider Pattern

Para compartir estado y lógica:

```typescript
// shared/providers/providers.tsx
export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <HeroUIProvider>
      <ApolloProvider client={apolloClient}>
        {children}
      </ApolloProvider>
    </HeroUIProvider>
  );
};
```

## Convenciones

### Naming Conventions

#### Archivos

- **Componentes**: `kebab-case.tsx` → `inventory-card.tsx`
- **Hooks**: `use-{name}.ts` → `use-inventories.ts`
- **Types**: `{name}.types.ts` → `inventory.types.ts`
- **Constants**: `{name}.constants.ts` → `inventory.constants.ts`
- **Mappers**: `{name}.mapper.ts` → `inventory.mapper.ts`
- **Schemas**: `{name}.schema.ts` → `inventory-form.schema.ts`

#### Código

- **Componentes**: `PascalCase` → `InventoryCard`
- **Funciones**: `camelCase` → `getInventories`
- **Variables**: `camelCase` → `inventoryList`
- **Constantes**: `UPPER_SNAKE_CASE` → `DEFAULT_PAGE_SIZE`
- **Tipos**: `PascalCase` con prefijo `I` → `IInventory`
- **Enums**: `PascalCase` → `InventoryType`

### File Organization

```typescript
// 1. Imports - externos primero, luego internos
import { useState } from 'react';
import { useQuery } from '@apollo/client';

import { InventoryCard } from './inventory-card';
import { useInventories } from '../hooks/use-inventories';

// 2. Types e interfaces
interface InventoriesViewProps {
  filters?: InventoryFilters;
}

// 3. Constantes
const DEFAULT_FILTERS = {};

// 4. Componente principal
export const InventoriesView = ({ filters = DEFAULT_FILTERS }: InventoriesViewProps) => {
  // Hooks
  const { inventories, loading } = useInventories();
  
  // Handlers
  const handleEdit = (id: string) => {
    // ...
  };
  
  // Render
  return (
    // JSX
  );
};
```

### Component Structure

```typescript
// 1. Props interface
interface ComponentProps {
  required: string;
  optional?: number;
  onAction: () => void;
}

// 2. Component
export const Component = ({ required, optional = 0, onAction }: ComponentProps) => {
  // 3. Hooks (en orden)
  const [state, setState] = useState();
  const query = useQuery();
  const custom = useCustomHook();
  
  // 4. Derived state
  const computed = useMemo(() => {}, []);
  
  // 5. Effects
  useEffect(() => {}, []);
  
  // 6. Handlers
  const handleClick = () => {};
  
  // 7. Render helpers
  const renderItem = () => {};
  
  // 8. Early returns
  if (loading) return <Skeleton />;
  if (error) return <Error />;
  
  // 9. Main render
  return <div>{/* JSX */}</div>;
};
```

## Flujo de Datos

### Data Flow Diagram

```
User Action
    ↓
UI Component (View)
    ↓
Custom Hook
    ↓
GraphQL Query/Mutation (Adapter)
    ↓
Apollo Client
    ↓
API Server
    ↓
Response
    ↓
Mapper (Adapter)
    ↓
Domain Logic
    ↓
UI Component (View)
    ↓
User sees result
```

### Example Flow

```typescript
// 1. User clicks button in UI
<Button onClick={handleCreate}>Create</Button>

// 2. Handler calls custom hook
const handleCreate = () => {
  createInventory(formData);
};

// 3. Hook uses GraphQL mutation
const createInventory = (data: InventoryFormData) => {
  const input = mapFormToInventory(data); // Mapper
  return createMutation({ variables: { input } });
};

// 4. Mutation returns data
const [createMutation] = useMutation(CREATE_INVENTORY, {
  onCompleted: (data) => {
    // 5. Update UI
    refetch();
    toast.success('Created!');
  },
});
```

## State Management

### Local State (useState)

Para estado de componente:

```typescript
const [isOpen, setIsOpen] = useState(false);
const [selectedId, setSelectedId] = useState<string | null>(null);
```

### Global State (Zustand)

Tres stores globales con persistencia:

**auth.ts** — Sesión del usuario (user, token, role):
```typescript
const { user, token, setSession, clearSession } = useAuthStore();
```

**selected-tcg.ts** — Contexto de juego activo (Pokémon/Magic):
```typescript
const { selectedTCG, setTCG } = useSelectedTCGStore();
```

**privacy-mode.ts** — Modo privacidad en compras:
```typescript
const { isPrivacyMode, togglePrivacyMode } = usePrivacyModeStore();
```

### Server State (Apollo Client)

Para datos del servidor (actualmente en migración de mocks a Apollo):

```typescript
const { data, loading, error, refetch } = useQuery(DocumentNode, {
  variables: { args },
  fetchPolicy: 'cache-and-network',
});
```

## API Integration

### GraphQL Setup

```typescript
// lib/api/apollo-client.ts
const apolloClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  cache: new InMemoryCache(),
  link: createUploadLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  }),
});
```

### Code Generation

```bash
# Generar tipos desde schema GraphQL
npm run codegen
```

Genera:
- `lib/api/schema-types.ts` - Tipos del schema
- `lib/api/generated/*.generated.ts` - Tipos de operaciones

### Query Example

```typescript
// features/inventory/adapters/api/inventory.gql
query GetInventories($args: FindInventoriesArgs!) {
  inventories(args: $args) {
    items {
      id
      name
      type
      quantity
    }
    total
  }
}
```

```typescript
// features/inventory/ui/hooks/use-inventories.ts
import { useGetInventoriesQuery } from '@/lib/api/generated/inventory.generated';

export const useInventories = () => {
  const { data, loading } = useGetInventoriesQuery({
    variables: { args: getInventoryVars() },
  });
  
  return {
    inventories: data?.inventories.items || [],
    loading,
  };
};
```

## Best Practices

### 1. Keep Components Small

Máximo 200-300 líneas por componente. Si es más grande, dividir en sub-componentes.

### 2. Use TypeScript Strictly

```typescript
// ✅ BIEN
interface Props {
  name: string;
  age: number;
}

// ❌ MAL
interface Props {
  name: any;
  age: any;
}
```

### 3. Avoid Prop Drilling

Usar context o zustand para estado compartido profundo.

### 4. Memoize Expensive Calculations

```typescript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

### 5. Use Error Boundaries

Capturar errores en componentes:

```typescript
<ErrorBoundary fallback={<ErrorView />}>
  <MyComponent />
</ErrorBoundary>
```

### 6. Lazy Load Heavy Components

```typescript
const HeavyComponent = lazy(() => import('./heavy-component'));

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

## Testing Strategy

### Unit Tests

- Funciones de utilidad
- Mappers
- Domain logic

### Integration Tests

- Custom hooks
- API integration

### E2E Tests

- User flows
- Critical paths

## Performance Optimization

### 1. Code Splitting

Next.js automático por rutas + lazy loading manual.

### 2. Image Optimization

Usar `next/image` para optimización automática.

### 3. Memoization

`useMemo`, `useCallback`, `React.memo` para evitar re-renders.

### 4. Virtual Lists

Para listas largas, usar virtualización.

## Security

### 1. Environment Variables

- Nunca exponer secrets en cliente
- Usar `NEXT_PUBLIC_` solo para valores públicos

### 2. Authentication

- Cookie-based auth
- HTTP-only cookies
- CSRF protection

### 3. Input Validation

- Validar en cliente (Zod)
- Validar en servidor (siempre)

## Documentación Relacionada

- [PROJECT_CONTEXT.md](PROJECT_CONTEXT.md) — Contexto del proyecto, glosario, roles y módulos
- [BACKEND_SPEC.md](BACKEND_SPEC.md) — Especificación GraphQL del backend (NestJS)
- [MOCK_TO_APOLLO_MIGRATION.md](MOCK_TO_APOLLO_MIGRATION.md) — Guía de migración mock → Apollo
- [CARPETA_DIGITAL_TEMPLATE.md](CARPETA_DIGITAL_TEMPLATE.md) — Template para el repo de la Carpeta Digital
- [KSP - Alcance y requerimientos del MVP.md](KSP%20-%20Alcance%20y%20requerimientos%20del%20MVP.md) — Documento de alcance completo

## Referencias Externas

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react)
- [HeroUI Documentation](https://heroui.com)
- [Zustand Documentation](https://zustand.docs.pmnd.rs)
