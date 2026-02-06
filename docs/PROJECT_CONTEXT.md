# Kidstop Singles Platform - Contexto del Proyecto

## Información General

**Proyecto:** KSP-001: Kidstop Singles Platform  
**Cliente:** Kids Stop
**Desarrollador:** GRID Software - Carlos Fabian Alonso Ascencio  
**Fecha de creación:** 06/11/2025  
**Última actualización:** 20/12/2025  
**Versión:** v1.1  
**Estado:** Aprobado

## Resumen Ejecutivo

### Objetivo del Proyecto
Implementar una plataforma para Kidstop que permita administrar de forma confiable la **compra, venta e inventario** de cartas **singles** de *Pokémon TCG* y *Magic: The Gathering*, habilitando control de stock, operación de compradores con presupuesto y una experiencia digital para que los clientes consulten y realicen compras.

### Alcance del MVP
El MVP contempla un sistema responsive compuesto por:

- **Panel administrativo web** para operar compras de singles, administración de inventario y procesos de venta, con roles **Administrador**, **Recepción** y **Comprador**.
- **Carpeta digital** orientada a clientes para navegar el inventario y realizar compras, con niveles de acceso **Público**, **Cliente** y **Cliente VIP** (compra remota).

### Resultado Esperado
Al finalizar el MVP, Kidstop contará con:
- Visibilidad y control del **stock actual** de singles
- Capacidad de registrar y monitorear compras por **comprador** con **presupuesto**
- Una carpeta digital funcional para consulta y compra según el tipo de usuario

## Diagnóstico y Contexto

### Situación Actual
Kidstop es una tienda de productos TCG, actualmente enfocada principalmente en **Pokémon**, con la intención de ampliar su operación a otros TCG como **Magic: The Gathering**. Las operaciones actuales se sostienen principalmente en productos TCG y eventos, con procesos ya establecidos para dichas líneas de negocio.

### Problemas Identificados
- Dificultad para mantener **certeza del inventario** disponible en tiempo real
- Complejidad para gestionar de forma ordenada la **compra de cartas singles** (registro, trazabilidad y control)
- Limitación para tomar decisiones de **restock** basadas en datos de venta y rotación del inventario de singles
- Falta de una experiencia digital estructurada para que los clientes consulten el inventario y realicen compras de acuerdo con su nivel de acceso

### Oportunidad
Una plataforma enfocada en la operación de singles permitirá estandarizar la compra/venta, mejorar el control de inventario y habilitar reportes que faciliten estrategias de restock. Adicionalmente, la implementación de una **carpeta digital** abre un canal para que clientes consulten y compren inventario de singles, mejorando la experiencia y el alcance comercial, especialmente para usuarios con permisos de compra remota (VIP).

## Glosario de Términos

- **TCG (Trading Card Game):** Juego de cartas coleccionables
- **Single (Carta single):** Carta individual vendida por unidad
- **Catálogo (Card Catalog):** Base de datos de cartas con información de identificación
- **Variante (Variant):** Características que diferencian una carta (idioma, foil/no foil, edición especial)
- **Condición (Condition):** Estado físico de una carta (Jugada, Pristine, Mint)
- **Inventario:** Existencia disponible de cartas singles registradas en el sistema
- **Stock:** Cantidad disponible de una carta en inventario
- **Buylist (Compra de singles):** Proceso de compra de cartas singles a clientes/proveedores
- **Precio de referencia:** Precio externo o de mercado usado como base de cálculo
- **Precio de compra:** Precio que Kidstop paga por una carta
- **Precio sugerido de venta:** Precio recomendado para vender una carta
- **Orden de compra:** Registro formal de una compra de singles
- **Orden de venta:** Registro formal de una venta
- **Wishlist:** Lista donde un cliente puede guardar cartas que desea comprar

## Roles y Permisos

### Roles del Panel Administrativo (Backoffice)
- **Administrador:** Usuario con permisos de configuración y control general
- **Recepción:** Usuario operativo que apoya en procesos definidos (permisos limitados)
- **Comprador:** Usuario responsable de compras de singles y operación de presupuesto

