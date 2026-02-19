# Estructura ClickUp para Kidstop Carpeta Digital

Organización atómica de tareas en ClickUp para la Carpeta Digital. Cada tarea tiene un scope claro, archivos específicos a crear/modificar y estimación máxima de 5 SP. Tareas más grandes se dividen en múltiples tareas independientes.

## Estructura Propuesta

### **Space: Kidstop Carpeta Digital**
```
📦 Kidstop Carpeta Digital
```

---

### **Folders y Listas**

#### **📁 0. Config**
- Lista: Setup Inicial
- Lista: Documentación

#### **📁 1. Fundamentos**
- Lista: Layout - Componentes Base
- Lista: Layout - Layouts y Rutas
- Lista: TCG por Dominio
- Lista: Auth - Domain y Adapters
- Lista: Auth - Vistas

#### **📁 2. Catálogo**
- Lista: Catálogo - Domain y Mocks
- Lista: Catálogo - Componentes
- Lista: Catálogo - Vistas
- Lista: Catálogo - Filtros y Búsqueda

#### **📁 3. Carrito y Checkout**
- Lista: Carrito - Store y Domain
- Lista: Carrito - Vista
- Lista: Checkout - Flujo Principal
- Lista: Checkout - Geofencing
- Lista: Checkout - Modo Kiosk

#### **📁 4. Cuenta de Usuario**
- Lista: Perfil - Domain y Vista
- Lista: Pedidos - Domain y Vistas
- Lista: Wishlist - Domain y Vista

#### **📁 5. Páginas Públicas**
- Lista: Most Wanted
- Lista: Testing Integral

---

## 📁 0. Config

### **Lista: Setup Inicial**

#### Tarea: Config - Inicializar Repositorio
```
Título: Config - Inicializar Repositorio
Status: DONE
Priority: Alta
Tags: #atomo #config
Estimación: 1 SP

Scope:
Clonar repo, copiar template del backoffice, instalar dependencias.

Archivos:
- package.json
- tsconfig.json
- next.config.ts
- hero.ts, postcss.config.mjs, eslint.config.mjs
- .prettierrc, .prettierignore, .gitignore
- codegen.ts
- .env.example

Criterios de Aceptación:
☐ npm install sin errores
☐ npx tsc --noEmit sin errores
☐ npm run dev levanta correctamente
```

#### Tarea: Config - Variables de Entorno
```
Título: Config - Variables de Entorno y .env.example
Status: DONE
Priority: Alta
Tags: #atomo #config
Estimación: 1 SP

Scope:
Crear .env.example con todas las variables necesarias.

Archivos:
- .env.example

Criterios de Aceptación:
☐ Documentadas: GRAPHQL_ENDPOINT, TCG_TYPE, GOOGLE_MAPS_API_KEY, coordenadas tienda
```

#### Tarea: Config - Workflow de Desarrollo
```
Título: Config - Copiar Workflow work-on-task
Status: DONE
Priority: Alta
Tags: #atomo #config #docs
Estimación: 1 SP

Scope:
Copiar .windsurf/workflows/work-on-task.md del backoffice.

Archivos:
- .windsurf/workflows/work-on-task.md
```

### **Lista: Documentación**

#### Tarea: Docs - README del Proyecto
```
Título: Docs - README del Proyecto
Status: DONE
Priority: Alta
Tags: #atomo #docs
Estimación: 1 SP

Archivos:
- README.md
```

#### Tarea: Docs - ARCHITECTURE.md
```
Título: Docs - Documentación de Arquitectura
Status: DONE
Priority: Alta
Tags: #atomo #docs
Estimación: 1 SP

Archivos:
- docs/ARCHITECTURE.md
```

---

## 📁 1. Fundamentos

### **Lista: Layout - Componentes Base**

#### Tarea: Layout - Componente Header
```
Título: Layout - Componente Header
Status: TO DO
Priority: Alta
Tags: #molecula #ui #layout
Estimación: 3 SP

Scope:
Header principal de la aplicación. Logo a la izquierda, barra de búsqueda al centro, iconos a la derecha.

Archivos:
- src/shared/layouts/header.tsx

Detalle:
☐ Logo de Kidstop (dinámico según TCG)
☐ Barra de búsqueda (input con icono, solo visual por ahora)
☐ Icono de carrito con badge de cantidad (lee de useCartStore)
☐ Icono de wishlist (solo si autenticado y no Kiosk)
☐ Botón login / avatar de usuario (condicional según auth)
☐ Responsive: en móvil ocultar búsqueda, mostrar icono hamburger

Criterios de Aceptación:
☐ Header visible en todas las páginas
☐ Badge de carrito muestra cantidad del store
☐ Responsive: móvil, tablet, desktop
```

#### Tarea: Layout - Componente Footer
```
Título: Layout - Componente Footer
Status: TO DO
Priority: Alta
Tags: #atomo #ui #layout
Estimación: 2 SP

Scope:
Footer simple con info de la tienda.

Archivos:
- src/shared/layouts/footer.tsx

Detalle:
☐ Logo pequeño
☐ Dirección de la tienda
☐ Horario
☐ Links a redes sociales (iconos)
☐ Copyright
☐ Responsive

Criterios de Aceptación:
☐ Footer visible en todas las páginas públicas y autenticadas
☐ Responsive
```

#### Tarea: Layout - Navegación Móvil (Drawer)
```
Título: Layout - Navegación Móvil (Drawer)
Status: TO DO
Priority: Alta
Tags: #molecula #ui #layout
Dependencies: Layout - Componente Header
Estimación: 3 SP

Scope:
Drawer lateral que se abre al tocar hamburger en móvil. Contiene navegación completa.

Archivos:
- src/shared/layouts/mobile-drawer.tsx

Detalle:
☐ Drawer con animación (Framer Motion o HeroUI Drawer)
☐ Links: Catálogo, Carrito, Wishlist (si auth), Pedidos (si auth), Perfil (si auth)
☐ Botón Login/Logout
☐ Indicador de TCG activo
☐ Cerrar al navegar

Criterios de Aceptación:
☐ Se abre/cierra con animación suave
☐ Links funcionales
☐ Se cierra al hacer click en un link
```

#### Tarea: Layout - Componente SearchBar
```
Título: Layout - Componente SearchBar
Status: TO DO
Priority: Media
Tags: #atomo #ui #layout #catalog
Estimación: 2 SP

Scope:
Barra de búsqueda reutilizable para header y catálogo.

Archivos:
- src/shared/base/search-bar.tsx

Detalle:
☐ Input con icono de búsqueda
☐ Placeholder dinámico según TCG ("Buscar cartas Pokémon..." / "Buscar cartas Magic...")
☐ Prop onSearch callback
☐ Debounce de 300ms
☐ Botón limpiar (X)

Criterios de Aceptación:
☐ Debounce funcional
☐ Callback ejecuta con el valor
```

### **Lista: Layout - Layouts y Rutas**

#### Tarea: Layout - Public Layout
```
Título: Layout - Public Layout (Wrapper)
Status: TO DO
Priority: Alta
Tags: #molecula #ui #layout
Dependencies: Layout - Componente Header, Layout - Componente Footer
Estimación: 2 SP

Scope:
Layout wrapper para rutas públicas (catálogo, most-wanted, login, registro).

Archivos:
- src/app/(public)/layout.tsx

Detalle:
☐ Importar Header y Footer
☐ Slot para children
☐ Aplicar useTcgTheme() para colores dinámicos
☐ Min-height: 100vh

Criterios de Aceptación:
☐ Header y footer visibles
☐ Tema TCG aplicado
```

#### Tarea: Layout - Authenticated Layout
```
Título: Layout - Authenticated Layout (Wrapper)
Status: TO DO
Priority: Alta
Tags: #molecula #ui #layout
Dependencies: Layout - Public Layout
Estimación: 2 SP

Scope:
Layout wrapper para rutas protegidas. Extiende el público con menú de usuario.

Archivos:
- src/app/(authenticated)/layout.tsx

Detalle:
☐ Reutilizar Header con variante autenticada (avatar, menú dropdown)
☐ Menú dropdown: Perfil, Mis Pedidos, Wishlist, Cerrar Sesión
☐ Si Kiosk: ocultar Perfil, Pedidos, Wishlist del menú
☐ Footer igual que público

Criterios de Aceptación:
☐ Menú de usuario funcional
☐ Kiosk no ve opciones restringidas
```

