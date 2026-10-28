# Card Display Spec — Contrato canónico de presentación de cartas

Especificación compartida entre `kidstop-backoffice` (este repo) y `kidstop-digital-binder` (`docs/CARD-DISPLAY-SPEC.md`). **Ambas copias deben ser idénticas** — si cambias una, sincroniza la otra.

**Propósito (KSP-376)**: que una misma carta se vea como la misma carta en toda la plataforma — mismo número, mismos chips, mismo fallback — sin compartir código entre repos. Se comparte el contrato visual, no la implementación.

**Implementaciones**:

| Repo            | Componente                                                   | Ubicación                       |
| --------------- | ------------------------------------------------------------ | ------------------------------- |
| Carpeta digital | `CardDisplay` (compound, variantes `catalog\|list\|compact`) | `src/shared/base/card-display/` |
| Backoffice      | `CardShell` (compound)                                       | `src/shared/blocks/card-shell/` |

---

## 1. Reglas de datos

### 1.1 Identidad mínima de una carta

Toda superficie que muestre una carta debe poder responder: **¿qué carta es?**

| Campo                     | Requerido | Notas                                               |
| ------------------------- | --------- | --------------------------------------------------- |
| `name`                    | ✅        | Nombre de la impresión                              |
| `number`                  | ✅        | Formato `#N` — ver §1.2                             |
| `setName` / `edition`     | ✅        | Nombre de la expansión                              |
| `setCode`                 | si aporta | Como `Ident` (pokémon `SSP`, magic 3-letras)        |
| `imageUri` + fallback TCG | ✅        | `getTCGImageFallback(tcgType)` — ver §1.5           |
| `tcgType`                 | ✅        | `'POKEMON' \| 'MAGIC'` — gobierna fallback y accent |

### 1.2 Número de carta

- **Siempre** se imprime como `#N` (prefijo `#`, sin espacio): `#025`, `#92`, `#4`.
- **Nunca** pelado (`025`), ni con etiqueta "Número:", ni separado por em-dash.
- **Dato sucio en backend**: `cardNumber` pokémon puede venir como `#141` o `141`; `collectorNumber` magic viene pelado. **Nunca** concatenar `#` + valor crudo — siempre pasar por `formatCardNumber()` (`src/lib/utils/card-display.utils.ts` en binder, `src/lib/utils/format-card-number.ts` en backoffice), que normaliza ambos casos y devuelve `''` para vacío.
- Componente dedicado: `CardDisplay.Number` (binder) / `CardShell.Number` (backoffice) — null-safe (`null`/`''` no renderiza) y ya aplica `formatCardNumber` internamente.
- En títulos va adyacente al nombre: `Pikachu #025`.
- En contextos densos puede ser chip o pill con el mismo formato `#N`.

### 1.3 Set / expansión

- En meta/subtítulo: `setName` completo.
- `setCode` se muestra como `Ident` (esquina superior derecha) cuando aporta valor de identificación — típicamente pokémon.
- Si `setCode` es `UNKNOWN` (constante `UNKNOWN_SET_CODE`), no se muestra.
- Separador en líneas de meta: `•` (bullet). Em-dash `—` queda prohibido como separador de identidad.

### 1.4 Disponibilidad

- **Un solo vocabulario**: `Disponible` | `Agotada` (femenino — refiere a "carta").
- Prohibido: `Agotado`, `En stock`, `N disp` como etiqueta de estado.
- Representación canónica: dot + label (`CardDisplay.Availability` / `CardShell.Availability`) — punto `bg-success`/`bg-warning` + texto.
- Un chip/contador de cantidad (`3 disponibles`, `Stock total: N`) es **dato**, no etiqueta de estado — convive con el dot pero no lo reemplaza.

### 1.5 Imagen

- `object-contain` siempre (prohibido `object-cover` — recorta el arte).
- `aspect-[5/7]` en todas las variantes de grid/lista.
- Fallback por TCG vía `getTCGImageFallback`: `pokemon-card-placeholder.png` | `magic-card-placeholder.png`.
- El placeholder también se usa cuando `src` es `null`/vacío, no solo en error de carga (`showPlaceholder = !src || hasError`).
- Carta agotada: imagen con `opacity-50`.

### 1.6 Preview (zoom de imagen)

| Repo       | Comportamiento                                                                         |
| ---------- | -------------------------------------------------------------------------------------- |
| Binder     | Solo en detalle `/carta/[id]` — el grid no tiene zoom (su imagen ya navega al detalle) |
| Backoffice | Grid + drawer — `CardShell` Root integra `CardImagePreviewModal`                       |

Interacción: click/tap/Enter en la imagen → modal `size=full` fondo oscuro con la imagen `object-contain` a `max-h-[90vh]`; click fuera o botón ✕ cierra. Si la imagen falla dentro del modal, se muestra el placeholder TCG.

### 1.7 Chips

Familia canónica única:

```tsx
<Chip size='sm' variant='flat' className='h-5 px-1.5 text-[10px] font-medium'>
```