### Roles de la Carpeta Digital
- **Público:** Usuario sin autenticación o con acceso limitado
- **Cliente:** Usuario autenticado con permisos estándar
- **Cliente VIP:** Usuario con permiso de compra remota
- **Cliente Tienda (Kiosk/iPad):** Cuenta genérica de uso en tienda para clientes que no desean registrarse

### Matriz de Permisos Clave

**Backoffice:**
- Todos los roles pueden ver catálogo y crear/editar compras en Draft
- Solo Admin puede hacer ajustes manuales de inventario
- Solo Admin puede cambiar tipo de cliente (Cliente ↔ VIP)
- Recepción puede gestionar ventas/pedidos pero no clientes

**Carpeta Digital:**
- Público: solo navegar catálogo
- Cliente: crear pedidos solo en tienda (validación ubicación)
- VIP: crear pedidos remotos sin validación ubicación
- Kiosk: crear pedidos en tienda pero sin acceso a perfil/historial

## Modelo de Datos Base

### Entidades Principales
- **Carta (Card):** Registro base de una carta en el catálogo
- **Variante (Variant):** Atributos que diferencian una carta
- **Ítem de inventario:** Stock disponible para venta
- **Compra (Purchase):** Transacción de adquisición de cartas
- **Venta (Sale):** Transacción de venta de cartas
- **Cliente (Customer):** Registro de cliente
- **Usuario (User):** Cuenta interna o externa con rol y permisos

### Reglas Base del MVP
- **Certeza de stock:** El stock visible debe corresponder al stock operable
- **Presupuesto por comprador:** El rol Comprador opera con presupuesto asignado
- **Niveles de acceso:** La carpeta digital limita acciones según rol
- **Contexto de juego:** El backoffice opera con contexto Pokémon/Magic seleccionable

## Módulos del Sistema

### 1. Autenticación y Seguridad
**Objetivo:** Acceso seguro con autenticación, manejo de sesión y recuperación de contraseña.

**Alcance:**
- Login/logout
- Recuperación de contraseña vía email
- Cambio de contraseña
- Reglas de sesión y vencimiento

### 2. Usuarios y Roles
**Objetivo:** Administrar usuarios internos del backoffice con permisos por rol.

**Alcance:**
- CRUD de usuarios
- Asignación de rol (Admin/Recepción/Comprador)
- Activar/Desactivar usuarios
- Listado y búsqueda

### 3. Catálogo de Cartas
**Objetivo:** Búsqueda, consulta y gestión de cartas singles con respaldo interno y precios públicos.

**Alcance:**
- Selector de contexto TCG (Pokémon/Magic)
- Listado con búsqueda y filtros
- Detalle de carta y variantes
- Respaldo interno del catálogo de proveedores externos
- Configuración de precio de venta al público
- Consulta de precio de referencia

**Proveedores:**
- Price Charting (Pokémon)
- Card Kingdom (Magic)

### 4. Compras (Buylist/Negociación)
**Objetivo:** Registrar compras de cartas singles con negociación, control de presupuesto y flujo de estados.

**Estados:** Draft → Cotizado → Esperando precio → Finalizado / Rechazado

**Funcionalidades clave:**
- Búsqueda de cartas con métricas operativas (última venta, tiempo en inventario, wishlist)
- Lista de compra con condición por carta (Jugada/Pristine/Mint)
- Registro de vendedor
- Control de presupuesto por comprador (advertencia, no bloqueo en MVP)
- Límite de inventario por carta (advertencia, no bloqueo en MVP)
- Envío de cotización por WhatsApp con hipervínculo
- Modo privacidad (ocultar datos sensibles)
- Registro de pago (efectivo/transferencia/crédito tienda) con división de pago
- Ajuste de precio público antes de finalizar

**Regla clave:** En "Esperando precio" las cartas NO se suman al stock. Al pasar a "Finalizado" SÍ se suman.

### 5. Inventario y Movimientos
**Objetivo:** Control de stock con trazabilidad de movimientos.