#### Tarea: Layout - Not Authenticated Layout
```
Título: Layout - Not Authenticated Layout
Status: TO DO
Priority: Media
Tags: #atomo #ui #layout
Estimación: 1 SP

Scope:
Layout para login/registro/recuperar contraseña. Centrado, sin header completo.

Archivos:
- src/app/(not-authenticated)/layout.tsx

Detalle:
☐ Logo centrado arriba
☐ Card centrada con el formulario (children)
☐ Link "Volver al catálogo"
☐ Tema TCG aplicado

Criterios de Aceptación:
☐ Diseño centrado y limpio
```

#### Tarea: Layout - Página 404 (Not Found)
```
Título: Layout - Página 404
Status: TO DO
Priority: Baja
Tags: #atomo #ui #layout
Estimación: 1 SP

Archivos:
- src/app/not-found.tsx

Detalle:
☐ Mensaje "Página no encontrada"
☐ Link "Volver al catálogo"
☐ Diseño consistente con el tema
```

### **Lista: TCG por Dominio**

#### Tarea: TCG - Utilidad de Detección por Hostname
```
Título: TCG - Utilidad de Detección por Hostname
Status: DONE
Priority: Alta
Tags: #atomo #utils #tcg
Estimación: 1 SP

Archivos:
- src/lib/utils/get-tcg-from-domain.ts
- src/lib/store/tcg-context.ts
```

#### Tarea: TCG - Constantes de Temas
```
Título: TCG - Verificar Constantes de Temas
Status: TO DO
Priority: Alta
Tags: #atomo #domain #tcg
Estimación: 1 SP

Scope:
Verificar que tcg-themes.ts tiene los colores correctos para carpeta digital.

Archivos:
- src/lib/consts/tcg-themes.ts

Detalle:
☐ Pokémon: rojo (#e53223), fondo claro
☐ Magic: naranja/oscuro, fondo oscuro
☐ Propiedades: accent, pageBg, headerBg, textPrimary
☐ Eliminar propiedades de sidebar (no aplica)

Criterios de Aceptación:
☐ Temas visualmente distintos entre Pokémon y Magic
```

#### Tarea: TCG - Logo Dinámico por TCG
```
Título: TCG - Logo Dinámico por TCG
Status: TO DO
Priority: Alta
Tags: #atomo #ui #tcg
Dependencies: TCG - Verificar Constantes de Temas
Estimación: 1 SP

Scope:
Componente que renderiza el logo correcto según el TCG del dominio.

Archivos:
- src/shared/base/tcg-logo.tsx
- src/assets/img/logo-pokemon.svg
- src/assets/img/logo-magic.svg

Detalle:
☐ Leer TCG de useTCGContext()
☐ Renderizar imagen correspondiente
☐ Props: size (sm, md, lg)
```

#### Tarea: TCG - Metadata Dinámica
```
Título: TCG - Metadata Dinámica (Título y Favicon)
Status: TO DO
Priority: Media
Tags: #atomo #utils #tcg
Estimación: 2 SP

Archivos:
- src/app/layout.tsx (modificar metadata)
- public/favicon-pokemon.ico
- public/favicon-magic.ico

Detalle:
☐ Título: "Kidstop - Pokémon TCG" o "Kidstop - Magic: The Gathering"
☐ Favicon dinámico según TCG
☐ Meta description adaptada
```

### **Lista: Auth - Domain y Adapters**

#### Tarea: Auth - Domain Types
```
Título: Auth - Domain Types y Constants
Status: TO DO
Priority: Alta
Tags: #atomo #domain #auth
Estimación: 1 SP

Archivos:
- src/features/auth/domain/types.ts
- src/features/auth/domain/constants.ts

Detalle:
☐ ILoginForm { email, password }
☐ IRegisterForm { name, email, phone, password, confirmPassword }
☐ IForgotPasswordForm { email }
☐ IAuthUser { id, name, email, phone, role }
☐ Constantes: AUTH_ERRORS, AUTH_ROUTES
```

#### Tarea: Auth - Login Form Schema
```
Título: Auth - Login Form Schema (Zod)
Status: TO DO
Priority: Alta
Tags: #atomo #forms #auth
Dependencies: Auth - Domain Types
Estimación: 1 SP

Archivos:
- src/features/auth/adapters/forms/login.schema.ts
- src/features/auth/adapters/forms/use-login-form.ts

Detalle:
☐ email: string().email()
☐ password: string().min(8)
☐ Hook con zodResolver y defaultValues
```

#### Tarea: Auth - Register Form Schema
```
Título: Auth - Register Form Schema (Zod)
Status: TO DO
Priority: Alta
Tags: #atomo #forms #auth
Dependencies: Auth - Domain Types
Estimación: 2 SP

Archivos:
- src/features/auth/adapters/forms/register.schema.ts
- src/features/auth/adapters/forms/use-register-form.ts

Detalle:
☐ name: string().min(2)
☐ email: string().email()
☐ phone: string().min(10)
☐ password: string().min(8)
☐ confirmPassword: string() + refine para match
☐ Hook con zodResolver y defaultValues
```

#### Tarea: Auth - Forgot Password Form Schema
```
Título: Auth - Forgot Password Form Schema (Zod)
Status: TO DO
Priority: Media
Tags: #atomo #forms #auth
Dependencies: Auth - Domain Types
Estimación: 1 SP

Archivos:
- src/features/auth/adapters/forms/forgot-password.schema.ts
- src/features/auth/adapters/forms/use-forgot-password-form.ts

Detalle:
☐ email: string().email()
☐ Hook con zodResolver
```

#### Tarea: Auth - Mock API
```
Título: Auth - Mock API (Login, Register, Forgot Password)
Status: TO DO
Priority: Alta
Tags: #atomo #adapters #auth
Dependencies: Auth - Domain Types
Estimación: 2 SP

Scope:
Funciones mock que simulan las respuestas del backend.

Archivos:
- src/features/auth/adapters/api/auth.mock.ts

Detalle:
☐ mockLogin(email, password) → { user, access_token } o throw
☐ mockRegister(data) → { user, access_token }
☐ mockForgotPassword(email) → { success: true }
☐ Usuarios mock: cliente@test.com, vip@test.com, kiosk@test.com
☐ Simular delay de 500ms

Criterios de Aceptación:
☐ Login con credenciales mock funciona
☐ Login con credenciales incorrectas lanza error
☐ Registro siempre exitoso
```

#### Tarea: Auth - Mappers
```
Título: Auth - Mappers (Form → API Input)
Status: TO DO
Priority: Alta
Tags: #atomo #adapters #auth
Dependencies: Auth - Domain Types
Estimación: 1 SP

Archivos:
- src/features/auth/adapters/mappers/auth.mapper.ts

Detalle:
☐ toLoginInput(form: LoginForm) → LoginInput
☐ toRegisterInput(form: RegisterForm) → RegisterInput
```

### **Lista: Auth - Vistas**

#### Tarea: Auth - Vista Login
```
Título: Auth - Vista Login
Status: TO DO
Priority: Alta
Tags: #organismo #ui #auth
Dependencies: Auth - Login Form Schema, Auth - Mock API
Estimación: 3 SP

Scope:
Página de login con formulario, validación y mock.

Archivos:
- src/features/auth/ui/views/login.tsx
- src/app/(not-authenticated)/login/page.tsx

Detalle:
☐ Formulario con useLoginForm()
☐ Campos: email, password
☐ Botón "Iniciar Sesión"
☐ Link "¿Olvidaste tu contraseña?"
☐ Link "¿No tienes cuenta? Regístrate"
☐ onSubmit → mockLogin → processLogin → redirect a /
☐ Toast de error si falla
☐ Loading state en botón

Criterios de Aceptación:
☐ Login con cliente@test.com / password123 redirige a catálogo
☐ Login con credenciales incorrectas muestra toast de error
☐ Validación Zod muestra errores inline
```

