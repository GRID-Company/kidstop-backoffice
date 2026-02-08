# Guía para Actualización Manual de Tareas

Como los scripts automáticos tienen problemas con la API de ClickUp, aquí está la guía para actualizar manualmente las tareas con descripciones y tags.

## Estado Actual

✅ **Tareas creadas:** 55 tareas totales
- Foundation: 14 tareas (con descripciones y tags)
- Catalog: 7 tareas (necesitan descripción y tags)
- Purchases: 13 tareas (necesitan descripción y tags)
- Sales: 13 tareas (necesitan descripción y tags)
- Extras: 8 tareas (necesitan descripción y tags)

## Proceso Manual Sugerido

### 1. **Acceder a ClickUp**
🔗 https://app.clickup.com/8591008/v/f/90176401492

### 2. **Actualizar por Fase**

#### **Fase: Catalog (7 tareas)**
Para cada tarea, agregar:

**Tags:**
- `atomo` para Domain y Forms
- `molecula` para Componentes UI simples
- `organismo` para Componentes complejos y Vistas
- `molecula` para Routing

**Descripciones detalladas:**

1. **Catalog - Domain Types y Constants**
```
Crear domain types para catálogo de cartas

## Alcance
- Crear features/catalog/domain/types.ts
- Definir Card, CardVariant, CardFilters, TCGType
- Crear constants.ts (TCG_TYPES, CARD_CONDITIONS)
- Crear catalog.domain.ts (getCardsVars, calculatePriceMargin)

## Estimación: 3 SP
```

2. **Catalog - Forms y Schemas**
```
Crear forms y schemas para catálogo

## Alcance
- Crear card-price.schema.ts
- Crear use-card-price-form.ts hook
- Mapper card.mapper.ts

## Estimación: 3 SP
```

3. **Catalog - Componente Búsqueda**
```
Crear componente de búsqueda de cartas

## Alcance
- Crear card-search.tsx con multibuscador
- Búsqueda por nombre, set, identificador
- Filtros por TCG, condición, variante
- Responsive y accesible

## Estimación: 5 SP
```

4. **Catalog - Grid de Cartas**
```
Crear grid para mostrar cartas

## Alcance
- Crear card-grid.tsx
- Cards con imagen, nombre, set, precio
- Paginación infinita o paginada
- Filtros activos visibles

## Estimación: 5 SP
```

5. **Catalog - Modal Detalle**
```
Crear modal de detalle de carta

## Alcance
- Crear card-detail-modal.tsx
- Información completa de carta
- Selector de variantes
- Editor de precio público
- Botón de sincronización con proveedor

## Estimación: 8 SP
```

6. **Catalog - Vista Principal**
```
Crear vista principal del catálogo

## Alcance
- Crear features/catalog/ui/views/catalog.tsx
- Integrar búsqueda, filtros, grid
- Manejo de estado de filtros
- Responsive

## Estimación: 8 SP
```

7. **Catalog - Ruta en App Router**
```
Configurar ruta para catálogo

## Alcance
- Crear app/(authenticated)/catalogo/page.tsx
- Importar vista de catálogo
- Validar TCG seleccionado

## Estimación: 1 SP
```

#### **Fase: Purchases (13 tareas)**
**Tags:** `atomo`, `molecula`, `organismo` según complejidad

**Descripciones:** Similar estructura para las 13 tareas de Purchases

#### **Fase: Sales (13 tareas)**
**Tags:** `atomo`, `molecula`, `organismo` según complejidad

**Descripciones:** Similar estructura para las 13 tareas de Sales

#### **Fase: Extras (8 tareas)**
**Tags:** `atomo`, `molecula`, `organismo` según complejidad

**Descripciones:** Similar estructura para las 8 tareas de Extras

### 3. **Custom Fields**

Para cada tarea, configurar:
- **Feature:** Nombre del módulo (Catalog, Purchases, Sales, Most Wanted)
- **Layer:** Domain, UI, Adapters, Routing según corresponda
- **Estimated Time:** El valor en SP de cada tarea

### 4. **Prioridades**

Establecer prioridades visuales:
- **High:** Tasks críticas y de bloqueo
- **Medium:** Tasks importantes pero no bloqueantes
- **Low:** Tasks opcionales o de mejora

## Alternativa: Bulk Update

Si prefieres, podemos:
1. Exportar las tareas a CSV
2. Actualizar en lote
3. Importar de nuevo

## Resumen de Tags por Categoría

### **Por Complejidad (Atomic Design):**
- `atomo` - Componentes base pequeños (Domain, Forms simples, Badges)
- `molecula` - Componentes compuestos (Componentes UI, Modales simples, Routing)
- `organismo` - Componentes complejos (Vistas, Componentes con múltiples funcionalidades)

### **Por Capa:**
- `domain` - Lógica de negocio y tipos
- `ui` - Componentes de interfaz
- `forms` - Formularios y validación
- `routing` - Configuración de rutas

### **Por Módulo:**
- `catalog` - Catálogo de cartas
- `purchases` - Compras y negociación
- `sales` - Ventas y pedidos
- `most-wanted` - Configuración Most Wanted

## Tiempo Estimado

- **Actualización manual:** ~2-3 horas
- **Con bulk update:** ~30 minutos

## Recomendación

Dado que los scripts automáticos tienen problemas con la API de ClickUp, recomiendo hacer la actualización manual. Esto permite:
- Verificar cada tarea individualmente
- Ajustar descripciones según necesidad
- Configurar custom fields correctamente
- Establecer dependencias visuales

¿Prefieres que prepare un archivo CSV para bulk update o lo hacemos manualmente?
