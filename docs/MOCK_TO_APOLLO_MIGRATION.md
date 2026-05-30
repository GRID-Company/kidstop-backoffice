# Guía de Migración: Mock → Apollo Client

Guía paso a paso para migrar los features del backoffice de datos mock a integración real con Apollo Client y GraphQL.

## Patrón de Referencia

El feature `windows` (heredado del template base) es el único que implementa el flujo completo con Apollo. Úsalo como referencia mientras no se elimine del proyecto.

### Flujo completo (de `windows`)

```
1. windows.gql                     → Define query + mutation en GraphQL
         ↓ npm run codegen
2. windows.generated.ts            → Auto-genera DocumentNodes + tipos TypeScript
         ↓
3. new-window.tsx                  → useMutation(CreateWindowDocument)
         ↓
4. useWindowForm()                 → useForm<WindowForm> con Zod schema
         ↓
5. toWindowPayload(data)           → Mapper: form data → mutation variables
         ↓
6. mutate({ variables: payload })  → Apollo ejecuta la mutation
         ↓
7. refetchQueries: [WindowsDocument] → Refresca el listado automáticamente
```

### Archivos de referencia clave

| Archivo | Propósito |
|---------|-----------|
| `src/lib/api/graphql/windows.gql` | Query + Mutation GraphQL |
| `src/lib/api/generated/windows.generated.ts` | Tipos y DocumentNodes generados |
| `src/features/windows/adapters/forms/window.form.schema.ts` | Zod schema de validación |
| `src/features/windows/adapters/forms/use-window-form.ts` | Hook de formulario con zodResolver |
| `src/features/windows/adapters/mappers/window-form.mapper.ts` | Mapper: form → mutation input |
| `src/features/windows/ui/views/windows.tsx` | Vista con `useQuery` real |
| `src/features/windows/ui/views/new-window.tsx` | Vista con `useMutation` real |

## Paso a Paso: Migrar un Feature

### Paso 1 — Crear el archivo `.gql`

Crear `src/lib/api/graphql/{feature}.gql` con las queries y mutations necesarias.

```graphql
# src/lib/api/graphql/users.gql

query Users($args: FindUsersArgs!) {
  users(args: $args) {
    items {
      id
      name
      email
      role
      activated
      createdAt
    }
    total
  }
}

mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    email
    role
    activated
  }
}

mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
  updateUser(id: $id, input: $input) {
    id
    name
    email
    role
    activated
  }
}
```

Las queries y mutations deben coincidir con el schema del backend definido en `docs/BACKEND_SPEC.md`.

### Paso 2 — Ejecutar codegen

```bash
npm run codegen
```

Esto genera automáticamente:
- Tipos de las operaciones en `src/lib/api/generated/{feature}.generated.ts`
- `DocumentNode` tipados (`UsersDocument`, `CreateUserDocument`, etc.)

### Paso 3 — Adaptar el hook principal

Reemplazar el import de mock por `useQuery` con el `DocumentNode` generado.

**Antes (mock):**
```typescript
import { MOCK_USERS } from '../../adapters/api/users.mock';

export function useUsers() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [loading] = useState(false);
  // filtrado local...
}
```

**Después (Apollo):**
```typescript
import { useQuery } from '@apollo/client/react';
import { UsersDocument } from '@/lib/api/generated/users.generated';

export function useUsers(search?: string, filters?: UserFilters) {
  const { data, loading, error, refetch } = useQuery(UsersDocument, {
    variables: {
      args: {
        search,
        role: filters?.role,
        activated: filters?.activated,
        limit: DEFAULT_PAGE_SIZE,
        skip: (page - 1) * DEFAULT_PAGE_SIZE,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  return {
    users: data?.users.items ?? [],
    totalCount: data?.users.total ?? 0,
    loading,
    error,
    refetch,
  };
}
```

Puntos clave:
- La paginación y filtrado ahora se delegan al backend via `variables`
- `fetchPolicy: 'cache-and-network'` para UX fluida
- El `refetch` se expone para refrescar después de mutations

### Paso 4 — Adaptar mutations (crear/editar/eliminar)

**Antes (mock):**
```typescript
const createUser = useCallback((user) => {
  const newUser = { ...user, guid: crypto.randomUUID() };
  setUsers((prev) => [newUser, ...prev]);
}, []);
```

**Después (Apollo):**
```typescript
import { useMutation } from '@apollo/client/react';
import {
  CreateUserDocument,
  UsersDocument,
} from '@/lib/api/generated/users.generated';

const [createMutation, { loading: creating }] = useMutation(
  CreateUserDocument,
  { refetchQueries: [UsersDocument] }
);

const createUser = async (data: UserFormData) => {
  try {
    const input = toCreateUserInput(data);
    await createMutation({ variables: { input } });
    toast.success('Usuario creado');
  } catch {
    toast.error('Error al crear usuario');
  }
};
```