#### Tarea: Auth - Vista Registro
```
Título: Auth - Vista Registro
Status: TO DO
Priority: Alta
Tags: #organismo #ui #auth
Dependencies: Auth - Register Form Schema, Auth - Mock API
Estimación: 3 SP

Archivos:
- src/features/auth/ui/views/register.tsx
- src/app/(not-authenticated)/registro/page.tsx

Detalle:
☐ Formulario con useRegisterForm()
☐ Campos: nombre, email, teléfono, contraseña, confirmar contraseña
☐ Botón "Crear Cuenta"
☐ Link "¿Ya tienes cuenta? Inicia sesión"
☐ onSubmit → mockRegister → processLogin → redirect a /
☐ Toast de éxito/error
☐ Loading state

Criterios de Aceptación:
☐ Registro exitoso redirige a catálogo
☐ Validación de confirmPassword funciona
☐ Errores inline visibles
```

#### Tarea: Auth - Vista Recuperar Contraseña
```
Título: Auth - Vista Recuperar Contraseña
Status: TO DO
Priority: Media
Tags: #molecula #ui #auth
Dependencies: Auth - Forgot Password Form Schema, Auth - Mock API
Estimación: 2 SP

Archivos:
- src/features/auth/ui/views/forgot-password.tsx
- src/app/(not-authenticated)/recuperar-contrasena/page.tsx

Detalle:
☐ Formulario con useForgotPasswordForm()
☐ Campo: email
☐ Botón "Enviar enlace"
☐ Estado de éxito: "Revisa tu correo electrónico"
☐ Link "Volver a login"

Criterios de Aceptación:
☐ Envío muestra pantalla de confirmación
☐ Link de regreso a login funciona
```

#### Tarea: Auth - API Routes (Cookies)
```
Título: Auth - API Routes para Cookies de Sesión
Status: TO DO
Priority: Alta
Tags: #atomo #adapters #auth
Estimación: 2 SP

Scope:
API routes de Next.js para manejar cookies HTTP-only de sesión.

Archivos:
- src/app/api/login/route.ts
- src/app/api/logout/route.ts

Detalle:
☐ POST /api/login → set cookies (jwt, role)
☐ POST /api/logout → delete cookies
☐ Cookies HTTP-only, secure, sameSite: lax

Criterios de Aceptación:
☐ Después de login, cookies visibles en DevTools
☐ Después de logout, cookies eliminadas
☐ Middleware proxy.ts lee cookies correctamente
```

---

## 📁 2. Catálogo

### **Lista: Catálogo - Domain y Mocks**

#### Tarea: Catálogo - Domain Types
```
Título: Catálogo - Domain Types
Status: TO DO
Priority: Alta
Tags: #atomo #domain #catalog
Estimación: 1 SP

Archivos:
- src/features/catalog/domain/types.ts
- src/features/catalog/domain/constants.ts

Detalle:
☐ ICatalogCard { id, name, setName, setCode, number, rarity, image, tcgType }
☐ ICardVariant { id, name, condition, price, stock }
☐ ICardDetail extends ICatalogCard { variants, description }
☐ ICatalogFilters { search, setCode, rarity, priceMin, priceMax, inStockOnly }
☐ Constantes: RARITIES, SORT_OPTIONS, DEFAULT_FILTERS
```

#### Tarea: Catálogo - Mock Data
```
Título: Catálogo - Mock Data (Cartas Pokémon y Magic)
Status: TO DO
Priority: Alta
Tags: #atomo #adapters #catalog
Dependencies: Catálogo - Domain Types
Estimación: 2 SP

Scope:
Datos mock realistas para el catálogo. Mínimo 20 cartas Pokémon y 20 Magic.

Archivos:
- src/features/catalog/adapters/api/catalog.mock.ts

Detalle:
☐ MOCK_POKEMON_CARDS: 20+ cartas con datos reales (Charizard, Pikachu, etc.)
☐ MOCK_MAGIC_CARDS: 20+ cartas con datos reales (Black Lotus, Lightning Bolt, etc.)
☐ Cada carta con 1-3 variantes y condiciones
☐ Precios realistas (USD)
☐ Stock variado (0-10)
☐ Imágenes de pokemontcg.io y scryfall.io
☐ mockGetCatalog(tcg, filters) → filtrar y retornar
☐ mockGetCardDetail(id) → retornar carta con variantes
☐ Simular delay de 300ms

Criterios de Aceptación:
☐ Filtro por TCG funciona
☐ Búsqueda por nombre funciona
☐ Detalle retorna variantes
```

#### Tarea: Catálogo - Hook useCatalog
```
Título: Catálogo - Hook useCatalog
Status: TO DO
Priority: Alta
Tags: #atomo #ui #catalog
Dependencies: Catálogo - Mock Data
Estimación: 2 SP

Archivos:
- src/features/catalog/ui/hooks/use-catalog.ts

Detalle:
☐ Parámetros: filters (ICatalogFilters)
☐ Lee TCG de useTCGContext()
☐ Llama mockGetCatalog(tcg, filters)
☐ Retorna: { cards, loading, totalCount, refetch }
☐ Manejo de loading state
```

#### Tarea: Catálogo - Hook useCardDetail
```
Título: Catálogo - Hook useCardDetail
Status: TO DO
Priority: Alta
Tags: #atomo #ui #catalog
Dependencies: Catálogo - Mock Data
Estimación: 1 SP

Archivos:
- src/features/catalog/ui/hooks/use-card-detail.ts

Detalle:
☐ Parámetro: cardId (string)
☐ Llama mockGetCardDetail(cardId)
☐ Retorna: { card, loading, error }
```

### **Lista: Catálogo - Componentes**

#### Tarea: Catálogo - Componente CardItem
```
Título: Catálogo - Componente CardItem
Status: TO DO
Priority: Alta
Tags: #atomo #ui #catalog
Dependencies: Catálogo - Domain Types
Estimación: 2 SP

Archivos:
- src/features/catalog/ui/components/card-item.tsx

Detalle:
☐ Props: card (ICatalogCard), onAddToCart?, onViewDetail?
☐ Imagen con Next/Image (aspect-ratio de carta TCG)
☐ Nombre de la carta (truncado si largo)
☐ Set / edición
☐ Precio desde (el más bajo de las variantes)
☐ Badge de stock: "Disponible" (verde) o "Agotado" (gris)
☐ Hover: scale sutil + sombra
☐ Click → onViewDetail
```

#### Tarea: Catálogo - Componente CardGrid
```
Título: Catálogo - Componente CardGrid
Status: TO DO
Priority: Alta
Tags: #molecula #ui #catalog
Dependencies: Catálogo - Componente CardItem
Estimación: 2 SP

Archivos:
- src/features/catalog/ui/components/card-grid.tsx

Detalle:
☐ Props: cards (ICatalogCard[]), loading, onCardClick
☐ Grid: 2 cols móvil, 3 tablet, 4 desktop, 5 desktop-xl
☐ Loading: skeleton cards (6-12 placeholders)
☐ Empty state: "No se encontraron cartas" con ilustración
☐ Gap consistente
```

#### Tarea: Catálogo - Componente CardSkeleton
```
Título: Catálogo - Componente CardSkeleton
Status: TO DO
Priority: Baja
Tags: #atomo #ui #catalog
Estimación: 1 SP

Archivos:
- src/features/catalog/ui/components/card-skeleton.tsx

Detalle:
☐ Skeleton con forma de CardItem
☐ Animación pulse
☐ Props: count (número de skeletons a mostrar)
```

#### Tarea: Catálogo - Componente VariantSelector
```
Título: Catálogo - Componente VariantSelector
Status: TO DO
Priority: Alta
Tags: #atomo #ui #catalog
Estimación: 2 SP

Archivos:
- src/features/catalog/ui/components/variant-selector.tsx

Detalle:
☐ Props: variants (ICardVariant[]), selectedVariant, onSelect
☐ Tabs o radio buttons para variante (Normal, Holo, Reverse, etc.)
☐ Dropdown para condición (NM, LP, MP, HP, DMG)
☐ Mostrar precio y stock de la combinación seleccionada
☐ Deshabilitar combinaciones sin stock
```

