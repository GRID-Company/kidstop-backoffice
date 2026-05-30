/**
 * Digital Binder ClickUp Tasks Data
 * All lists and tasks for the Kidstop Carpeta Digital project
 * Based on docs/digital-binder/CLICKUP_STRUCTURE.md
 */

export const FOLDER_ID = '90176590522';

export const LISTS = [
  // ── 0. Config ──────────────────────────────────────────
  {
    name: 'Setup Inicial',
    folder: '0. Config',
    tasks: [
      {
        name: 'Config - Inicializar Repositorio',
        description: `Clonar repo, copiar template del backoffice, instalar dependencias.

## Archivos
- package.json
- tsconfig.json
- next.config.ts
- hero.ts, postcss.config.mjs, eslint.config.mjs
- .prettierrc, .prettierignore, .gitignore
- codegen.ts
- .env.example

## Criterios de Aceptación
- npm install sin errores
- npx tsc --noEmit sin errores
- npm run dev levanta correctamente

## Estimación: 1 SP`,
        tags: ['atomo', 'config'],
      },
      {
        name: 'Config - Variables de Entorno y .env.example',
        description: `Crear .env.example con todas las variables necesarias.

## Archivos
- .env.example

## Criterios de Aceptación
- Documentadas: GRAPHQL_ENDPOINT, TCG_TYPE, GOOGLE_MAPS_API_KEY, coordenadas tienda

## Estimación: 1 SP`,
        tags: ['atomo', 'config'],
      },
      {
        name: 'Config - Copiar Workflow work-on-task',
        description: `Copiar .windsurf/workflows/work-on-task.md del backoffice.

## Archivos
- .windsurf/workflows/work-on-task.md

## Estimación: 1 SP`,
        tags: ['atomo', 'config', 'docs'],
      },
    ],
  },
  {
    name: 'Documentación',
    folder: '0. Config',
    tasks: [
      {
        name: 'Docs - README del Proyecto',
        description: `Crear README.md del proyecto.

## Archivos
- README.md

## Estimación: 1 SP`,
        tags: ['atomo', 'docs'],
      },
      {
        name: 'Docs - Documentación de Arquitectura',
        description: `Crear documentación de arquitectura.

## Archivos
- docs/ARCHITECTURE.md

## Estimación: 1 SP`,
        tags: ['atomo', 'docs'],
      },
    ],
  },

  // ── 1. Fundamentos ────────────────────────────────────
  {
    name: 'Layout - Componentes Base',
    folder: '1. Fundamentos',
    tasks: [
      {
        name: 'Layout - Componente Header',
        description: `Header principal de la aplicación. Logo a la izquierda, barra de búsqueda al centro, iconos a la derecha.

## Archivos
- src/shared/layouts/header.tsx

## Detalle
- Logo de Kidstop (dinámico según TCG)
- Barra de búsqueda (input con icono, solo visual por ahora)
- Icono de carrito con badge de cantidad (lee de useCartStore)
- Icono de wishlist (solo si autenticado y no Kiosk)
- Botón login / avatar de usuario (condicional según auth)
- Responsive: en móvil ocultar búsqueda, mostrar icono hamburger

## Criterios de Aceptación
- Header visible en todas las páginas
- Badge de carrito muestra cantidad del store
- Responsive: móvil, tablet, desktop

## Estimación: 3 SP`,
        tags: ['molecula', 'ui', 'layout'],
      },
      {
        name: 'Layout - Componente Footer',
        description: `Footer simple con info de la tienda.

## Archivos
- src/shared/layouts/footer.tsx

## Detalle
- Logo pequeño
- Dirección de la tienda
- Horario
- Links a redes sociales (iconos)
- Copyright
- Responsive

## Criterios de Aceptación
- Footer visible en todas las páginas públicas y autenticadas
- Responsive

## Estimación: 2 SP`,
        tags: ['atomo', 'ui', 'layout'],
      },
      {
        name: 'Layout - Navegación Móvil (Drawer)',
        description: `Drawer lateral que se abre al tocar hamburger en móvil. Contiene navegación completa.

## Archivos
- src/shared/layouts/mobile-drawer.tsx

## Detalle
- Drawer con animación (Framer Motion o HeroUI Drawer)
- Links: Catálogo, Carrito, Wishlist (si auth), Pedidos (si auth), Perfil (si auth)
- Botón Login/Logout
- Indicador de TCG activo
- Cerrar al navegar

## Dependencies
- Layout - Componente Header

## Criterios de Aceptación
- Se abre/cierra con animación suave
- Links funcionales
- Se cierra al hacer click en un link

## Estimación: 3 SP`,
        tags: ['molecula', 'ui', 'layout'],
      },
      {
        name: 'Layout - Componente SearchBar',
        description: `Barra de búsqueda reutilizable para header y catálogo.

## Archivos
- src/shared/base/search-bar.tsx

## Detalle
- Input con icono de búsqueda
- Placeholder dinámico según TCG ("Buscar cartas Pokémon..." / "Buscar cartas Magic...")
- Prop onSearch callback
- Debounce de 300ms
- Botón limpiar (X)

## Criterios de Aceptación
- Debounce funcional
- Callback ejecuta con el valor

## Estimación: 2 SP`,
        tags: ['atomo', 'ui', 'layout', 'catalog'],
      },
    ],
  },
  {
    name: 'Layout - Layouts y Rutas',
    folder: '1. Fundamentos',
    tasks: [
      {
        name: 'Layout - Public Layout (Wrapper)',
        description: `Layout wrapper para rutas públicas (catálogo, most-wanted, login, registro).

## Archivos
- src/app/(public)/layout.tsx

## Detalle
- Importar Header y Footer
- Slot para children
- Aplicar useTcgTheme() para colores dinámicos
- Min-height: 100vh

## Dependencies
- Layout - Componente Header
- Layout - Componente Footer

## Criterios de Aceptación
- Header y footer visibles
- Tema TCG aplicado

## Estimación: 2 SP`,
        tags: ['molecula', 'ui', 'layout'],
      },
      {
        name: 'Layout - Authenticated Layout (Wrapper)',
        description: `Layout wrapper para rutas protegidas. Extiende el público con menú de usuario.

## Archivos
- src/app/(authenticated)/layout.tsx

## Detalle
- Reutilizar Header con variante autenticada (avatar, menú dropdown)
- Menú dropdown: Perfil, Mis Pedidos, Wishlist, Cerrar Sesión
- Si Kiosk: ocultar Perfil, Pedidos, Wishlist del menú
- Footer igual que público

## Dependencies
- Layout - Public Layout (Wrapper)

## Criterios de Aceptación
- Menú de usuario funcional
- Kiosk no ve opciones restringidas

## Estimación: 2 SP`,
        tags: ['molecula', 'ui', 'layout'],
      },
      {
        name: 'Layout - Not Authenticated Layout',
        description: `Layout para login/registro/recuperar contraseña. Centrado, sin header completo.

## Archivos
- src/app/(not-authenticated)/layout.tsx

## Detalle
- Logo centrado arriba
- Card centrada con el formulario (children)
- Link "Volver al catálogo"
- Tema TCG aplicado

## Criterios de Aceptación
- Diseño centrado y limpio

## Estimación: 1 SP`,
        tags: ['atomo', 'ui', 'layout'],
      },
      {
        name: 'Layout - Página 404',
        description: `Página 404 Not Found.

## Archivos
- src/app/not-found.tsx

## Detalle
- Mensaje "Página no encontrada"
- Link "Volver al catálogo"
- Diseño consistente con el tema

## Estimación: 1 SP`,
        tags: ['atomo', 'ui', 'layout'],
      },
    ],
  },
  {
    name: 'TCG por Dominio',
    folder: '1. Fundamentos',
    tasks: [
      {
        name: 'TCG - Utilidad de Detección por Hostname',
        description: `Detectar TCG según hostname del dominio. Ya implementado.

## Archivos
- src/lib/utils/get-tcg-from-domain.ts
- src/lib/store/tcg-context.ts

## Estimación: 1 SP`,
        tags: ['atomo', 'utils', 'tcg'],
      },
      {
        name: 'TCG - Verificar Constantes de Temas',
        description: `Verificar que tcg-themes.ts tiene los colores correctos para carpeta digital.

## Archivos
- src/lib/consts/tcg-themes.ts

## Detalle
- Pokémon: rojo (#e53223), fondo claro
- Magic: naranja/oscuro, fondo oscuro
- Propiedades: accent, pageBg, headerBg, textPrimary
- Eliminar propiedades de sidebar (no aplica)

## Criterios de Aceptación
- Temas visualmente distintos entre Pokémon y Magic

## Estimación: 1 SP`,
        tags: ['atomo', 'domain', 'tcg'],
      },
      {
        name: 'TCG - Logo Dinámico por TCG',
        description: `Componente que renderiza el logo correcto según el TCG del dominio.

## Archivos
- src/shared/base/tcg-logo.tsx
- src/assets/img/logo-pokemon.svg
- src/assets/img/logo-magic.svg

## Detalle
- Leer TCG de useTCGContext()
- Renderizar imagen correspondiente
- Props: size (sm, md, lg)

## Dependencies
- TCG - Verificar Constantes de Temas

## Estimación: 1 SP`,
        tags: ['atomo', 'ui', 'tcg'],
      },
      {
        name: 'TCG - Metadata Dinámica (Título y Favicon)',
        description: `Título de página y favicon dinámicos según TCG.

## Archivos
- src/app/layout.tsx (modificar metadata)
- public/favicon-pokemon.ico
- public/favicon-magic.ico

## Detalle
- Título: "Kidstop - Pokémon TCG" o "Kidstop - Magic: The Gathering"
- Favicon dinámico según TCG
- Meta description adaptada

## Estimación: 2 SP`,
        tags: ['atomo', 'utils', 'tcg'],
      },
    ],
  },
  {
    name: 'Auth - Domain y Adapters',
    folder: '1. Fundamentos',
    tasks: [
      {
        name: 'Auth - Domain Types y Constants',
        description: `Tipos de dominio para autenticación.

## Archivos
- src/features/auth/domain/types.ts
- src/features/auth/domain/constants.ts

## Detalle
- ILoginForm { email, password }
- IRegisterForm { name, email, phone, password, confirmPassword }
- IForgotPasswordForm { email }
- IAuthUser { id, name, email, phone, role }
- Constantes: AUTH_ERRORS, AUTH_ROUTES

## Estimación: 1 SP`,
        tags: ['atomo', 'domain', 'auth'],
      },
      {
        name: 'Auth - Login Form Schema (Zod)',
        description: `Schema Zod y hook useForm para login.

## Archivos
- src/features/auth/adapters/forms/login.schema.ts
- src/features/auth/adapters/forms/use-login-form.ts

## Detalle
- email: string().email()
- password: string().min(8)
- Hook con zodResolver y defaultValues

## Dependencies
- Auth - Domain Types y Constants

## Estimación: 1 SP`,
        tags: ['atomo', 'forms', 'auth'],
      },
      {
        name: 'Auth - Register Form Schema (Zod)',
        description: `Schema Zod y hook useForm para registro.

## Archivos
- src/features/auth/adapters/forms/register.schema.ts
- src/features/auth/adapters/forms/use-register-form.ts

## Detalle
- name: string().min(2)
- email: string().email()
- phone: string().min(10)
- password: string().min(8)
- confirmPassword: string() + refine para match
- Hook con zodResolver y defaultValues

## Dependencies
- Auth - Domain Types y Constants

## Estimación: 2 SP`,
        tags: ['atomo', 'forms', 'auth'],
      },
      {
        name: 'Auth - Forgot Password Form Schema (Zod)',
        description: `Schema Zod y hook useForm para recuperar contraseña.

## Archivos
- src/features/auth/adapters/forms/forgot-password.schema.ts
- src/features/auth/adapters/forms/use-forgot-password-form.ts

## Detalle
- email: string().email()
- Hook con zodResolver

## Dependencies
- Auth - Domain Types y Constants

## Estimación: 1 SP`,
        tags: ['atomo', 'forms', 'auth'],
      },
      {
        name: 'Auth - Mock API (Login, Register, Forgot Password)',
        description: `Funciones mock que simulan las respuestas del backend.

## Archivos
- src/features/auth/adapters/api/auth.mock.ts

## Detalle
- mockLogin(email, password) → { user, access_token } o throw
- mockRegister(data) → { user, access_token }
- mockForgotPassword(email) → { success: true }
- Usuarios mock: cliente@test.com, vip@test.com, kiosk@test.com
- Simular delay de 500ms

## Dependencies
- Auth - Domain Types y Constants

## Criterios de Aceptación
- Login con credenciales mock funciona
- Login con credenciales incorrectas lanza error
- Registro siempre exitoso

## Estimación: 2 SP`,
        tags: ['atomo', 'adapters', 'auth'],
      },
      {
        name: 'Auth - Mappers (Form → API Input)',
        description: `Mappers para transformar datos de formulario a input de API.

## Archivos
- src/features/auth/adapters/mappers/auth.mapper.ts

## Detalle
- toLoginInput(form: LoginForm) → LoginInput
- toRegisterInput(form: RegisterForm) → RegisterInput

## Dependencies
- Auth - Domain Types y Constants

## Estimación: 1 SP`,
        tags: ['atomo', 'adapters', 'auth'],
      },
    ],
  },
  {
    name: 'Auth - Vistas',
    folder: '1. Fundamentos',
    tasks: [
      {
        name: 'Auth - Vista Login',
        description: `Página de login con formulario, validación y mock.

## Archivos
- src/features/auth/ui/views/login.tsx
- src/app/(not-authenticated)/login/page.tsx

## Detalle
- Formulario con useLoginForm()
- Campos: email, password
- Botón "Iniciar Sesión"
- Link "¿Olvidaste tu contraseña?"
- Link "¿No tienes cuenta? Regístrate"
- onSubmit → mockLogin → processLogin → redirect a /
- Toast de error si falla
- Loading state en botón

## Dependencies
- Auth - Login Form Schema (Zod)
- Auth - Mock API (Login, Register, Forgot Password)

## Criterios de Aceptación
- Login con cliente@test.com / password123 redirige a catálogo
- Login con credenciales incorrectas muestra toast de error
- Validación Zod muestra errores inline

## Estimación: 3 SP`,
        tags: ['organismo', 'ui', 'auth'],
      },
      {
        name: 'Auth - Vista Registro',
        description: `Página de registro con formulario completo.

## Archivos
- src/features/auth/ui/views/register.tsx
- src/app/(not-authenticated)/registro/page.tsx

## Detalle
- Formulario con useRegisterForm()
- Campos: nombre, email, teléfono, contraseña, confirmar contraseña
- Botón "Crear Cuenta"
- Link "¿Ya tienes cuenta? Inicia sesión"
- onSubmit → mockRegister → processLogin → redirect a /
- Toast de éxito/error
- Loading state

## Dependencies
- Auth - Register Form Schema (Zod)
- Auth - Mock API (Login, Register, Forgot Password)

## Criterios de Aceptación
- Registro exitoso redirige a catálogo
- Validación de confirmPassword funciona
- Errores inline visibles

## Estimación: 3 SP`,
        tags: ['organismo', 'ui', 'auth'],
      },
      {
        name: 'Auth - Vista Recuperar Contraseña',
        description: `Página de recuperar contraseña.

## Archivos
- src/features/auth/ui/views/forgot-password.tsx
- src/app/(not-authenticated)/recuperar-contrasena/page.tsx

## Detalle
- Formulario con useForgotPasswordForm()
- Campo: email
- Botón "Enviar enlace"
- Estado de éxito: "Revisa tu correo electrónico"
- Link "Volver a login"

## Dependencies
- Auth - Forgot Password Form Schema (Zod)
- Auth - Mock API (Login, Register, Forgot Password)

## Criterios de Aceptación
- Envío muestra pantalla de confirmación
- Link de regreso a login funciona

## Estimación: 2 SP`,
        tags: ['molecula', 'ui', 'auth'],
      },
      {
        name: 'Auth - API Routes para Cookies de Sesión',
        description: `API routes de Next.js para manejar cookies HTTP-only de sesión.

## Archivos
- src/app/api/login/route.ts
- src/app/api/logout/route.ts

## Detalle
- POST /api/login → set cookies (jwt, role)
- POST /api/logout → delete cookies
- Cookies HTTP-only, secure, sameSite: lax

## Criterios de Aceptación
- Después de login, cookies visibles en DevTools
- Después de logout, cookies eliminadas
- Middleware proxy.ts lee cookies correctamente

## Estimación: 2 SP`,
        tags: ['atomo', 'adapters', 'auth'],
      },
    ],
  },

  // ── 2. Catálogo ───────────────────────────────────────
  {
    name: 'Catálogo - Domain y Mocks',
    folder: '2. Catálogo',
    tasks: [
      {
        name: 'Catálogo - Domain Types',
        description: `Tipos de dominio para el catálogo.

## Archivos
- src/features/catalog/domain/types.ts
- src/features/catalog/domain/constants.ts

## Detalle
- ICatalogCard { id, name, setName, setCode, number, rarity, image, tcgType }
- ICardVariant { id, name, condition, price, stock }
- ICardDetail extends ICatalogCard { variants, description }
- ICatalogFilters { search, setCode, rarity, priceMin, priceMax, inStockOnly }
- Constantes: RARITIES, SORT_OPTIONS, DEFAULT_FILTERS

## Estimación: 1 SP`,
        tags: ['atomo', 'domain', 'catalog'],
      },
      {
        name: 'Catálogo - Mock Data (Cartas Pokémon y Magic)',
        description: `Datos mock realistas para el catálogo. Mínimo 20 cartas Pokémon y 20 Magic.

## Archivos
- src/features/catalog/adapters/api/catalog.mock.ts

## Detalle
- MOCK_POKEMON_CARDS: 20+ cartas con datos reales (Charizard, Pikachu, etc.)
- MOCK_MAGIC_CARDS: 20+ cartas con datos reales (Black Lotus, Lightning Bolt, etc.)
- Cada carta con 1-3 variantes y condiciones
- Precios realistas (USD)
- Stock variado (0-10)
- Imágenes de pokemontcg.io y scryfall.io
- mockGetCatalog(tcg, filters) → filtrar y retornar
- mockGetCardDetail(id) → retornar carta con variantes
- Simular delay de 300ms

## Dependencies
- Catálogo - Domain Types

## Criterios de Aceptación
- Filtro por TCG funciona
- Búsqueda por nombre funciona
- Detalle retorna variantes

## Estimación: 2 SP`,
        tags: ['atomo', 'adapters', 'catalog'],
      },
      {
        name: 'Catálogo - Hook useCatalog',
        description: `Hook que orquesta la carga de datos del catálogo.

## Archivos
- src/features/catalog/ui/hooks/use-catalog.ts

## Detalle
- Parámetros: filters (ICatalogFilters)
- Lee TCG de useTCGContext()
- Llama mockGetCatalog(tcg, filters)
- Retorna: { cards, loading, totalCount, refetch }
- Manejo de loading state

## Dependencies
- Catálogo - Mock Data (Cartas Pokémon y Magic)

## Estimación: 2 SP`,
        tags: ['atomo', 'ui', 'catalog'],
      },
      {
        name: 'Catálogo - Hook useCardDetail',
        description: `Hook para cargar detalle de una carta.

## Archivos
- src/features/catalog/ui/hooks/use-card-detail.ts

## Detalle
- Parámetro: cardId (string)
- Llama mockGetCardDetail(cardId)
- Retorna: { card, loading, error }

## Dependencies
- Catálogo - Mock Data (Cartas Pokémon y Magic)

## Estimación: 1 SP`,
        tags: ['atomo', 'ui', 'catalog'],
      },
    ],
  },
  {
    name: 'Catálogo - Componentes',
    folder: '2. Catálogo',
    tasks: [
      {
        name: 'Catálogo - Componente CardItem',
        description: `Card individual para el grid del catálogo.

## Archivos
- src/features/catalog/ui/components/card-item.tsx

## Detalle
- Props: card (ICatalogCard), onAddToCart?, onViewDetail?
- Imagen con Next/Image (aspect-ratio de carta TCG)
- Nombre de la carta (truncado si largo)
- Set / edición
- Precio desde (el más bajo de las variantes)
- Badge de stock: "Disponible" (verde) o "Agotado" (gris)
- Hover: scale sutil + sombra
- Click → onViewDetail

## Dependencies
- Catálogo - Domain Types

## Estimación: 2 SP`,
        tags: ['atomo', 'ui', 'catalog'],
      },
      {
        name: 'Catálogo - Componente CardGrid',
        description: `Grid responsive de CardItems.

## Archivos
- src/features/catalog/ui/components/card-grid.tsx

## Detalle
- Props: cards (ICatalogCard[]), loading, onCardClick
- Grid: 2 cols móvil, 3 tablet, 4 desktop, 5 desktop-xl
- Loading: skeleton cards (6-12 placeholders)
- Empty state: "No se encontraron cartas" con ilustración
- Gap consistente

## Dependencies
- Catálogo - Componente CardItem

## Estimación: 2 SP`,
        tags: ['molecula', 'ui', 'catalog'],
      },
      {
        name: 'Catálogo - Componente CardSkeleton',
        description: `Skeleton loading para cards del catálogo.

## Archivos
- src/features/catalog/ui/components/card-skeleton.tsx

## Detalle
- Skeleton con forma de CardItem
- Animación pulse
- Props: count (número de skeletons a mostrar)

## Estimación: 1 SP`,
        tags: ['atomo', 'ui', 'catalog'],
      },
      {
        name: 'Catálogo - Componente VariantSelector',
        description: `Selector de variante y condición para la vista de detalle.

## Archivos
- src/features/catalog/ui/components/variant-selector.tsx

## Detalle
- Props: variants (ICardVariant[]), selectedVariant, onSelect
- Tabs o radio buttons para variante (Normal, Holo, Reverse, etc.)
- Dropdown para condición (NM, LP, MP, HP, DMG)
- Mostrar precio y stock de la combinación seleccionada
- Deshabilitar combinaciones sin stock

## Estimación: 2 SP`,
        tags: ['atomo', 'ui', 'catalog'],
      },
      {
        name: 'Catálogo - Componente QuantitySelector (Shared)',
        description: `Selector de cantidad reutilizable (detalle de carta y carrito).

## Archivos
- src/shared/base/quantity-selector.tsx

## Detalle
- Props: value, min (1), max (stock), onChange
- Botones +/- con input numérico
- Deshabilitar - si value === min
- Deshabilitar + si value === max

## Estimación: 1 SP`,
        tags: ['atomo', 'ui', 'catalog', 'cart'],
      },
      {
        name: 'Catálogo - Componente AddToCartButton',
        description: `Botón para agregar carta al carrito.

## Archivos
- src/features/catalog/ui/components/add-to-cart-button.tsx

## Detalle
- Props: card, variant, condition, quantity
- Si no autenticado: redirigir a login
- Si stock === 0: botón deshabilitado "Agotado"
- onClick → useCartStore().addItem(...)
- Toast "Agregado al carrito"

## Dependencies
- Carrito - Store Zustand (Verificar y Ajustar)

## Estimación: 1 SP`,
        tags: ['atomo', 'ui', 'catalog', 'cart'],
      },
      {
        name: 'Catálogo - Componente AddToWishlistButton',
        description: `Botón para agregar/quitar de wishlist.

## Archivos
- src/features/catalog/ui/components/add-to-wishlist-button.tsx

## Detalle
- Props: cardId, isInWishlist
- Icono corazón (lleno si ya está, vacío si no)
- Si no autenticado o Kiosk: no mostrar
- onClick → toggle wishlist (mock)
- Toast "Agregado a wishlist" / "Removido de wishlist"

## Estimación: 1 SP`,
        tags: ['atomo', 'ui', 'catalog', 'wishlist'],
      },
    ],
  },
  {
    name: 'Catálogo - Vistas',
    folder: '2. Catálogo',
    tasks: [
      {
        name: 'Catálogo - Vista Principal (Grid de Cartas)',
        description: `Página principal de la carpeta digital. Compone grid + búsqueda + filtros.

## Archivos
- src/features/catalog/ui/views/catalog.tsx
- src/app/(public)/page.tsx (importar vista)

## Detalle
- SearchBar arriba
- Botón "Filtros" (abre panel/drawer)
- CardGrid con resultados
- Contador de resultados ("24 cartas encontradas")
- Click en carta → navegar a /carta/[id]
- useCatalog(filters) para datos

## Dependencies
- Catálogo - Componente CardGrid
- Catálogo - Hook useCatalog

## Criterios de Aceptación
- Página carga con cartas mock
- Búsqueda filtra en tiempo real
- Click navega a detalle

## Estimación: 3 SP`,
        tags: ['organismo', 'ui', 'catalog'],
      },
      {
        name: 'Catálogo - Vista Detalle de Carta',
        description: `Página de detalle de una carta individual.

## Archivos
- src/features/catalog/ui/views/card-detail.tsx
- src/app/(public)/carta/[id]/page.tsx

## Detalle
- Layout: imagen a la izquierda, info a la derecha
- Nombre, set, número, rareza
- VariantSelector
- Precio de la variante+condición seleccionada
- Stock disponible
- QuantitySelector
- AddToCartButton
- AddToWishlistButton
- Breadcrumb: Catálogo > [Set] > [Carta]
- Mobile: imagen arriba, info abajo

## Dependencies
- Catálogo - Hook useCardDetail
- Catálogo - Componente VariantSelector

## Criterios de Aceptación
- Cambiar variante/condición actualiza precio y stock
- Agregar al carrito funciona
- Responsive

## Estimación: 3 SP`,
        tags: ['organismo', 'ui', 'catalog'],
      },
    ],
  },
  {
    name: 'Catálogo - Filtros y Búsqueda',
    folder: '2. Catálogo',
    tasks: [
      {
        name: 'Catálogo - Panel de Filtros (Desktop Sidebar)',
        description: `Panel de filtros para el catálogo.

## Archivos
- src/features/catalog/ui/components/catalog-filters.tsx

## Detalle
- Filtro por set/edición (dropdown con búsqueda)
- Filtro por rareza (checkboxes)
- Filtro por rango de precio (inputs min/max)
- Filtro por disponibilidad (toggle "Solo en stock")
- Botón "Limpiar filtros"
- Callback onFiltersChange(filters)
- Desktop: sidebar lateral izquierda

## Dependencies
- Catálogo - Domain Types

## Estimación: 3 SP`,
        tags: ['molecula', 'ui', 'catalog'],
      },
      {
        name: 'Catálogo - Filtro Drawer Móvil',
        description: `Drawer de filtros para móvil.

## Archivos
- src/features/catalog/ui/components/catalog-filters-drawer.tsx

## Detalle
- Botón "Filtros" visible solo en móvil
- Abre drawer/sheet desde abajo
- Reutiliza CatalogFilters internamente
- Botón "Aplicar" cierra drawer
- Badge con número de filtros activos

## Dependencies
- Catálogo - Panel de Filtros (Desktop Sidebar)

## Estimación: 2 SP`,
        tags: ['molecula', 'ui', 'catalog'],
      },
    ],
  },

  // ── 3. Carrito y Checkout ─────────────────────────────
  {
    name: 'Carrito - Store y Domain',
    folder: '3. Carrito y Checkout',
    tasks: [
      {
        name: 'Carrito - Domain Types',
        description: `Tipos de dominio para el carrito.

## Archivos
- src/features/cart/domain/types.ts
- src/features/cart/domain/constants.ts

## Detalle
- ICartItem { cardId, cardName, cardImage, setName, variantId, variantName, condition, quantity, unitPrice }
- ICartSummary { totalItems, totalPrice }
- IStockValidationResult { available: ICartItem[], unavailable: ICartItem[] }
- Constantes: MAX_QUANTITY_PER_ITEM (10)

## Estimación: 1 SP`,
        tags: ['atomo', 'domain', 'cart'],
      },
      {
        name: 'Carrito - Store Zustand (Verificar y Ajustar)',
        description: `El store base ya existe (cart.ts). Verificar que usa los tipos de domain y agregar funcionalidad faltante.

## Archivos
- src/lib/store/cart.ts (modificar)

## Detalle
- Verificar que CartItem usa tipos de domain/types.ts
- Agregar getItemCount(cardId, variantId, condition) → number
- Agregar isInCart(cardId) → boolean
- Verificar persistencia en localStorage

## Dependencies
- Carrito - Domain Types

## Criterios de Aceptación
- addItem con item existente incrementa cantidad
- removeItem elimina correctamente
- Persiste entre recargas

## Estimación: 2 SP`,
        tags: ['atomo', 'store', 'cart'],
      },
    ],
  },
  {
    name: 'Carrito - Vista',
    folder: '3. Carrito y Checkout',
    tasks: [
      {
        name: 'Carrito - Componente CartItem (Fila de Item)',
        description: `Componente de fila de item en el carrito.

## Archivos
- src/features/cart/ui/components/cart-item.tsx

## Detalle
- Props: item (ICartItem), onRemove, onUpdateQuantity
- Imagen de carta (pequeña)
- Nombre, set, variante, condición
- Precio unitario
- QuantitySelector (reutilizar shared/base)
- Subtotal (cantidad × precio)
- Botón eliminar (icono trash)
- Mobile: layout vertical compacto

## Dependencies
- Carrito - Domain Types

## Estimación: 2 SP`,
        tags: ['molecula', 'ui', 'cart'],
      },
      {
        name: 'Carrito - Componente CartSummary',
        description: `Resumen del carrito con totales.

## Archivos
- src/features/cart/ui/components/cart-summary.tsx

## Detalle
- Props: totalItems, totalPrice
- Mostrar total de items
- Mostrar precio total formateado (USD)
- Botón "Continuar al Checkout"
- Link "Seguir comprando" → /

## Estimación: 1 SP`,
        tags: ['atomo', 'ui', 'cart'],
      },
      {
        name: 'Carrito - Vista de Carrito',
        description: `Vista principal del carrito.

## Archivos
- src/features/cart/ui/views/cart.tsx
- src/app/(authenticated)/carrito/page.tsx

## Detalle
- Lista de CartItems
- CartSummary a la derecha (desktop) o abajo (mobile)
- Estado vacío: "Tu carrito está vacío" + link "Explorar catálogo"
- Lee items de useCartStore()
- Título "Mi Carrito (X items)"

## Dependencies
- Carrito - Componente CartItem (Fila de Item)
- Carrito - Componente CartSummary

## Criterios de Aceptación
- Items del store se muestran
- Modificar cantidad actualiza totales
- Eliminar item actualiza lista
- Botón checkout navega a /checkout

## Estimación: 3 SP`,
        tags: ['organismo', 'ui', 'cart'],
      },
    ],
  },
  {
    name: 'Checkout - Flujo Principal',
    folder: '3. Carrito y Checkout',
    tasks: [
      {
        name: 'Checkout - Mock de Validación de Stock',
        description: `Mock para validar stock de items del carrito.

## Archivos
- src/features/cart/adapters/api/checkout.mock.ts

## Detalle
- mockValidateStock(items) → IStockValidationResult
- Simular que ~20% de items no tienen stock suficiente
- mockCreateOrder(items, customerInfo?) → { orderId, orderCode }
- Delay 500ms

## Estimación: 1 SP`,
        tags: ['atomo', 'adapters', 'cart', 'checkout'],
      },
      {
        name: 'Checkout - Modal de Items No Disponibles',
        description: `Modal que muestra items sin stock al hacer checkout.

## Archivos
- src/features/cart/ui/components/stock-validation-modal.tsx

## Detalle
- Props: unavailableItems, onRemoveItems, onAddToWishlist, onContinue
- Lista de items sin stock con imagen y nombre
- Opciones:
  - "Quitar del carrito" → remueve items sin stock
  - "Agregar a wishlist" → mueve a wishlist
  - "Continuar sin estos items" → procede sin ellos
- Botón "Cancelar" → volver al carrito

## Dependencies
- Checkout - Mock de Validación de Stock

## Estimación: 3 SP`,
        tags: ['molecula', 'ui', 'checkout'],
      },
      {
        name: 'Checkout - Vista Resumen y Confirmación',
        description: `Vista principal del checkout.

## Archivos
- src/features/cart/ui/views/checkout.tsx
- src/app/(authenticated)/checkout/page.tsx

## Detalle
- Al entrar: llamar mockValidateStock
- Si hay faltantes: mostrar StockValidationModal
- Si todo OK: mostrar resumen
- Resumen: lista de items, total, datos del usuario
- Botón "Confirmar Pedido"
- onConfirm → mockCreateOrder → toast éxito → redirect a /pedidos/[id]
- Loading state durante confirmación

## Dependencies
- Checkout - Modal de Items No Disponibles

## Criterios de Aceptación
- Validación de stock se ejecuta al entrar
- Modal aparece si hay faltantes
- Confirmación exitosa redirige a pedido

## Estimación: 3 SP`,
        tags: ['organismo', 'ui', 'checkout'],
      },
      {
        name: 'Checkout - Pantalla de Pedido Confirmado',
        description: `Pantalla de éxito después de confirmar pedido.

## Archivos
- src/features/cart/ui/components/order-confirmed.tsx

## Detalle
- Icono de éxito (check verde)
- "¡Pedido confirmado!"
- Código de pedido
- "Te notificaremos cuando esté listo"
- Botón "Ver mis pedidos"
- Botón "Seguir comprando"
- Limpiar carrito (clearCart)

## Estimación: 2 SP`,
        tags: ['atomo', 'ui', 'checkout'],
      },
    ],
  },
  {
    name: 'Checkout - Geofencing',
    folder: '3. Carrito y Checkout',
    tasks: [
      {
        name: 'Geofencing - Utilidad de Cálculo de Distancia',
        description: `Función pura para calcular distancia entre dos coordenadas.

## Archivos
- src/lib/utils/geofence.ts

## Detalle
- haversineDistance(lat1, lon1, lat2, lon2) → distancia en metros
- isWithinRadius(userLat, userLon, storeLat, storeLon, radiusMeters) → boolean
- getStoreLocation() → { lat, lon, radius } (lee de env vars)

## Criterios de Aceptación
- Cálculo correcto (verificar con coordenadas conocidas)

## Estimación: 2 SP`,
        tags: ['atomo', 'utils', 'checkout', 'google-maps'],
      },
      {
        name: 'Geofencing - Hook useGeofence',
        description: `Hook para validar ubicación del usuario.

## Archivos
- src/features/cart/ui/hooks/use-geofence.ts

## Detalle
- Solicitar permiso de geolocalización (navigator.geolocation)
- Obtener coordenadas del usuario
- Calcular si está dentro del radio con isWithinRadius()
- Retorna: { isInRange, isLoading, error, requestLocation }
- Manejar errores: permiso denegado, no disponible
- Si VIP → siempre isInRange: true
- Si Kiosk → siempre isInRange: true

## Dependencies
- Geofencing - Utilidad de Cálculo de Distancia

## Estimación: 3 SP`,
        tags: ['molecula', 'ui', 'checkout', 'google-maps'],
      },
      {
        name: 'Geofencing - Componente de Validación en Checkout',
        description: `Componente UI para validar ubicación en el checkout.

## Archivos
- src/features/cart/ui/components/geofence-check.tsx

## Detalle
- Props: onValidated (callback cuando pasa validación)
- Botón "Verificar ubicación"
- Loading: "Verificando tu ubicación..."
- Éxito: "Estás en la tienda ✓"
- Error: "Debes estar en la tienda para confirmar tu pedido"
- Error permiso: "Necesitamos acceso a tu ubicación"

## Dependencies
- Geofencing - Hook useGeofence

## Estimación: 2 SP`,
        tags: ['molecula', 'ui', 'checkout', 'google-maps'],
      },
    ],
  },
  {
    name: 'Checkout - Modo Kiosk',
    folder: '3. Carrito y Checkout',
    tasks: [
      {
        name: 'Kiosk - Form Schema de Datos del Cliente',
        description: `Schema Zod y hook para formulario Kiosk.

## Archivos
- src/features/cart/adapters/forms/kiosk-customer.schema.ts
- src/features/cart/adapters/forms/use-kiosk-customer-form.ts

## Detalle
- Schema: name (string, min 2), email (string, email)
- Hook useKioskCustomerForm con zodResolver

## Estimación: 1 SP`,
        tags: ['atomo', 'forms', 'checkout', 'kiosk'],
      },
      {
        name: 'Kiosk - Componente Formulario de Datos del Cliente',
        description: `Formulario para capturar datos del cliente en modo Kiosk.

## Archivos
- src/features/cart/ui/components/kiosk-customer-form.tsx

## Detalle
- Campos: nombre y email
- Se muestra en checkout solo si role === KIOSK
- Datos se envían junto con el pedido
- Validación inline

## Dependencies
- Kiosk - Form Schema de Datos del Cliente

## Criterios de Aceptación
- Solo visible en sesión Kiosk
- Validación funcional

## Estimación: 2 SP`,
        tags: ['molecula', 'ui', 'checkout', 'kiosk'],
      },
    ],
  },

  // ── 4. Cuenta de Usuario ──────────────────────────────
  {
    name: 'Perfil - Domain y Vista',
    folder: '4. Cuenta de Usuario',
    tasks: [
      {
        name: 'Perfil - Domain Types',
        description: `Tipos de dominio para perfil de usuario.

## Archivos
- src/features/profile/domain/types.ts

## Detalle
- IUserProfile { id, name, email, phone, role, createdAt }
- IUpdateProfileForm { name, phone }
- IChangePasswordForm { currentPassword, newPassword, confirmPassword }

## Estimación: 1 SP`,
        tags: ['atomo', 'domain', 'profile'],
      },
      {
        name: 'Perfil - Form Schemas (Editar y Cambiar Contraseña)',
        description: `Schemas Zod para editar perfil y cambiar contraseña.

## Archivos
- src/features/profile/adapters/forms/profile.schema.ts
- src/features/profile/adapters/forms/use-profile-form.ts
- src/features/profile/adapters/forms/change-password.schema.ts
- src/features/profile/adapters/forms/use-change-password-form.ts

## Detalle
- Profile schema: name (min 2), phone (min 10)
- Change password: currentPassword, newPassword (min 8), confirmPassword (refine match)

## Dependencies
- Perfil - Domain Types

## Estimación: 2 SP`,
        tags: ['atomo', 'forms', 'profile'],
      },
      {
        name: 'Perfil - Mock API',
        description: `Mock API para perfil de usuario.

## Archivos
- src/features/profile/adapters/api/profile.mock.ts

## Detalle
- mockGetProfile() → IUserProfile
- mockUpdateProfile(data) → IUserProfile actualizado
- mockChangePassword(data) → { success: true }
- Delay 300ms

## Dependencies
- Perfil - Domain Types

## Estimación: 1 SP`,
        tags: ['atomo', 'adapters', 'profile'],
      },
      {
        name: 'Perfil - Vista de Perfil',
        description: `Vista principal del perfil de usuario.

## Archivos
- src/features/profile/ui/views/profile.tsx
- src/app/(authenticated)/perfil/page.tsx

## Detalle
- Sección "Mis Datos": nombre, email (readonly), teléfono, tipo (readonly)
- Botón "Editar" → formulario inline
- Sección "Cambiar Contraseña" (colapsable)
- Toast de éxito/error
- No accesible para Kiosk

## Dependencies
- Perfil - Form Schemas (Editar y Cambiar Contraseña)
- Perfil - Mock API

## Criterios de Aceptación
- Datos del usuario visibles
- Edición funcional con validación
- Cambio de contraseña funcional

## Estimación: 3 SP`,
        tags: ['organismo', 'ui', 'profile'],
      },
    ],
  },
  {
    name: 'Pedidos - Domain y Vistas',
    folder: '4. Cuenta de Usuario',
    tasks: [
      {
        name: 'Pedidos - Domain Types',
        description: `Tipos de dominio para pedidos.

## Archivos
- src/features/orders/domain/types.ts
- src/features/orders/domain/constants.ts

## Detalle
- IOrder { id, code, date, status, totalItems, totalPrice, tcgType }
- IOrderDetail extends IOrder { items: IOrderItem[], timeline: IOrderEvent[] }
- IOrderItem { cardId, cardName, cardImage, variantName, condition, quantity, unitPrice }
- IOrderEvent { status, date, description }
- OrderStatus enum: PENDING, PREPARING, READY, COMPLETED, CANCELLED
- Constantes: ORDER_STATUS_LABELS, ORDER_STATUS_COLORS

## Estimación: 1 SP`,
        tags: ['atomo', 'domain', 'orders'],
      },
      {
        name: 'Pedidos - Mock Data',
        description: `Mock data para pedidos.

## Archivos
- src/features/orders/adapters/api/orders.mock.ts

## Detalle
- MOCK_ORDERS: 8-10 pedidos con estados variados
- Mezcla de Pokémon y Magic
- mockGetOrders(tcg) → filtrar por TCG del dominio
- mockGetOrderDetail(id) → pedido con items y timeline
- Delay 300ms

## Dependencies
- Pedidos - Domain Types

## Estimación: 2 SP`,
        tags: ['atomo', 'adapters', 'orders'],
      },
      {
        name: 'Pedidos - Componente OrderCard',
        description: `Card de pedido para el listado.

## Archivos
- src/features/orders/ui/components/order-card.tsx

## Detalle
- Props: order (IOrder), onClick
- Código de pedido, fecha, total, badge de estado, número de items

## Dependencies
- Pedidos - Domain Types

## Estimación: 1 SP`,
        tags: ['atomo', 'ui', 'orders'],
      },
      {
        name: 'Pedidos - Componente OrderTimeline',
        description: `Timeline de estados del pedido.

## Archivos
- src/features/orders/ui/components/order-timeline.tsx

## Detalle
- Props: events (IOrderEvent[])
- Timeline vertical con puntos y líneas
- Evento actual resaltado, futuros en gris

## Estimación: 2 SP`,
        tags: ['atomo', 'ui', 'orders'],
      },
      {
        name: 'Pedidos - Vista Listado',
        description: `Vista de listado de pedidos.

## Archivos
- src/features/orders/ui/views/orders.tsx
- src/app/(authenticated)/pedidos/page.tsx

## Detalle
- Lista de OrderCards
- Filtrados por TCG del dominio (automático)
- Título "Mis Pedidos"
- Click → navegar a /pedidos/[id]
- Estado vacío: "No tienes pedidos aún"
- No accesible para Kiosk

## Dependencies
- Pedidos - Componente OrderCard
- Pedidos - Mock Data

## Estimación: 2 SP`,
        tags: ['organismo', 'ui', 'orders'],
      },
      {
        name: 'Pedidos - Vista Detalle de Pedido',
        description: `Vista de detalle de un pedido.

## Archivos
- src/features/orders/ui/views/order-detail.tsx
- src/app/(authenticated)/pedidos/[id]/page.tsx

## Detalle
- Header: código, fecha, estado (badge)
- OrderTimeline
- Lista de items: imagen, nombre, variante, condición, cantidad, precio, subtotal
- Total del pedido
- Breadcrumb: Pedidos > #KSP-001

## Dependencies
- Pedidos - Componente OrderTimeline
- Pedidos - Mock Data

## Criterios de Aceptación
- Datos del pedido correctos
- Timeline muestra estados

## Estimación: 3 SP`,
        tags: ['organismo', 'ui', 'orders'],
      },
    ],
  },
  {
    name: 'Wishlist - Domain y Vista',
    folder: '4. Cuenta de Usuario',
    tasks: [
      {
        name: 'Wishlist - Domain Types',
        description: `Tipos de dominio para wishlist.

## Archivos
- src/features/wishlist/domain/types.ts

## Detalle
- IWishlistItem { id, cardId, cardName, cardImage, setName, addedAt, inStock, lowestPrice }

## Estimación: 1 SP`,
        tags: ['atomo', 'domain', 'wishlist'],
      },
      {
        name: 'Wishlist - Mock Data',
        description: `Mock data para wishlist.

## Archivos
- src/features/wishlist/adapters/api/wishlist.mock.ts

## Detalle
- MOCK_WISHLIST: 6-8 cartas (mezcla en stock y agotadas)
- mockGetWishlist(tcg) → filtrar por TCG
- mockAddToWishlist(cardId) → success
- mockRemoveFromWishlist(cardId) → success

## Dependencies
- Wishlist - Domain Types

## Estimación: 1 SP`,
        tags: ['atomo', 'adapters', 'wishlist'],
      },
      {
        name: 'Wishlist - Componente WishlistItem',
        description: `Componente de item de wishlist.

## Archivos
- src/features/wishlist/ui/components/wishlist-item.tsx

## Detalle
- Props: item (IWishlistItem), onRemove, onAddToCart
- Imagen, nombre, set
- Badge: "En stock" (verde) o "Agotado" (gris)
- Precio más bajo (si en stock)
- Botón "Agregar al carrito" (si en stock)
- Botón "Quitar" (icono X)

## Dependencies
- Wishlist - Domain Types

## Estimación: 2 SP`,
        tags: ['atomo', 'ui', 'wishlist'],
      },
      {
        name: 'Wishlist - Vista de Lista de Deseos',
        description: `Vista principal de la wishlist.

## Archivos
- src/features/wishlist/ui/views/wishlist.tsx
- src/app/(authenticated)/wishlist/page.tsx

## Detalle
- Grid de WishlistItems (2 cols móvil, 3 tablet, 4 desktop)
- Título "Mi Wishlist"
- Estado vacío: "Tu wishlist está vacía" + link "Explorar catálogo"
- No accesible para Kiosk ni Público

## Dependencies
- Wishlist - Componente WishlistItem
- Wishlist - Mock Data

## Criterios de Aceptación
- Items se muestran correctamente
- Agregar al carrito funciona
- Quitar de wishlist funciona

## Estimación: 2 SP`,
        tags: ['organismo', 'ui', 'wishlist'],
      },
    ],
  },

  // ── 5. Páginas Públicas ───────────────────────────────
  {
    name: 'Most Wanted',
    folder: '5. Páginas Públicas',
    tasks: [
      {
        name: 'Most Wanted - Domain Types',
        description: `Tipos de dominio para Most Wanted.

## Archivos
- src/features/most-wanted/domain/types.ts

## Detalle
- IMostWantedCard { id, cardName, cardImage, setName, notes, tcgType }

## Estimación: 1 SP`,
        tags: ['atomo', 'domain', 'most-wanted'],
      },
      {
        name: 'Most Wanted - Mock Data',
        description: `Mock data para Most Wanted.

## Archivos
- src/features/most-wanted/adapters/api/most-wanted.mock.ts

## Detalle
- MOCK_MOST_WANTED: 10-15 cartas por TCG
- mockGetMostWanted(tcg) → filtrar por TCG

## Dependencies
- Most Wanted - Domain Types

## Estimación: 1 SP`,
        tags: ['atomo', 'adapters', 'most-wanted'],
      },
      {
        name: 'Most Wanted - Componente MostWantedCard',
        description: `Card de carta most wanted.

## Archivos
- src/features/most-wanted/ui/components/most-wanted-card.tsx

## Detalle
- Props: card (IMostWantedCard)
- Imagen grande de carta
- Nombre, set, notas
- Diseño optimizado para visibilidad a distancia (TV)

## Estimación: 1 SP`,
        tags: ['atomo', 'ui', 'most-wanted'],
      },
      {
        name: 'Most Wanted - Vista Página Pública',
        description: `Página pública de Most Wanted.

## Archivos
- src/features/most-wanted/ui/views/most-wanted.tsx
- src/app/(public)/most-wanted/page.tsx

## Detalle
- Layout fullscreen (sin header/footer)
- Título "Most Wanted" + logo TCG
- Grid de MostWantedCards (3-4 cols)
- Auto-refresh cada 60 segundos
- Animación de entrada (fade in)
- Fondo oscuro para contraste

## Dependencies
- Most Wanted - Componente MostWantedCard
- Most Wanted - Mock Data

## Criterios de Aceptación
- Fullscreen sin navegación
- Auto-refresh funcional
- Legible a distancia

## Estimación: 3 SP`,
        tags: ['organismo', 'ui', 'most-wanted'],
      },
    ],
  },
  {
    name: 'Testing Integral',
    folder: '5. Páginas Públicas',
    tasks: [
      {
        name: 'Testing - Flujo Completo Público (Sin Auth)',
        description: `Verificar flujo completo de usuario público.

## Detalle
- Navegar catálogo
- Buscar carta
- Filtrar por set/rareza
- Ver detalle de carta
- Intentar agregar al carrito → redirige a login
- Ver Most Wanted

## Estimación: 2 SP`,
        tags: ['organismo', 'testing'],
      },
      {
        name: 'Testing - Flujo Completo Cliente (Auth)',
        description: `Verificar flujo completo de usuario autenticado.

## Detalle
- Login como cliente
- Navegar catálogo
- Agregar cartas al carrito
- Ver carrito, modificar cantidades
- Checkout → validación de stock
- Geofencing → confirmar pedido
- Ver historial de pedidos
- Ver detalle de pedido
- Agregar/quitar de wishlist
- Editar perfil
- Logout

## Estimación: 3 SP`,
        tags: ['organismo', 'testing'],
      },
      {
        name: 'Testing - Flujo Kiosk',
        description: `Verificar flujo de modo Kiosk.

## Detalle
- Login como kiosk
- Navegar catálogo
- Agregar al carrito
- Checkout → formulario nombre+email
- Confirmar pedido
- Verificar que no puede acceder a perfil/pedidos/wishlist

## Estimación: 2 SP`,
        tags: ['molecula', 'testing', 'kiosk'],
      },
    ],
  },
];