### Paso 5 — Crear/adaptar mappers

Si el mapper ya existe, adaptarlo para que transforme al formato exacto del mutation input.

```typescript
// adapters/mappers/user.mapper.ts

export const toCreateUserInput = (form: UserFormData): CreateUserInput => ({
  name: form.name,
  email: form.emailAddress,
  role: form.role,
  activated: form.activated,
});

export const toUpdateUserInput = (form: UserFormData): UpdateUserInput => ({
  name: form.name,
  email: form.emailAddress,
  role: form.role,
  activated: form.activated,
});
```

Los tipos `CreateUserInput` y `UpdateUserInput` vienen de `src/lib/api/schema-types.ts` (generados por codegen).

### Paso 6 — Eliminar archivos mock

Una vez que el feature funciona con Apollo:

1. Eliminar `src/features/{feature}/adapters/api/{feature}.mock.ts`
2. Verificar que ningún otro archivo importe del mock
3. Commit con mensaje descriptivo

## Checklist por Feature

Usar esta checklist al migrar cada módulo:

```
[ ] 1. Crear src/lib/api/graphql/{feature}.gql
[ ] 2. Ejecutar npm run codegen — verificar que genera .generated.ts
[ ] 3. Adaptar hook de listado: useQuery con DocumentNode generado
[ ] 4. Adaptar mutations: useMutation con refetchQueries
[ ] 5. Adaptar/crear mappers: form → mutation input
[ ] 6. Verificar error handling: try/catch + toast
[ ] 7. Verificar loading states en la UI
[ ] 8. Probar flujo completo (listar, crear, editar, filtrar)
[ ] 9. Eliminar archivo .mock.ts
[ ] 10. Commit
```

## Orden de Migración Sugerido

Priorizado por complejidad (de menor a mayor) y dependencias entre módulos:

| # | Feature | Complejidad | Dependencias |
|---|---------|-------------|--------------|
| 1 | `users` | Baja | Ninguna — CRUD simple |
| 2 | `settings` | Baja | Ninguna — configuración global |
| 3 | `customers` | Media | Ninguna directa |
| 4 | `catalog` | Media | Proveedores externos (Price Charting, Card Kingdom) |
| 5 | `most-wanted` | Media | Depende de `catalog` |
| 6 | `inventory-cards` | Media-Alta | Depende de `catalog` |
| 7 | `purchases` | Alta | Depende de `catalog`, `inventory-cards`, `customers` |
| 8 | `sales` | Alta | Depende de `inventory-cards`, `customers` |

Comenzar por `users` permite validar el flujo completo (query + mutation + codegen) con el feature más simple antes de abordar los módulos con más reglas de negocio.

## Consideraciones

### fetchPolicy

- `cache-and-network`: Para listados que necesitan datos frescos pero UX fluida
- `network-only`: Para datos que cambian frecuentemente (inventario, ventas)
- `cache-first`: Para datos que cambian poco (catálogo, configuración)

### Error Handling

Mantener consistencia con el patrón de `windows`:

```typescript
try {
  await mutate({ variables: payload });
  toast.success('Operación exitosa');
  router.push('/listado');
} catch {
  toast.error('Error en la operación');
}
```

El `apollo-provider.tsx` ya maneja errores de autenticación globalmente (401/UNAUTHENTICATED → logout automático).

### Paginación

Los features actuales implementan paginación local sobre mocks. Al migrar, la paginación se delega al backend:

```typescript
variables: {
  args: {
    limit: pageSize,
    skip: (page - 1) * pageSize,
    sort: { column: sortKey, order: sortDirection },
    filters: { ... },
  },
}
```

### Tipos

Después de correr `codegen`, los tipos del schema están en `src/lib/api/schema-types.ts`. Los tipos locales en `domain/types.ts` de cada feature deben mantenerse consistentes con estos tipos generados.

## Limpieza Post-Migración

Cuando todos los features estén migrados a Apollo:

1. Eliminar todos los archivos `*.mock.ts` restantes
2. Eliminar `src/features/windows/` (feature del template base)
3. Eliminar `src/lib/api/graphql/windows.gql`, `branches.gql`, `files.gql`, `inventory.gql`, `selectors.gql` (del template base)
4. Eliminar `src/lib/api/generated/windows.generated.ts`, `branches.generated.ts`, etc.
5. Ejecutar `npm run codegen` para regenerar solo los archivos de Kidstop