#### Tarea: Catálogo - Componente QuantitySelector (Shared)
```
Título: Catálogo - Componente QuantitySelector (Shared)
Status: TO DO
Priority: Alta
Tags: #atomo #ui #catalog #cart
Estimación: 1 SP

Archivos:
- src/shared/base/quantity-selector.tsx

Detalle:
☐ Props: value, min (1), max (stock), onChange
☐ Botones +/- con input numérico
☐ Deshabilitar - si value === min
☐ Deshabilitar + si value === max
```

#### Tarea: Catálogo - Componente AddToCartButton
```
Título: Catálogo - Componente AddToCartButton
Status: TO DO
Priority: Alta
Tags: #atomo #ui #catalog #cart
Dependencies: Carrito - Store Zustand
Estimación: 1 SP

Archivos:
- src/features/catalog/ui/components/add-to-cart-button.tsx

Detalle:
☐ Props: card, variant, condition, quantity
☐ Si no autenticado: redirigir a login
☐ Si stock === 0: botón deshabilitado "Agotado"
☐ onClick → useCartStore().addItem(...)
☐ Toast "Agregado al carrito"
```

#### Tarea: Catálogo - Componente AddToWishlistButton
```
Título: Catálogo - Componente AddToWishlistButton
Status: TO DO
Priority: Media
Tags: #atomo #ui #catalog #wishlist
Estimación: 1 SP

Archivos:
- src/features/catalog/ui/components/add-to-wishlist-button.tsx

Detalle:
☐ Props: cardId, isInWishlist
☐ Icono corazón (lleno si ya está, vacío si no)
☐ Si no autenticado o Kiosk: no mostrar
☐ onClick → toggle wishlist (mock)
☐ Toast "Agregado a wishlist" / "Removido de wishlist"
```

### **Lista: Catálogo - Vistas**

#### Tarea: Catálogo - Vista Principal (Grid)
```
Título: Catálogo - Vista Principal (Grid de Cartas)
Status: TO DO
Priority: Alta
Tags: #organismo #ui #catalog
Dependencies: Catálogo - Componente CardGrid, Catálogo - Hook useCatalog
Estimación: 3 SP

Archivos:
- src/features/catalog/ui/views/catalog.tsx
- src/app/(public)/page.tsx (importar vista)

Detalle:
☐ SearchBar arriba
☐ Botón "Filtros" (abre panel/drawer)
☐ CardGrid con resultados
☐ Contador de resultados ("24 cartas encontradas")
☐ Click en carta → navegar a /carta/[id]
☐ useCatalog(filters) para datos

Criterios de Aceptación:
☐ Página carga con cartas mock
☐ Búsqueda filtra en tiempo real
☐ Click navega a detalle
```

#### Tarea: Catálogo - Vista Detalle de Carta
```
Título: Catálogo - Vista Detalle de Carta
Status: TO DO
Priority: Alta
Tags: #organismo #ui #catalog
Dependencies: Catálogo - Hook useCardDetail, Catálogo - Componente VariantSelector
Estimación: 3 SP

Archivos:
- src/features/catalog/ui/views/card-detail.tsx
- src/app/(public)/carta/[id]/page.tsx

Detalle:
☐ Layout: imagen a la izquierda, info a la derecha
☐ Nombre, set, número, rareza
☐ VariantSelector
☐ Precio de la variante+condición seleccionada
☐ Stock disponible
☐ QuantitySelector
☐ AddToCartButton
☐ AddToWishlistButton
☐ Breadcrumb: Catálogo > [Set] > [Carta]
☐ Mobile: imagen arriba, info abajo

Criterios de Aceptación:
☐ Cambiar variante/condición actualiza precio y stock
☐ Agregar al carrito funciona
☐ Responsive
```

### **Lista: Catálogo - Filtros y Búsqueda**

#### Tarea: Catálogo - Panel de Filtros (Desktop)
```
Título: Catálogo - Panel de Filtros (Desktop Sidebar)
Status: TO DO
Priority: Media
Tags: #molecula #ui #catalog
Dependencies: Catálogo - Domain Types
Estimación: 3 SP

Archivos:
- src/features/catalog/ui/components/catalog-filters.tsx

Detalle:
☐ Filtro por set/edición (dropdown con búsqueda)
☐ Filtro por rareza (checkboxes)
☐ Filtro por rango de precio (inputs min/max)
☐ Filtro por disponibilidad (toggle "Solo en stock")
☐ Botón "Limpiar filtros"
☐ Callback onFiltersChange(filters)
☐ Desktop: sidebar lateral izquierda
```

#### Tarea: Catálogo - Filtro Drawer Móvil
```
Título: Catálogo - Filtro Drawer Móvil
Status: TO DO
Priority: Media
Tags: #molecula #ui #catalog
Dependencies: Catálogo - Panel de Filtros (Desktop)
Estimación: 2 SP

Archivos:
- src/features/catalog/ui/components/catalog-filters-drawer.tsx

Detalle:
☐ Botón "Filtros" visible solo en móvil
☐ Abre drawer/sheet desde abajo
☐ Reutiliza CatalogFilters internamente
☐ Botón "Aplicar" cierra drawer
☐ Badge con número de filtros activos
```

---

## 📁 3. Carrito y Checkout

### **Lista: Carrito - Store y Domain**

#### Tarea: Carrito - Domain Types
```
Título: Carrito - Domain Types
Status: TO DO
Priority: Alta
Tags: #atomo #domain #cart
Estimación: 1 SP

Archivos:
- src/features/cart/domain/types.ts
- src/features/cart/domain/constants.ts

Detalle:
☐ ICartItem { cardId, cardName, cardImage, setName, variantId, variantName, condition, quantity, unitPrice }
☐ ICartSummary { totalItems, totalPrice }
☐ IStockValidationResult { available: ICartItem[], unavailable: ICartItem[] }
☐ Constantes: MAX_QUANTITY_PER_ITEM (10)
```

#### Tarea: Carrito - Store Zustand (Ajustar)
```
Título: Carrito - Store Zustand (Verificar y Ajustar)
Status: TO DO
Priority: Alta
Tags: #atomo #store #cart
Dependencies: Carrito - Domain Types
Estimación: 2 SP

Scope:
El store base ya existe (cart.ts). Verificar que usa los tipos de domain y agregar funcionalidad faltante.

Archivos:
- src/lib/store/cart.ts (modificar)

Detalle:
☐ Verificar que CartItem usa tipos de domain/types.ts
☐ Agregar getItemCount(cardId, variantId, condition) → number
☐ Agregar isInCart(cardId) → boolean
☐ Verificar persistencia en localStorage

Criterios de Aceptación:
☐ addItem con item existente incrementa cantidad
☐ removeItem elimina correctamente
☐ Persiste entre recargas
```

### **Lista: Carrito - Vista**

#### Tarea: Carrito - Componente CartItem
```
Título: Carrito - Componente CartItem (Fila de Item)
Status: TO DO
Priority: Alta
Tags: #molecula #ui #cart
Dependencies: Carrito - Domain Types
Estimación: 2 SP

Archivos:
- src/features/cart/ui/components/cart-item.tsx

Detalle:
☐ Props: item (ICartItem), onRemove, onUpdateQuantity
☐ Imagen de carta (pequeña)
☐ Nombre, set, variante, condición
☐ Precio unitario
☐ QuantitySelector (reutilizar shared/base)
☐ Subtotal (cantidad × precio)
☐ Botón eliminar (icono trash)
☐ Mobile: layout vertical compacto
```

#### Tarea: Carrito - Componente CartSummary
```
Título: Carrito - Componente CartSummary
Status: TO DO
Priority: Alta
Tags: #atomo #ui #cart
Estimación: 1 SP

Archivos:
- src/features/cart/ui/components/cart-summary.tsx

Detalle:
☐ Props: totalItems, totalPrice
☐ Mostrar total de items
☐ Mostrar precio total formateado (USD)
☐ Botón "Continuar al Checkout"
☐ Link "Seguir comprando" → /
```

#### Tarea: Carrito - Vista de Carrito
```
Título: Carrito - Vista de Carrito
Status: TO DO
Priority: Alta
Tags: #organismo #ui #cart
Dependencies: Carrito - Componente CartItem, Carrito - Componente CartSummary
Estimación: 3 SP

Archivos:
- src/features/cart/ui/views/cart.tsx
- src/app/(authenticated)/carrito/page.tsx

Detalle:
☐ Lista de CartItems
☐ CartSummary a la derecha (desktop) o abajo (mobile)
☐ Estado vacío: "Tu carrito está vacío" + link "Explorar catálogo"
☐ Lee items de useCartStore()
☐ Título "Mi Carrito (X items)"

Criterios de Aceptación:
☐ Items del store se muestran
☐ Modificar cantidad actualiza totales
☐ Eliminar item actualiza lista
☐ Botón checkout navega a /checkout
```