**Alcance:**
- Inventario por Carta + Variante + Condición
- Estados de stock (Disponible, Esperando recolección, No disponible)
- Registro de movimientos (Entrada por compra, Salida por venta, Ajuste manual)
- Historial de movimientos con filtros
- Stock compartido entre bar y tienda
- Métricas: última venta, tiempo promedio en inventario

**Tipos de movimiento:**
- Entrada por compra (cuando pasa a Finalizado)
- Salida por venta (cuando se completa)
- Ajuste manual (solo Admin)

### 6. Ventas
**Objetivo:** Gestión de pedidos originados en Carpeta Digital para surtido en mostrador.

**Estados:** Nuevo/Recibido → En surtido → Listo para recolección → Completado / Cancelado

**Funcionalidades:**
- Listado de pedidos con filtros
- Detalle de pedido con items
- Generación de PDF (picking list)
- Código de venta único
- Notificación email "listo para recolección"
- Modal de confirmación para completar venta
- Integración con Shopify (código como custom item manual)

**Regla clave:** Todas las ventas se originan desde Carpeta Digital (no hay ventas manuales en mostrador en MVP).

### 7. Clientes
**Objetivo:** Gestión de clientes con clasificación VIP, bloqueos y validación de ubicación.

**Funcionalidades:**
- Registro desde Carpeta Digital (cuenta unificada Pokémon/Magic)
- Clasificación: Cliente / Cliente VIP
- Bloqueo por pedidos no concretados (configurable)
- Validación de ubicación para compras (no VIP)
- Listado con búsqueda y filtros
- Historial de pedidos por cliente

**Reglas clave:**
- Cliente no VIP: solo puede confirmar pedido si está en tienda (Google Maps geofencing)
- Cliente VIP: puede confirmar pedido remotamente sin validación de ubicación
- Bloqueo automático al superar umbral de pedidos no concretados

### 8. Carpeta Digital
**Objetivo:** Experiencia web para clientes donde puedan consultar inventario y realizar pedidos.

**Superficies:** Dos dominios independientes (Pokémon y Magic) con autenticación compartida.

**Funcionalidades:**
- Navegación del catálogo filtrado por TCG
- Búsqueda y filtros
- Carrito y creación de pedido
- Wishlist (con notificación de restock)
- Perfil de usuario (no para Kiosk)
- Historial de pedidos (no para Kiosk)
- Validación de ubicación para no VIP
- Modo Kiosk/iPad con formulario de checkout (captura nombre y correo del cliente real)

**Reglas de compra:**
- No VIP: validación de ubicación obligatoria
- VIP: compra remota sin validación
- Kiosk: compra en tienda, sin acceso a perfil/historial

### 9. Most Wanted (Página Pública)
**Objetivo:** Páginas públicas por TCG para mostrar cartas que Kidstop desea comprar.

**Funcionalidades:**
- Dos páginas independientes (Pokémon y Magic)
- Configuración desde backoffice (agregar/quitar/ordenar/activar)
- Vista optimizada para pantalla/TV
- Contenido: carta, set, variante, prioridad, notas

### 10. Configuración Global
**Objetivo:** Configuraciones del sistema.

**Funcionalidades:**
- Configuración de geofence (Google Maps)
- Umbral de bloqueo por pedidos no concretados
- Presupuestos por comprador
- Límite de inventario por carta
- Horarios de operación

## Integraciones Externas

### 1. Proveedores de Catálogo/Precios
- **Price Charting** (Pokémon)
- **Card Kingdom** (Magic)
- Propósito: Poblar/actualizar catálogo interno y obtener precios de referencia

### 2. Google Maps API
- Propósito: Validar ubicación de usuarios no VIP (geofencing)
- Alcance: Solicitar permisos, validar contra perímetro de tienda, bloquear si está fuera

### 3. Shopify
- Propósito: Código de venta como custom item (flujo manual)
- Alcance: El sistema genera código único, staff lo captura manualmente en Shopify

### 4. Email Transaccional
- Propósito: Notificaciones y recuperación de contraseña
- Emails: Pedido listo para recolección, Notificación de restock, Recuperación de contraseña

### 5. WhatsApp
- Propósito: Envío de cotizaciones con hipervínculo
- Alcance: Generar enlace/mensaje, registrar envío