- `accent-soft`/`secondary` para atributos de impresión (variante, foil, idioma, condición).
- `default` para datos (tipo, HP, rareza, número-as-chip).
- Fila: `ChipRow` — `flex flex-wrap items-center gap-1` (`CardDisplay.ChipRow` / `CardShell.ChipRow`).

| Atributo         | Formato canónico                                                           |
| ---------------- | -------------------------------------------------------------------------- |
| Variante pokémon | `{variant}` — omitir `"normal"`                                            |
| Foil magic       | `✦ Foil` (warning/secondary) \| `Non-Foil`                                 |
| Idioma           | `LanguageBadge` `short` en chips (`EN`, `JP`), `full` en listas (`Inglés`) |
| Rareza           | `{rarity}` — chip `default`                                                |
| HP pokémon       | `HP {n}`                                                                   |
| Tipo pokémon     | `{type}` (+ icono si aplica)                                               |

### 1.8 Precio

- `formatCurrency` MXN siempre.
- `Desde` cuando agrega varias condiciones/variantes.
- `null` → `—` (nunca `$0.00`).

### 1.9 Condición

- `CARD_CONDITION_SHORT_LABELS` (`NM`, `LP`, `MP`, `HP`, `DMG`) — constantes idénticas en ambos repos; verificar byte a byte al modificar.

---

## 2. Estructura canónica — card de grid

```
┌────────────────────────┐
│ [Availability] [Ident] │ ← top bar (dot+label · setCode)
│ ┌────────────────────┐ │
│ │   imagen 5/7       │ │ ← contain + placeholder (+preview)
│ └────────────────────┘ │
│ Nombre #N              │ ← Title + Number
│ Set name               │ ← Meta/Subtitle
│ [chip][chip][chip]     │ ← ChipRow (variante, rareza, tipo, HP…)
│ Precio                 │ ← Price (Desde $X — rol: venta)
└────────────────────────┘
```

Extensiones por rol (no rompen el contrato):

- **Backoffice**: `PriceBar` (precio + `Stock total`), `ConditionRow` (`NM 4`…), `CostLine` (privacy-gated) — datos operativos.
- **Binder**: overlay de wishlist en imagen, `Actions` (carrito).

---

## 3. Slots espejo

| Semántica      | Binder `CardDisplay`                               | Backoffice `CardShell`                 |
| -------------- | -------------------------------------------------- | -------------------------------------- |
| Contenedor     | `CardDisplay` (variant)                            | `Root` (isPressable opt-in)            |
| Top bar        | (div flex, contiene Availability+Ident)            | `Header`                               |
| Disponibilidad | `Availability`                                     | `Availability`                         |
| Código de set  | `Ident`                                            | `Ident`                                |
| Imagen         | `Image` / `ImageLink`                              | `Image`                                |
| Nombre         | `Title`                                            | `Title`                                |
| Número `#N`    | `Number`                                           | `Number`                               |
| Set/meta       | `Meta`                                             | `Subtitle`                             |
| Fila de chips  | `ChipRow`                                          | `ChipRow`                              |
| Precio         | `Price`                                            | `PriceBar`                             |
| Acciones       | `Actions`                                          | `Footer` + `DetailButton`/`ZoomButton` |
| Preview        | `CardImagePreviewModal` (standalone, solo detalle) | integrado en `Root`                    |

Los slots son opt-in en ambos: una superficie compone solo lo que necesita.

---

## 4. Matriz de superficies (estado objetivo)

| Superficie            | Repo       | Número                       | Disponibilidad       | Notas                          |
| --------------------- | ---------- | ---------------------------- | -------------------- | ------------------------------ |
| Grid catálogo         | ambos      | `#N` en Title                | dot+label top        | rarity chip incluido           |
| Detalle `/carta/[id]` | binder     | `#N` en meta                 | —                    | preview en imagen              |
| Most Wanted           | binder     | `setName • #N`               | —                    | tema parchment                 |
| Carrito               | binder     | `#N` pill en meta            | StockChip (count)    |                                |
| Checkout / Pedidos    | binder     | `#N` pill en meta            | —                    |                                |
| Wishlist              | binder     | (sin campo `cardNumber` hoy) | Disponible/Agotada   | pendiente contrato             |
| Catálogo + drawer     | backoffice | `#N` en Title                | dot+label + PriceBar | mergeado PR #163               |
| Filas transaccionales | backoffice | `#N`                         | —                    | pulgar + preview por primitiva |

---

## 5. Contratos de datos

| Campo                          | Público (binder)     | Interno (backoffice)                                                                         |
| ------------------------------ | -------------------- | -------------------------------------------------------------------------------------------- |
| `rarity` en list items         | ✅                   | ⏳ pendiente — backend aditivo nullable en `PokemonCardInternalItem`/`MagicCardInternalItem` |
| `cardNumber`/`collectorNumber` | ✅ mapper → `number` | ✅                                                                                           |
| `stockStatus`                  | ✅                   | ✅                                                                                           |
| `imageUri`/`moreImages`        | ✅                   | ✅ (`imageUri`)                                                                              |
| `variant`/`isFoil`/`language`  | ✅                   | ✅                                                                                           |

Cambios de contrato: solo **aditivos nullable** — nunca renombrar ni restringir campos existentes.