### **Lista: Checkout - Flujo Principal**

#### Tarea: Checkout - Mock de Validación de Stock
```
Título: Checkout - Mock de Validación de Stock
Status: TO DO
Priority: Alta
Tags: #atomo #adapters #cart #checkout
Estimación: 1 SP

Archivos:
- src/features/cart/adapters/api/checkout.mock.ts

Detalle:
☐ mockValidateStock(items) → IStockValidationResult
☐ Simular que ~20% de items no tienen stock suficiente
☐ mockCreateOrder(items, customerInfo?) → { orderId, orderCode }
☐ Delay 500ms
```

#### Tarea: Checkout - Modal de Items No Disponibles
```
Título: Checkout - Modal de Items No Disponibles
Status: TO DO
Priority: Alta
Tags: #molecula #ui #checkout
Dependencies: Checkout - Mock de Validación de Stock
Estimación: 3 SP

Archivos:
- src/features/cart/ui/components/stock-validation-modal.tsx

Detalle:
☐ Props: unavailableItems, onRemoveItems, onAddToWishlist, onContinue
☐ Lista de items sin stock con imagen y nombre
☐ Opciones:
  - "Quitar del carrito" → remueve items sin stock
  - "Agregar a wishlist" → mueve a wishlist
  - "Continuar sin estos items" → procede sin ellos
☐ Botón "Cancelar" → volver al carrito
```

#### Tarea: Checkout - Vista Resumen y Confirmación
```
Título: Checkout - Vista Resumen y Confirmación
Status: TO DO
Priority: Alta
Tags: #organismo #ui #checkout
Dependencies: Checkout - Modal de Items No Disponibles
Estimación: 3 SP

Archivos:
- src/features/cart/ui/views/checkout.tsx
- src/app/(authenticated)/checkout/page.tsx

Detalle:
☐ Al entrar: llamar mockValidateStock
☐ Si hay faltantes: mostrar StockValidationModal
☐ Si todo OK: mostrar resumen
☐ Resumen: lista de items, total, datos del usuario
☐ Botón "Confirmar Pedido"
☐ onConfirm → mockCreateOrder → toast éxito → redirect a /pedidos/[id]
☐ Loading state durante confirmación

Criterios de Aceptación:
☐ Validación de stock se ejecuta al entrar
☐ Modal aparece si hay faltantes
☐ Confirmación exitosa redirige a pedido
```

#### Tarea: Checkout - Pantalla de Pedido Confirmado
```
Título: Checkout - Pantalla de Pedido Confirmado
Status: TO DO
Priority: Media
Tags: #atomo #ui #checkout
Estimación: 2 SP

Archivos:
- src/features/cart/ui/components/order-confirmed.tsx

Detalle:
☐ Icono de éxito (check verde)
☐ "¡Pedido confirmado!"
☐ Código de pedido
☐ "Te notificaremos cuando esté listo"
☐ Botón "Ver mis pedidos"
☐ Botón "Seguir comprando"
☐ Limpiar carrito (clearCart)
```

### **Lista: Checkout - Geofencing**

#### Tarea: Geofencing - Utilidad de Distancia
```
Título: Geofencing - Utilidad de Cálculo de Distancia
Status: TO DO
Priority: Alta
Tags: #atomo #utils #checkout #google-maps
Estimación: 2 SP

Archivos:
- src/lib/utils/geofence.ts

Detalle:
☐ haversineDistance(lat1, lon1, lat2, lon2) → distancia en metros
☐ isWithinRadius(userLat, userLon, storeLat, storeLon, radiusMeters) → boolean
☐ getStoreLocation() → { lat, lon, radius } (lee de env vars)

Criterios de Aceptación:
☐ Cálculo correcto (verificar con coordenadas conocidas)
```

#### Tarea: Geofencing - Hook useGeofence
```
Título: Geofencing - Hook useGeofence
Status: TO DO
Priority: Alta
Tags: #molecula #ui #checkout #google-maps
Dependencies: Geofencing - Utilidad de Distancia
Estimación: 3 SP

Archivos:
- src/features/cart/ui/hooks/use-geofence.ts

Detalle:
☐ Solicitar permiso de geolocalización (navigator.geolocation)
☐ Obtener coordenadas del usuario
☐ Calcular si está dentro del radio con isWithinRadius()
☐ Retorna: { isInRange, isLoading, error, requestLocation }
☐ Manejar errores: permiso denegado, no disponible
☐ Si VIP → siempre isInRange: true
☐ Si Kiosk → siempre isInRange: true
```

#### Tarea: Geofencing - Componente de Validación
```
Título: Geofencing - Componente de Validación en Checkout
Status: TO DO
Priority: Alta
Tags: #molecula #ui #checkout #google-maps
Dependencies: Geofencing - Hook useGeofence
Estimación: 2 SP

Archivos:
- src/features/cart/ui/components/geofence-check.tsx

Detalle:
☐ Props: onValidated (callback cuando pasa validación)
☐ Botón "Verificar ubicación"
☐ Loading: "Verificando tu ubicación..."
☐ Éxito: "Estás en la tienda ✓"
☐ Error: "Debes estar en la tienda para confirmar tu pedido"
☐ Error permiso: "Necesitamos acceso a tu ubicación"
```

### **Lista: Checkout - Modo Kiosk**

#### Tarea: Kiosk - Form Schema
```
Título: Kiosk - Form Schema de Datos del Cliente
Status: TO DO
Priority: Alta
Tags: #atomo #forms #checkout #kiosk
Estimación: 1 SP

Archivos:
- src/features/cart/adapters/forms/kiosk-customer.schema.ts
- src/features/cart/adapters/forms/use-kiosk-customer-form.ts

Detalle:
☐ Schema: name (string, min 2), email (string, email)
☐ Hook useKioskCustomerForm con zodResolver
```

#### Tarea: Kiosk - Componente Formulario
```
Título: Kiosk - Componente Formulario de Datos del Cliente
Status: TO DO
Priority: Alta
Tags: #molecula #ui #checkout #kiosk
Dependencies: Kiosk - Form Schema
Estimación: 2 SP

Archivos:
- src/features/cart/ui/components/kiosk-customer-form.tsx

Detalle:
☐ Campos: nombre y email
☐ Se muestra en checkout solo si role === KIOSK
☐ Datos se envían junto con el pedido
☐ Validación inline

Criterios de Aceptación:
☐ Solo visible en sesión Kiosk
☐ Validación funcional
```

---

## 📁 4. Cuenta de Usuario

### **Lista: Perfil - Domain y Vista**

#### Tarea: Perfil - Domain Types
```
Título: Perfil - Domain Types
Status: TO DO
Priority: Media
Tags: #atomo #domain #profile
Estimación: 1 SP

Archivos:
- src/features/profile/domain/types.ts

Detalle:
☐ IUserProfile { id, name, email, phone, role, createdAt }
☐ IUpdateProfileForm { name, phone }
☐ IChangePasswordForm { currentPassword, newPassword, confirmPassword }
```

#### Tarea: Perfil - Form Schemas
```
Título: Perfil - Form Schemas (Editar y Cambiar Contraseña)
Status: TO DO
Priority: Media
Tags: #atomo #forms #profile
Dependencies: Perfil - Domain Types
Estimación: 2 SP

Archivos:
- src/features/profile/adapters/forms/profile.schema.ts
- src/features/profile/adapters/forms/use-profile-form.ts
- src/features/profile/adapters/forms/change-password.schema.ts
- src/features/profile/adapters/forms/use-change-password-form.ts

Detalle:
☐ Profile schema: name (min 2), phone (min 10)
☐ Change password: currentPassword, newPassword (min 8), confirmPassword (refine match)
```

