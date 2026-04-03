# Implementación de Query de Sellers

## 🎯 Objetivo
Implementar query de sellers desde el backend para usar en el selector de vendedor del formulario de compra.

## ✅ Cambios Implementados

### 1. **Query GraphQL Agregada**
**Archivo**: `src/lib/api/graphql/purchases.gql`

```graphql
query Sellers {
  sellers {
    data {
      guid
      name
      phone
      email
      notes
    }
  }
}
```

**Características**:
- Query simple sin paginación (obtiene todos los sellers)
- Ideal para usar en selectores/autocomplete
- Retorna datos básicos necesarios para el formulario

### 2. **Hook Actualizado**
**Archivo**: `src/features/purchases/ui/hooks/use-sellers.ts`

**Antes**:
```typescript
const [sellers, setSellers] = useState<ISeller[]>([]);
```

**Después**:
```typescript
const { data, loading, refetch } = useQuery(SellersDocument, {
  fetchPolicy: 'cache-and-network',
});

const sellers = useMemo(() => {
  if (!data?.sellers?.data) return [];
  return data.sellers.data.map((s) => ({
    guid: s.guid,
    name: s.name,
    phone: s.phone || '',
    email: s.email || undefined,
    notes: s.notes || undefined,
  })) as ISeller[];
}, [data]);
```

**Mejoras**:
- ✅ Fetch real desde backend
- ✅ Cache con Apollo Client
- ✅ Loading state disponible
- ✅ Refetch automático después de crear seller
- ✅ Filtrado local por búsqueda (client-side)

### 3. **Mutation Actualizada**
**Cambio en `createSeller`**:

**Antes**:
```typescript
onCompleted: (data) => {
  const newSeller: ISeller = { ... };
  setSellers((prev) => [newSeller, ...prev]);
  toast.success('Vendedor creado exitosamente');
}
```

**Después**:
```typescript
onCompleted: () => {
  toast.success('Vendedor creado exitosamente');
  refetch(); // Refetch automático de la lista
}
```

**Beneficios**:
- ✅ Más simple y limpio
- ✅ Garantiza sincronización con backend
- ✅ Evita duplicación de lógica

## 📋 Flujo de Uso

### Escenario 1: Seleccionar Vendedor Existente
1. Usuario abre formulario de nueva compra
2. Hook `useSellers()` ejecuta query al backend
3. Lista de sellers se muestra en selector/autocomplete
4. Usuario busca y selecciona vendedor existente
5. Continúa con el formulario de compra

### Escenario 2: Crear Vendedor Nuevo
1. Usuario no encuentra vendedor en la lista
2. Click en "Crear nuevo vendedor"
3. Modal de creación se abre (formulario de la imagen)
4. Usuario completa: Nombre, Teléfono, Email (opcional)
5. Click en "Confirmar vendedor"
6. Mutation `createSeller` se ejecuta
7. Toast de éxito se muestra
8. Query de sellers se refetch automáticamente
9. Nuevo vendedor aparece en la lista
10. Usuario puede seleccionarlo y continuar

## 🔄 Integración con Componentes

### Hook Interface
```typescript
export function useSellers(search?: string) {
  return {
    sellers: ISeller[];        // Lista filtrada de sellers
    loading: boolean;          // Estado de carga
    createSeller: (data: SellerFormData) => Promise<ISeller | undefined>;
    getSellerById: (id: string) => ISeller | undefined;
    creating: boolean;         // Estado de creación
  };
}
```

### Uso en Componente
```typescript
const { sellers, loading, createSeller, creating } = useSellers(searchTerm);

// En el selector
{loading ? (
  <Spinner />
) : (
  <Select>
    {sellers.map(seller => (
      <SelectItem key={seller.guid} value={seller.guid}>
        {seller.name} - {seller.phone}
      </SelectItem>
    ))}
  </Select>
)}

// En el modal de creación
const handleCreateSeller = async (formData: SellerFormData) => {
  const newSeller = await createSeller(formData);
  if (newSeller) {
    setSelectedSeller(newSeller);
    closeModal();
  }
};
```

## ✅ Verificación

- ✅ **Build**: Compilación exitosa sin errores
- ✅ **TypeScript**: Sin errores de tipo
- ✅ **GraphQL**: Query generada correctamente
- ✅ **Apollo Client**: Cache y refetch funcionando
- ✅ **UX**: Loading states y feedback al usuario

## 📝 Notas Técnicas

### Backend
- Query `sellers` retorna `PaginatedSellers` pero sin argumentos
- Actualmente devuelve todos los sellers (sin paginación)
- Filtrado se hace client-side en el hook

### Performance
- Para listas pequeñas (<100 sellers): OK
- Para listas grandes: Considerar implementar paginación en backend
- Cache de Apollo Client optimiza requests repetidos

### Búsqueda
- Implementada client-side con filtrado local
- Busca en: nombre, teléfono, email
- Case-insensitive

---

**Estado**: ✅ Implementación completa y funcional
**Fecha**: 2 de abril, 2026