### 6. PDF Generation
- Propósito: Picking lists para pedidos
- Contenido: Código de venta, cliente, TCG, items (carta, variante, condición, cantidad)

## Requerimientos No Funcionales

### Seguridad y Acceso
- Autenticación con expiración de sesión
- Control de acceso por rol
- Protección de datos sensibles (Modo privacidad)
- Gestión segura de credenciales
- API Keys en variables de entorno

### Disponibilidad y Resiliencia
- Operación degradada si proveedor de catálogo falla (usar catálogo interno)
- Mensajes claros ante errores
- Prevención de duplicados (idempotencia)

### Usabilidad y Compatibilidad
- Responsive (móvil/tablet/desktop)
- Navegadores modernos (Chrome/Edge/Safari)
- Accesibilidad básica (contrastes, estados de error)

### Auditoría y Trazabilidad
- Registrar usuario que realizó acciones relevantes
- Fecha/hora de acciones
- Referencia a entidad afectada

### Datos y Backups
- Backups regulares de base de datos
- Retención de historial de movimientos y transacciones

### Ambientes
- Staging y Producción
- Configuración por variables de entorno

## Consideraciones de Arquitectura

### Separación por TCG
- Carpeta digital: dos dominios independientes (Pokémon y Magic)
- Backoffice: selector de contexto TCG
- Autenticación compartida entre dominios
- Órdenes y catálogo filtrados por TCG
- No mezclar datos entre juegos

### Flujos Críticos

**Flujo de Compra:**
1. Seleccionar TCG
2. Buscar cartas (con métricas)
3. Agregar a lista con condición
4. Capturar vendedor
5. Guardar como Draft o enviar cotización por WhatsApp
6. Staff registra aceptación/rechazo
7. Si aceptada → Esperando precio (ajustar precios públicos)
8. Finalizar → Sumar a stock

**Flujo de Venta:**
1. Cliente crea pedido en Carpeta Digital
2. Recepción ve pedido en backoffice
3. Genera PDF (picking list)
4. Marca como "Listo para recolección" → envía email
5. Completa venta → descuenta stock

**Flujo de Inventario:**
- Compra Finalizada → Entrada de inventario
- Venta Completada → Salida de inventario
- Ajuste manual → Movimiento con motivo

## Variables de Entorno Requeridas

```env
# Proyecto
PROJECT_NAME=Kidstop Backoffice
NEXT_PUBLIC_GRAPHQL_ENDPOINT=

# Proveedores de catálogo
PRICE_CHARTING_API_KEY=
CARD_KINGDOM_API_KEY=

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# Email
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
EMAIL_FROM=

# WhatsApp
WHATSAPP_API_URL=
WHATSAPP_API_TOKEN=

# Configuración
DEFAULT_BUDGET_LIMIT=
DEFAULT_INVENTORY_LIMIT=20
UNCOMPLETED_ORDERS_THRESHOLD=3

# Geofence
STORE_LATITUDE=
STORE_LONGITUDE=
STORE_RADIUS_METERS=
```

## Exclusiones del MVP

**Fuera de alcance:**
- Funcionalidades no descritas en requerimientos
- Single Sign-On (Google/Microsoft/Apple), MFA/2FA
- Pagos en línea integrados
- Envíos/logística y tracking
- Integración automática con Shopify vía API
- Facturación automatizada
- CRM avanzado (segmentación, campañas, puntos)
- Gestión avanzada por ubicaciones múltiples
- Roles personalizados desde UI

## Control de Cambios

Cualquier cambio al alcance debe seguir el proceso:
1. Solicitud por escrito (descripción, motivo, urgencia)
2. Análisis de impacto (alcance, costo, timeline, riesgos)
3. Propuesta de cambio
4. Aprobación explícita por escrito
5. Ejecución según prioridad

## Referencias

- Documento completo: `KSP - Alcance y requerimientos del MVP.md`
- Plan de implementación: `IMPLEMENTATION_PLAN.md`
- Arquitectura del proyecto: `ARCHITECTURE.md`