#### Tarea: Perfil - Mock API
```
Título: Perfil - Mock API
Status: TO DO
Priority: Media
Tags: #atomo #adapters #profile
Dependencies: Perfil - Domain Types
Estimación: 1 SP

Archivos:
- src/features/profile/adapters/api/profile.mock.ts

Detalle:
☐ mockGetProfile() → IUserProfile
☐ mockUpdateProfile(data) → IUserProfile actualizado
☐ mockChangePassword(data) → { success: true }
☐ Delay 300ms
```

#### Tarea: Perfil - Vista
```
Título: Perfil - Vista de Perfil
Status: TO DO
Priority: Media
Tags: #organismo #ui #profile
Dependencies: Perfil - Form Schemas, Perfil - Mock API
Estimación: 3 SP

Archivos:
- src/features/profile/ui/views/profile.tsx
- src/app/(authenticated)/perfil/page.tsx

Detalle:
☐ Sección "Mis Datos": nombre, email (readonly), teléfono, tipo (readonly)
☐ Botón "Editar" → formulario inline
☐ Sección "Cambiar Contraseña" (colapsable)
☐ Toast de éxito/error
☐ No accesible para Kiosk

Criterios de Aceptación:
☐ Datos del usuario visibles
☐ Edición funcional con validación
☐ Cambio de contraseña funcional
```

### **Lista: Pedidos - Domain y Vistas**

#### Tarea: Pedidos - Domain Types
```
Título: Pedidos - Domain Types
Status: TO DO
Priority: Media
Tags: #atomo #domain #orders
Estimación: 1 SP

Archivos:
- src/features/orders/domain/types.ts
- src/features/orders/domain/constants.ts

Detalle:
☐ IOrder { id, code, date, status, totalItems, totalPrice, tcgType }
☐ IOrderDetail extends IOrder { items: IOrderItem[], timeline: IOrderEvent[] }
☐ IOrderItem { cardId, cardName, cardImage, variantName, condition, quantity, unitPrice }
☐ IOrderEvent { status, date, description }
☐ OrderStatus enum: PENDING, PREPARING, READY, COMPLETED, CANCELLED
☐ Constantes: ORDER_STATUS_LABELS, ORDER_STATUS_COLORS
```

#### Tarea: Pedidos - Mock Data
```
Título: Pedidos - Mock Data
Status: TO DO
Priority: Media
Tags: #atomo #adapters #orders
Dependencies: Pedidos - Domain Types
Estimación: 2 SP

Archivos:
- src/features/orders/adapters/api/orders.mock.ts

Detalle:
☐ MOCK_ORDERS: 8-10 pedidos con estados variados
☐ Mezcla de Pokémon y Magic
☐ mockGetOrders(tcg) → filtrar por TCG del dominio
☐ mockGetOrderDetail(id) → pedido con items y timeline
☐ Delay 300ms
```

#### Tarea: Pedidos - Componente OrderCard
```
Título: Pedidos - Componente OrderCard
Status: TO DO
Priority: Media
Tags: #atomo #ui #orders
Dependencies: Pedidos - Domain Types
Estimación: 1 SP

Archivos:
- src/features/orders/ui/components/order-card.tsx

Detalle:
☐ Props: order (IOrder), onClick
☐ Código de pedido, fecha, total, badge de estado, número de items
```

#### Tarea: Pedidos - Componente OrderTimeline
```
Título: Pedidos - Componente OrderTimeline
Status: TO DO
Priority: Media
Tags: #atomo #ui #orders
Estimación: 2 SP

Archivos:
- src/features/orders/ui/components/order-timeline.tsx

Detalle:
☐ Props: events (IOrderEvent[])
☐ Timeline vertical con puntos y líneas
☐ Evento actual resaltado, futuros en gris
```

#### Tarea: Pedidos - Vista Listado
```
Título: Pedidos - Vista Listado
Status: TO DO
Priority: Media
Tags: #organismo #ui #orders
Dependencies: Pedidos - Componente OrderCard, Pedidos - Mock Data
Estimación: 2 SP

Archivos:
- src/features/orders/ui/views/orders.tsx
- src/app/(authenticated)/pedidos/page.tsx

Detalle:
☐ Lista de OrderCards
☐ Filtrados por TCG del dominio (automático)
☐ Título "Mis Pedidos"
☐ Click → navegar a /pedidos/[id]
☐ Estado vacío: "No tienes pedidos aún"
☐ No accesible para Kiosk
```

#### Tarea: Pedidos - Vista Detalle
```
Título: Pedidos - Vista Detalle de Pedido
Status: TO DO
Priority: Media
Tags: #organismo #ui #orders
Dependencies: Pedidos - Componente OrderTimeline, Pedidos - Mock Data
Estimación: 3 SP

Archivos:
- src/features/orders/ui/views/order-detail.tsx
- src/app/(authenticated)/pedidos/[id]/page.tsx

Detalle:
☐ Header: código, fecha, estado (badge)
☐ OrderTimeline
☐ Lista de items: imagen, nombre, variante, condición, cantidad, precio, subtotal
☐ Total del pedido
☐ Breadcrumb: Pedidos > #KSP-001

Criterios de Aceptación:
☐ Datos del pedido correctos
☐ Timeline muestra estados
```

### **Lista: Wishlist - Domain y Vista**

#### Tarea: Wishlist - Domain Types
```
Título: Wishlist - Domain Types
Status: TO DO
Priority: Media
Tags: #atomo #domain #wishlist
Estimación: 1 SP

Archivos:
- src/features/wishlist/domain/types.ts

Detalle:
☐ IWishlistItem { id, cardId, cardName, cardImage, setName, addedAt, inStock, lowestPrice }
```

#### Tarea: Wishlist - Mock Data
```
Título: Wishlist - Mock Data
Status: TO DO
Priority: Media
Tags: #atomo #adapters #wishlist
Dependencies: Wishlist - Domain Types
Estimación: 1 SP

Archivos:
- src/features/wishlist/adapters/api/wishlist.mock.ts

Detalle:
☐ MOCK_WISHLIST: 6-8 cartas (mezcla en stock y agotadas)
☐ mockGetWishlist(tcg) → filtrar por TCG
☐ mockAddToWishlist(cardId) → success
☐ mockRemoveFromWishlist(cardId) → success
```

#### Tarea: Wishlist - Componente WishlistItem
```
Título: Wishlist - Componente WishlistItem
Status: TO DO
Priority: Media
Tags: #atomo #ui #wishlist
Dependencies: Wishlist - Domain Types
Estimación: 2 SP

Archivos:
- src/features/wishlist/ui/components/wishlist-item.tsx

Detalle:
☐ Props: item (IWishlistItem), onRemove, onAddToCart
☐ Imagen, nombre, set
☐ Badge: "En stock" (verde) o "Agotado" (gris)
☐ Precio más bajo (si en stock)
☐ Botón "Agregar al carrito" (si en stock)
☐ Botón "Quitar" (icono X)
```

#### Tarea: Wishlist - Vista
```
Título: Wishlist - Vista de Lista de Deseos
Status: TO DO
Priority: Media
Tags: #organismo #ui #wishlist
Dependencies: Wishlist - Componente WishlistItem, Wishlist - Mock Data
Estimación: 2 SP

Archivos:
- src/features/wishlist/ui/views/wishlist.tsx
- src/app/(authenticated)/wishlist/page.tsx

Detalle:
☐ Grid de WishlistItems (2 cols móvil, 3 tablet, 4 desktop)
☐ Título "Mi Wishlist"
☐ Estado vacío: "Tu wishlist está vacía" + link "Explorar catálogo"
☐ No accesible para Kiosk ni Público

Criterios de Aceptación:
☐ Items se muestran correctamente
☐ Agregar al carrito funciona
☐ Quitar de wishlist funciona
```

---

## 📁 5. Páginas Públicas

### **Lista: Most Wanted**

#### Tarea: Most Wanted - Domain Types
```
Título: Most Wanted - Domain Types
Status: TO DO
Priority: Media
Tags: #atomo #domain #most-wanted
Estimación: 1 SP

Archivos:
- src/features/most-wanted/domain/types.ts

Detalle:
☐ IMostWantedCard { id, cardName, cardImage, setName, notes, tcgType }
```

