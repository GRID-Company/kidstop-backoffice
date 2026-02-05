# Architecture Documentation

Documentación completa de la arquitectura del GRID Frontend Template.

## Tabla de Contenidos

- [Visión General](#visión-general)
- [Stack Tecnológico](#stack-tecnológico)
- [Arquitectura Feature-First](#arquitectura-feature-first)
- [Estructura de Capas](#estructura-de-capas)
- [Patrones de Código](#patrones-de-código)
- [Convenciones](#convenciones)
- [Flujo de Datos](#flujo-de-datos)
- [State Management](#state-management)
- [API Integration](#api-integration)

## Visión General

Este proyecto implementa una arquitectura **Feature-First** con separación clara de responsabilidades en tres capas principales: **Adapters**, **Domain** y **UI**.

### Principios Fundamentales

1. **Feature-First**: Organización por características de negocio
2. **Separation of Concerns**: Cada capa tiene responsabilidades específicas
3. **Dependency Inversion**: Las capas superiores no dependen de las inferiores
4. **Single Responsibility**: Cada módulo tiene una única razón para cambiar
5. **DRY (Don't Repeat Yourself)**: Reutilización de código mediante shared components

## Stack Tecnológico

### Core

- **Next.js 16** - Framework React con App Router
- **React 19** - Biblioteca UI con Server Components
- **TypeScript 5** - Tipado estático
- **Tailwind CSS 4** - Utility-first CSS framework

### UI Components

- **HeroUI 2.8+** - Componentes UI base
- **Framer Motion** - Animaciones
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de schemas

### State Management

- **Zustand** - State management global
- **RxJS** - Programación reactiva

### API & Data

- **Apollo Client** - Cliente GraphQL
- **GraphQL Codegen** - Generación automática de tipos
- **Apollo Upload Client** - Upload de archivos

### Development

- **ESLint** - Linting
- **Prettier** - Formateo de código
- **TypeScript ESLint** - Reglas TypeScript

## Arquitectura Feature-First

### Estructura Base

```
src/
├── app/                    # Next.js App Router
│   ├── (authenticated)/   # Rutas protegidas
│   ├── (not-authenticated)/ # Rutas públicas
│   └── api/               # API routes
├── features/              # Features del negocio
│   ├── auth/
│   ├── inventory/
│   └── windows/
├── lib/                   # Utilidades y configuración
│   ├── api/              # GraphQL setup
│   ├── auth/             # Autenticación
│   ├── consts/           # Constantes globales
│   ├── store/            # Zustand stores
│   ├── types/            # Tipos globales
│   └── utils/            # Utilidades
└── shared/               # Componentes compartidos
    ├── base/             # Componentes base
    ├── blocks/           # Bloques compuestos
    ├── layouts/          # Layouts
    └── providers/        # Providers
```

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

Para estado compartido entre componentes:

```typescript
// lib/store/auth.ts
interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null, token: null }),
}));

// Uso
const { user, setUser } = useAuthStore();
```

### Server State (Apollo Client)

Para datos del servidor:

```typescript
const { data, loading, error, refetch } = useQuery(GET_INVENTORIES, {
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

## Deployment

Ver `docs/DEPLOYMENT.md` para guía completa de deployment.

## Referencias

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Apollo Client Documentation](https://www.apollographql.com/docs/react)