#### Tarea: Most Wanted - Mock Data
```
Título: Most Wanted - Mock Data
Status: TO DO
Priority: Media
Tags: #atomo #adapters #most-wanted
Dependencies: Most Wanted - Domain Types
Estimación: 1 SP

Archivos:
- src/features/most-wanted/adapters/api/most-wanted.mock.ts

Detalle:
☐ MOCK_MOST_WANTED: 10-15 cartas por TCG
☐ mockGetMostWanted(tcg) → filtrar por TCG
```

#### Tarea: Most Wanted - Componente MostWantedCard
```
Título: Most Wanted - Componente MostWantedCard
Status: TO DO
Priority: Media
Tags: #atomo #ui #most-wanted
Estimación: 1 SP

Archivos:
- src/features/most-wanted/ui/components/most-wanted-card.tsx

Detalle:
☐ Props: card (IMostWantedCard)
☐ Imagen grande de carta
☐ Nombre, set, notas
☐ Diseño optimizado para visibilidad a distancia (TV)
```

#### Tarea: Most Wanted - Vista Página Pública
```
Título: Most Wanted - Vista Página Pública
Status: TO DO
Priority: Media
Tags: #organismo #ui #most-wanted
Dependencies: Most Wanted - Componente MostWantedCard, Most Wanted - Mock Data
Estimación: 3 SP

Archivos:
- src/features/most-wanted/ui/views/most-wanted.tsx
- src/app/(public)/most-wanted/page.tsx

Detalle:
☐ Layout fullscreen (sin header/footer)
☐ Título "Most Wanted" + logo TCG
☐ Grid de MostWantedCards (3-4 cols)
☐ Auto-refresh cada 60 segundos
☐ Animación de entrada (fade in)
☐ Fondo oscuro para contraste

Criterios de Aceptación:
☐ Fullscreen sin navegación
☐ Auto-refresh funcional
☐ Legible a distancia
```

### **Lista: Testing Integral**

#### Tarea: Testing - Flujo Completo Público
```
Título: Testing - Flujo Completo Público (Sin Auth)
Status: TO DO
Priority: Media
Tags: #organismo #testing
Estimación: 2 SP

Scope:
Verificar flujo completo de usuario público.

Detalle:
☐ Navegar catálogo
☐ Buscar carta
☐ Filtrar por set/rareza
☐ Ver detalle de carta
☐ Intentar agregar al carrito → redirige a login
☐ Ver Most Wanted
```

#### Tarea: Testing - Flujo Completo Cliente
```
Título: Testing - Flujo Completo Cliente (Auth)
Status: TO DO
Priority: Media
Tags: #organismo #testing
Estimación: 3 SP

Detalle:
☐ Login como cliente
☐ Navegar catálogo
☐ Agregar cartas al carrito
☐ Ver carrito, modificar cantidades
☐ Checkout → validación de stock
☐ Geofencing → confirmar pedido
☐ Ver historial de pedidos
☐ Ver detalle de pedido
☐ Agregar/quitar de wishlist
☐ Editar perfil
☐ Logout
```

#### Tarea: Testing - Flujo Kiosk
```
Título: Testing - Flujo Kiosk
Status: TO DO
Priority: Media
Tags: #molecula #testing #kiosk
Estimación: 2 SP

Detalle:
☐ Login como kiosk
☐ Navegar catálogo
☐ Agregar al carrito
☐ Checkout → formulario nombre+email
☐ Confirmar pedido
☐ Verificar que no puede acceder a perfil/pedidos/wishlist
```

---

## Sistema de Tags

### Por Capa de Arquitectura
- `#atomo` — Componentes base, tipos, utilidades, schemas (1-2 SP)
- `#molecula` — Componentes compuestos, hooks complejos (2-3 SP)
- `#organismo` — Vistas completas, flujos (3-5 SP)

### Por Tipo de Trabajo
- `#frontend` — Trabajo de frontend
- `#integration` — Integraciones externas (Google Maps)
- `#docs` — Documentación
- `#testing` — Testing y QA

### Por Módulo
- `#layout` — Layout y navegación
- `#tcg` — Contexto TCG
- `#auth` — Autenticación
- `#catalog` — Catálogo de cartas
- `#cart` — Carrito
- `#checkout` — Checkout
- `#profile` — Perfil de usuario
- `#orders` — Historial de pedidos
- `#wishlist` — Wishlist
- `#most-wanted` — Most Wanted
- `#kiosk` — Modo Kiosk
- `#google-maps` — Geofencing

### Por Capa Feature-First
- `#domain` — Tipos y constantes
- `#adapters` — Mocks, forms, mappers
- `#ui` — Componentes y vistas
- `#store` — Zustand stores
- `#forms` — Schemas Zod y hooks useForm
- `#utils` — Utilidades
- `#config` — Configuración

---

## Custom Fields

1. **Capa Arquitectura** — Domain, Adapters, UI, Store, Utils, Config
2. **Módulo** — Auth, Catalog, Cart, Checkout, Wishlist, Orders, Profile, Most Wanted, Layout, TCG
3. **TCG** — Pokémon, Magic, Ambos, N/A
4. **Estimación** — Number (Story Points: 1-5)
5. **Pantalla Figma** — URL al frame de Figma correspondiente

---

## Estados de Tareas

- **TO DO** — Por hacer
- **IN PROGRESS** — En progreso
- **IN REVIEW** — En revisión
- **DONE** — Completado
- **BLOCKED** — Bloqueado

---

## Convención de Nombres

### Formato:
```
[Módulo] - Descripción Breve
```

### Ejemplos:
- `Layout - Componente Header`
- `Auth - Login Form Schema`
- `Catálogo - Mock Data`
- `Carrito - Componente CartItem`
- `Geofencing - Hook useGeofence`
- `Kiosk - Form Schema`

---

## Resumen de Tareas

| Folder | Tareas | SP Total |
|--------|--------|----------|
| 0. Config | 5 | 5 |
| 1. Fundamentos | 20 | 35 |
| 2. Catálogo | 14 | 25 |
| 3. Carrito y Checkout | 13 | 25 |
| 4. Cuenta de Usuario | 12 | 20 |
| 5. Páginas Públicas | 7 | 13 |
| **Total** | **71** | **123** |

---

## Orden de Ejecución

Secuencia recomendada respetando dependencias. Las tareas dentro de un mismo paso pueden ejecutarse en paralelo.

### Fase 0 — Config (DONE)
> 5 tareas · 5 SP · Ya completadas

| # | Tarea | SP | Depende de |
|---|-------|----|------------|
| 1 | Config - Inicializar Repositorio | 1 | — |
| 2 | Config - Variables de Entorno y .env.example | 1 | — |
| 3 | Config - Copiar Workflow work-on-task | 1 | — |
| 4 | Docs - README del Proyecto | 1 | — |
| 5 | Docs - Documentación de Arquitectura | 1 | — |

---

### Fase 1A — TCG y Layout Base (paralelo)
> 8 tareas · 10 SP

| # | Tarea | SP | Depende de |
|---|-------|----|------------|
| 6 | TCG - Utilidad de Detección por Hostname | 1 | — (DONE) |
| 7 | TCG - Verificar Constantes de Temas | 1 | — |
| 8 | TCG - Logo Dinámico por TCG | 1 | #7 |
| 9 | TCG - Metadata Dinámica (Título y Favicon) | 2 | #7 |
| 10 | Layout - Componente Footer | 2 | — |
| 11 | Layout - Componente SearchBar | 2 | — |
| 12 | Layout - Componente Header | 3 | #8, #11 |
| 13 | Layout - Navegación Móvil (Drawer) | 3 | #12 |

---

### Fase 1B — Layouts y Auth Domain (paralelo)
> 10 tareas · 12 SP

| # | Tarea | SP | Depende de |
|---|-------|----|------------|
| 14 | Layout - Public Layout (Wrapper) | 2 | #10, #12 |
| 15 | Layout - Authenticated Layout (Wrapper) | 2 | #14 |
| 16 | Layout - Not Authenticated Layout | 1 | #8 |
| 17 | Layout - Página 404 | 1 | — |
| 18 | Auth - Domain Types y Constants | 1 | — |
| 19 | Auth - Login Form Schema (Zod) | 1 | #18 |
| 20 | Auth - Register Form Schema (Zod) | 2 | #18 |
| 21 | Auth - Forgot Password Form Schema (Zod) | 1 | #18 |
| 22 | Auth - Mock API (Login, Register, Forgot Password) | 2 | #18 |
| 23 | Auth - Mappers (Form → API Input) | 1 | #18 |

---

### Fase 1C — Auth Vistas
> 4 tareas · 10 SP

| # | Tarea | SP | Depende de |
|---|-------|----|------------|
| 24 | Auth - Vista Login | 3 | #16, #19, #22 |
| 25 | Auth - Vista Registro | 3 | #16, #20, #22 |
| 26 | Auth - Vista Recuperar Contraseña | 2 | #16, #21, #22 |
| 27 | Auth - API Routes para Cookies de Sesión | 2 | — |

---

### Fase 2A — Catálogo Domain y Componentes Base
> 8 tareas · 10 SP

| # | Tarea | SP | Depende de |
|---|-------|----|------------|
| 28 | Catálogo - Domain Types | 1 | — |
| 29 | Catálogo - Mock Data (Cartas Pokémon y Magic) | 2 | #28 |
| 30 | Catálogo - Hook useCatalog | 2 | #29 |
| 31 | Catálogo - Hook useCardDetail | 1 | #29 |
| 32 | Catálogo - Componente CardItem | 2 | #28 |
| 33 | Catálogo - Componente CardSkeleton | 1 | — |
| 34 | Catálogo - Componente QuantitySelector (Shared) | 1 | — |
| 35 | Catálogo - Componente CardGrid | 2 | #32 |

---

### Fase 2B — Catálogo Componentes Avanzados y Carrito Domain
> 6 tareas · 8 SP

| # | Tarea | SP | Depende de |
|---|-------|----|------------|
| 36 | Catálogo - Componente VariantSelector | 2 | #28 |
| 37 | Carrito - Domain Types | 1 | — |
| 38 | Carrito - Store Zustand (Verificar y Ajustar) | 2 | #37 |
| 39 | Catálogo - Componente AddToCartButton | 1 | #38 |
| 40 | Catálogo - Componente AddToWishlistButton | 1 | — |
| 41 | Catálogo - Panel de Filtros (Desktop Sidebar) | 3 | #28 |

---

### Fase 2C — Catálogo Vistas
> 4 tareas · 10 SP

| # | Tarea | SP | Depende de |
|---|-------|----|------------|
| 42 | Catálogo - Filtro Drawer Móvil | 2 | #41 |
| 43 | Catálogo - Vista Principal (Grid de Cartas) | 3 | #30, #35, #41 |
| 44 | Catálogo - Vista Detalle de Carta | 3 | #31, #34, #36, #39, #40 |

---

### Fase 3A — Carrito Vista
> 3 tareas · 6 SP

| # | Tarea | SP | Depende de |
|---|-------|----|------------|
| 45 | Carrito - Componente CartItem (Fila de Item) | 2 | #34, #37 |
| 46 | Carrito - Componente CartSummary | 1 | — |
| 47 | Carrito - Vista de Carrito | 3 | #45, #46 |

---

### Fase 3B — Checkout y Geofencing (paralelo)
> 7 tareas · 14 SP

| # | Tarea | SP | Depende de |
|---|-------|----|------------|
| 48 | Checkout - Mock de Validación de Stock | 1 | #37 |
| 49 | Checkout - Modal de Items No Disponibles | 3 | #48 |
| 50 | Geofencing - Utilidad de Cálculo de Distancia | 2 | — |
| 51 | Geofencing - Hook useGeofence | 3 | #50 |
| 52 | Geofencing - Componente de Validación en Checkout | 2 | #51 |
| 53 | Checkout - Vista Resumen y Confirmación | 3 | #49, #52 |
| 54 | Checkout - Pantalla de Pedido Confirmado | 2 | — |

---

### Fase 3C — Modo Kiosk
> 2 tareas · 3 SP

| # | Tarea | SP | Depende de |
|---|-------|----|------------|
| 55 | Kiosk - Form Schema de Datos del Cliente | 1 | — |
| 56 | Kiosk - Componente Formulario de Datos del Cliente | 2 | #55 |

---

### Fase 4A — Perfil y Pedidos Domain (paralelo)
> 6 tareas · 6 SP

| # | Tarea | SP | Depende de |
|---|-------|----|------------|
| 57 | Perfil - Domain Types | 1 | — |
| 58 | Perfil - Form Schemas (Editar y Cambiar Contraseña) | 2 | #57 |
| 59 | Perfil - Mock API | 1 | #57 |
| 60 | Pedidos - Domain Types | 1 | — |
| 61 | Pedidos - Mock Data | 2 | #60 |
| 62 | Wishlist - Domain Types | 1 | — |

---

### Fase 4B — Perfil, Pedidos y Wishlist Vistas
> 8 tareas · 14 SP

| # | Tarea | SP | Depende de |
|---|-------|----|------------|
| 63 | Perfil - Vista de Perfil | 3 | #58, #59 |
| 64 | Pedidos - Componente OrderCard | 1 | #60 |
| 65 | Pedidos - Componente OrderTimeline | 2 | #60 |
| 66 | Pedidos - Vista Listado | 2 | #61, #64 |
| 67 | Pedidos - Vista Detalle de Pedido | 3 | #61, #65 |
| 68 | Wishlist - Mock Data | 1 | #62 |
| 69 | Wishlist - Componente WishlistItem | 2 | #62 |
| 70 | Wishlist - Vista de Lista de Deseos | 2 | #68, #69 |

---

### Fase 5 — Páginas Públicas y Testing
> 7 tareas · 13 SP

| # | Tarea | SP | Depende de |
|---|-------|----|------------|
| 71 | Most Wanted - Domain Types | 1 | — |
| 72 | Most Wanted - Mock Data | 1 | #71 |
| 73 | Most Wanted - Componente MostWantedCard | 1 | #71 |
| 74 | Most Wanted - Vista Página Pública | 3 | #72, #73 |
| 75 | Testing - Flujo Completo Público (Sin Auth) | 2 | #43, #44, #74 |
| 76 | Testing - Flujo Completo Cliente (Auth) | 3 | #47, #53, #63, #66, #67, #70 |
| 77 | Testing - Flujo Kiosk | 2 | #56, #76 |

---

### Resumen por Fase

| Fase | Nombre | Tareas | SP | Acumulado |
|------|--------|--------|----|-----------|
| 0 | Config (DONE) | 5 | 5 | 5 |
| 1A | TCG y Layout Base | 8 | 10 | 15 |
| 1B | Layouts y Auth Domain | 10 | 12 | 27 |
| 1C | Auth Vistas | 4 | 10 | 37 |
| 2A | Catálogo Domain y Componentes | 8 | 10 | 47 |
| 2B | Catálogo Avanzado + Carrito Domain | 6 | 8 | 55 |
| 2C | Catálogo Vistas | 4 | 10 | 65 |
| 3A | Carrito Vista | 3 | 6 | 71 |
| 3B | Checkout y Geofencing | 7 | 14 | 85 |
| 3C | Modo Kiosk | 2 | 3 | 88 |
| 4A | Perfil y Pedidos Domain | 6 | 6 | 94 |
| 4B | Vistas de Cuenta | 8 | 14 | 108 |
| 5 | Públicas y Testing | 7 | 13 | 121 |
| **Total** | | **77** | **121** | |

---

## Checklist de Setup en ClickUp

- [ ] Crear Space "Kidstop Carpeta Digital"
- [ ] Crear Folders (0-5)
- [ ] Crear Listas en cada Folder
- [ ] Configurar Custom Fields (5 campos)
- [ ] Configurar Tags
- [ ] Configurar Estados (TO DO, IN PROGRESS, IN REVIEW, DONE, BLOCKED)
- [ ] Marcar tareas de Config como DONE
- [ ] Configurar vista Board (Kanban)
- [ ] Configurar vista List con Group by Status

---

## Referencia de Diseño

- **Figma:** https://www.figma.com/design/OVJt5MDixgpKHhfO6Bk2bq/ks-UI-MVP?node-id=6403-11874
- **Repo:** https://github.com/GRID-Company/kidstop-digital-binder
- Cada tarea debe incluir el link al frame de Figma correspondiente en el custom field "Pantalla Figma"
