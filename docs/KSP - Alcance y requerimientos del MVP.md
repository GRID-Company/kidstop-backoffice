

**Alcance y requerimientos del MVP**  
---

**KSP-001: Kidstop Singles Platform**  
06 de Noviembre del 2025

**Para: Kids Stop**  
Luis Carlos Sanchez Rojas  
                                                        

**Por: GRID Software**  
Carlos Fabian Alonso Ascencio  
carlosalonsoa99@gmail.com

# 0\. Control del documento {#0.-control-del-documento}

## 0.1 Información general {#0.1-información-general}

* **Proyecto**: Kidstop Singles Platform  
* **Documento**: Alcance y requerimientos del MVP  
* **Cliente**: Luis Carlos Sanchez Rojas / Kidstop  
* **Elaborado por**: Carlos Fabian Alonso Ascencio / Grid  
* **Fecha de creación**: 06/11/2025  
* **Última actualización**: 20/12/2025  
* **Versión actual**: v1.1  
* **Estado**: Aprobado

## 0.2 Objetivo del documento {#0.2-objetivo-del-documento}

Este documento define el **alcance, requerimientos y criterios de aceptación** del MVP de *Kidstop Singles Platform*. Su propósito es alinear expectativas entre las partes, establecer lo que se entregará y delimitar lo que queda fuera de alcance, así como servir como referencia para validación (UAT) y control de cambios.

## 0.3 Aprobación {#0.3-aprobación}

Este documento se considera aprobado cuando los representantes del cliente y del equipo de desarrollo confirman por escrito la versión vigente (correo, documento compartido o firma), y cualquier modificación posterior se gestionará mediante el proceso de **Control de cambios (Change Requests)** descrito en este mismo documento.

[0\. Control del documento](#0.-control-del-documento)

[0.1 Información general](#0.1-información-general)

[0.2 Objetivo del documento](#0.2-objetivo-del-documento)

[0.3 Aprobación](#0.3-aprobación)

[1\. Resumen ejecutivo](#1.-resumen-ejecutivo)

[1.1 Objetivo del proyecto](#1.1-objetivo-del-proyecto)

[1.2 Alcance del MVP](#1.2-alcance-del-mvp)

[1.3 Exclusiones principales](#1.3-exclusiones-principales)

[1.4 Resultado esperado](#1.4-resultado-esperado)

[2\. Diagnóstico y contexto](#2.-diagnóstico-y-contexto)

[2.1 Situación actual](#2.1-situación-actual)

[2.2 Problemas identificados](#2.2-problemas-identificados)

[2.3 Oportunidad / Motivación](#2.3-oportunidad-/-motivación)

[3\. Definiciones y glosario](#3.-definiciones-y-glosario)

[4\. Alcance del proyecto](#4.-alcance-del-proyecto)

[4.1 In-scope (MVP)](#4.1-in-scope-\(mvp\))

[4.2 Out-of-scope (MVP)](#4.2-out-of-scope-\(mvp\))

[4.3 Roadmap por fases (Fase 2 / Backlog no comprometido)](#4.3-roadmap-por-fases-\(fase-2-/-backlog-no-comprometido\))

[4.4 Supuestos y dependencias de alcance](#4.4-supuestos-y-dependencias-de-alcance)

[5\. Usuarios, roles y permisos](#5.-usuarios,-roles-y-permisos)

[5.1 Roles incluidos](#5.1-roles-incluidos)

[5.2 Principios de permisos](#5.2-principios-de-permisos)

[5.3 Matriz de permisos por módulo](#5.3-matriz-de-permisos-por-módulo)

[5.3.1 Roles](#5.3.1-roles)

[5.3.2 Permisos por módulo](#5.3.2-permisos-por-módulo)

[5.3.3 Notas y restricciones](#5.3.3-notas-y-restricciones)

[6\. Modelo de datos y reglas base](#6.-modelo-de-datos-y-reglas-base)

[6.1 Entidades principales (conceptual)](#6.1-entidades-principales-\(conceptual\))

[6.2 Estados y trazabilidad (base)](#6.2-estados-y-trazabilidad-\(base\))

[6.3 Reglas base del MVP](#6.3-reglas-base-del-mvp)

[6.4 Supuestos clave](#6.4-supuestos-clave)

[7\. Requerimientos por módulos](#7.-requerimientos-por-módulos)

[7.0 Consideraciones generales](#7.0-consideraciones-generales)

[7.0.1 Carpeta digital por juego y autenticación compartida](#7.0.1-carpeta-digital-por-juego-y-autenticación-compartida)

[7.1 Autenticación y seguridad](#7.1-autenticación-y-seguridad)

[7.1.1 Objetivo](#7.1.1-objetivo)

[7.1.2 Actores/Roles](#7.1.2-actores/roles)

[7.1.3 Alcance](#7.1.3-alcance)

[7.1.4 Flujos principales](#7.1.4-flujos-principales)

[7.1.5 Reglas y validaciones](#7.1.5-reglas-y-validaciones)

[7.1.6 Criterios de aceptación](#7.1.6-criterios-de-aceptación)

[7.2 Usuarios y roles](#7.2-usuarios-y-roles)

[7.2.1 Objetivo](#7.2.1-objetivo)

[7.2.2 Actores/Roles](#7.2.2-actores/roles)

[7.2.3 Alcance](#7.2.3-alcance)

[7.2.4 Reglas y validaciones](#7.2.4-reglas-y-validaciones)

[7.2.5 Campos mínimos](#7.2.5-campos-mínimos)

[7.2.6 Criterios de aceptación](#7.2.6-criterios-de-aceptación)

[7.3 Catálogo de cartas](#7.3-catálogo-de-cartas)

[7.3.1 Objetivo](#7.3.1-objetivo)

[7.3.2 Actores/Roles](#7.3.2-actores/roles)

[7.3.3 Alcance](#7.3.3-alcance)

[7.3.4 Reglas de contexto (Pokémon/Magic)](#7.3.4-reglas-de-contexto-\(pokémon/magic\))

[7.3.5 Respaldo de catálogo y variantes](#7.3.5-respaldo-de-catálogo-y-variantes)

[7.3.6 Funcionalidades](#7.3.6-funcionalidades)

[7.3.7 Permisos](#7.3.7-permisos)

[7.3.8 Validaciones y manejo de fallas](#7.3.8-validaciones-y-manejo-de-fallas)

[7.3.9 Criterios de aceptación](#7.3.9-criterios-de-aceptación)

[7.4 Compras (Buylist / negociación)](#7.4-compras-\(buylist-/-negociación\))

[7.4.1 Objetivo](#7.4.1-objetivo)

[7.4.2 Actores/Roles](#7.4.2-actores/roles)

[7.4.3 Alcance](#7.4.3-alcance)

[7.4.4 Reglas de contexto](#7.4.4-reglas-de-contexto)

[7.4.5 Estados de compra](#7.4.5-estados-de-compra)

[7.4.6 Reglas de negocio](#7.4.6-reglas-de-negocio)

[7.4.7 Búsqueda y tarjeta de carta](#7.4.7-búsqueda-y-tarjeta-de-carta)

[7.4.8 Condición de cartas](#7.4.8-condición-de-cartas)

[7.4.9 Modo privacidad](#7.4.9-modo-privacidad)

[7.4.10 Flujo principal](#7.4.10-flujo-principal)

[7.4.11 Datos mínimos por compra](#7.4.11-datos-mínimos-por-compra)

[7.4.12 Validaciones](#7.4.12-validaciones)

[7.4.13 Criterios de aceptación](#7.4.13-criterios-de-aceptación)

[7.5 Inventario y movimientos](#7.5-inventario-y-movimientos)

[7.5.1 Objetivo](#7.5.1-objetivo)

[7.5.2 Actores/Roles](#7.5.2-actores/roles)

[7.5.3 Alcance](#7.5.3-alcance)

[7.5.4 Modelo operativo de inventario](#7.5.4-modelo-operativo-de-inventario)

[7.5.5 Movimiento de inventario](#7.5.5-movimiento-de-inventario)

[7.5.6 Stock compartido (bar y tienda)](#7.5.6-stock-compartido-\(bar-y-tienda\))

[7.5.7 Métricas operativas](#7.5.7-métricas-operativas)

[7.5.8 Validaciones](#7.5.8-validaciones)

[7.5.9 Criterios de aceptación](#7.5.9-criterios-de-aceptación)

[7.6 Ventas](#7.6-ventas)

[7.6.1 Objetivo](#7.6.1-objetivo)

[7.6.2 Actores/Roles](#7.6.2-actores/roles)

[7.6.3 Alcance](#7.6.3-alcance)

[7.6.4 Reglas de negocio](#7.6.4-reglas-de-negocio)

[7.6.5 Estados de pedido/venta](#7.6.5-estados-de-pedido/venta)

[7.6.6 Flujo principal](#7.6.6-flujo-principal)

[7.6.7 PDF imprimible](#7.6.7-pdf-imprimible)

[7.6.8 Integración con shopify](#7.6.8-integración-con-shopify)

[7.6.9 Validaciones](#7.6.9-validaciones)

[7.6.10 Criterios de aceptación](#7.6.10-criterios-de-aceptación)

[7.7 Clientes](#7.7-clientes)

[7.7.1 Objetivo](#7.7.1-objetivo)

[7.7.2 Actores/Roles](#7.7.2-actores/roles)

[7.7.3 Alcance](#7.7.3-alcance)

[7.7.4 Datos mínimos del cliente](#7.7.4-datos-mínimos-del-cliente)

[7.7.5 Reglas de negocio](#7.7.5-reglas-de-negocio)

[7.7.6 Flujos principales](#7.7.6-flujos-principales)

[7.7.7 Validaciones](#7.7.7-validaciones)

[7.7.8 Criterios de aceptación](#7.7.8-criterios-de-aceptación)

[7.8 Carpeta digital](#7.8-carpeta-digital)

[7.8.1 Objetivo](#7.8.1-objetivo)

[7.8.2 Superficies y dominios](#7.8.2-superficies-y-dominios)

[7.8.3 Actores/Roles](#7.8.3-actores/roles)

[7.8.4 Alcance](#7.8.4-alcance)

[7.8.5 Reglas de visibilidad y capacidades por tipo de usuario](#7.8.5-reglas-de-visibilidad-y-capacidades-por-tipo-de-usuario)

[7.8.6 Navegación, catálogo y stock](#7.8.6-navegación,-catálogo-y-stock)

[7.8.7 Carrito y creación de pedido](#7.8.7-carrito-y-creación-de-pedido)

[7.8.8 Validación de ubicación](#7.8.8-validación-de-ubicación)

[7.8.9 Cuenta Cliente Tienda (Kiosk/iPad)](#7.8.9-cuenta-cliente-tienda-\(kiosk/ipad\))

[7.8.10 Checkout para Cuenta Cliente Tienda (Kiosk)](#7.8.10-checkout-para-cuenta-cliente-tienda-\(kiosk\))

[7.8.11 Perfil de usuario](#7.8.11-perfil-de-usuario)

[7.8.12 Wishlist](#7.8.12-wishlist)

[7.8.13 Historial de pedidos](#7.8.13-historial-de-pedidos)

[7.8.14 Validaciones](#7.8.14-validaciones)

[7.8.15 Criterios de aceptación](#7.8.15-criterios-de-aceptación)

[7.9 Most Wanted (Página pública por TCG)](#7.9-most-wanted-\(página-pública-por-tcg\))

[7.9.1 Objetivo](#7.9.1-objetivo)

[7.9.2 Actores/Roles](#7.9.2-actores/roles)

[7.9.3 Alcance](#7.9.3-alcance)

[7.9.4 Reglas de contexto](#7.9.4-reglas-de-contexto)

[7.9.5 Contenido visible por carta](#7.9.5-contenido-visible-por-carta)

[7.9.6 Configuración desde backoffice](#7.9.6-configuración-desde-backoffice)

[7.9.7 Validaciones](#7.9.7-validaciones)

[7.9.8 Criterios de aceptación](#7.9.8-criterios-de-aceptación)

[8\. Integraciones](#8.-integraciones)

[8.1 Objetivo](#8.1-objetivo)

[8.2 Integraciones incluidas (MVP)](#8.2-integraciones-incluidas-\(mvp\))

[8.2.1 Proveedores de catálogo / precios](#8.2.1-proveedores-de-catálogo-/-precios)

[8.2.2 Google Maps API (Geolocalización / geofence)](#8.2.2-google-maps-api-\(geolocalización-/-geofence\))

[8.2.3 Shopify (flujo manual con ítem personalizado)](#8.2.3-shopify-\(flujo-manual-con-ítem-personalizado\))

[8.2.4 Email transaccional](#8.2.4-email-transaccional)

[8.2.5 WhatsApp (envío de cotización con hipervínculo)](#8.2.5-whatsapp-\(envío-de-cotización-con-hipervínculo\))

[8.2.6 Generación de PDF (picking list)](#8.2.6-generación-de-pdf-\(picking-list\))

[8.3 Integraciones explícitamente no incluidas (MVP)](#8.3-integraciones-explícitamente-no-incluidas-\(mvp\))

[8.4 Responsabilidades y prerrequisitos](#8.4-responsabilidades-y-prerrequisitos)

[9\. Requerimientos no funcionales](#9.-requerimientos-no-funcionales)

[9.1 Objetivo](#9.1-objetivo)

[9.2 Seguridad y acceso](#9.2-seguridad-y-acceso)

[9.3 Disponibilidad y resiliencia](#9.3-disponibilidad-y-resiliencia)

[9.4 Usabilidad y compatibilidad](#9.4-usabilidad-y-compatibilidad)

[9.5 Auditoría y trazabilidad](#9.5-auditoría-y-trazabilidad)

[9.6 Datos, backups y retención](#9.6-datos,-backups-y-retención)

[9.7 Ambientes y configuración](#9.7-ambientes-y-configuración)

[9.8 Privacidad y cumplimiento](#9.8-privacidad-y-cumplimiento)

[9.9 Criterios de aceptación](#9.9-criterios-de-aceptación)

[10\. Control de cambios (Change Requests)](#10.-control-de-cambios-\(change-requests\))

[10.1 Objetivo](#10.1-objetivo)

[10.2 ¿Qué se considera un cambio?](#10.2-¿qué-se-considera-un-cambio?)

[10.3 Proceso de solicitud](#10.3-proceso-de-solicitud)

[10.4 Registro y versionado](#10.4-registro-y-versionado)

# 1\. Resumen ejecutivo {#1.-resumen-ejecutivo}

## 1.1 Objetivo del proyecto  {#1.1-objetivo-del-proyecto}

Implementar una plataforma para Kidstop que permita administrar de forma confiable la **compra, venta e inventario** de cartas **singles** de *Pokémon TCG* y *Magic: The Gathering*, habilitando control de stock, operación de compradores con presupuesto y una experiencia digital para que los clientes consulten y realicen compras.

## 1.2 Alcance del MVP {#1.2-alcance-del-mvp}

El MVP contempla un sistema responsive compuesto por:

* **Panel administrativo web** para operar compras de singles, administración de inventario y procesos de venta, con roles **Administrador**, **Recepción** y **Comprador**.

* **Carpeta digital** orientada a clientes para navegar el inventario y realizar compras, con niveles de acceso **Público**, **Cliente** y **Cliente VIP** (compra remota).

## 1.3 Exclusiones principales {#1.3-exclusiones-principales}

Para evitar ambigüedades, se consideran fuera de alcance del MVP (salvo que se establezca explícitamente en este documento o mediante Change Request):

* Funcionalidades no descritas en la sección de requerimientos por módulo.

* Integraciones adicionales o procesos operativos que no estén especificados (p. ej. automatizaciones externas, integraciones no listadas).

## 1.4 Resultado esperado {#1.4-resultado-esperado}

Al finalizar el MVP, Kidstop contará con:

* Visibilidad y control del **stock actual** de singles.

* Capacidad de registrar y monitorear compras por **comprador** con **presupuesto**

* Una carpeta digital funcional para consulta y compra según el tipo de usuario.

# 2\. Diagnóstico y contexto {#2.-diagnóstico-y-contexto}

## 2.1 Situación actual {#2.1-situación-actual}

Kidstop es una tienda de productos TCG, actualmente enfocada principalmente en **Pokémon**, con la intención de ampliar su operación a otros TCG como **Magic: The Gathering**. Las operaciones actuales se sostienen principalmente en productos TCG y eventos, con procesos ya establecidos para dichas líneas de negocio.

## 2.2 Problemas identificados {#2.2-problemas-identificados}

Durante el levantamiento inicial se identificaron retos específicos al operar con **cartas singles**, principalmente:

* Dificultad para mantener **certeza del inventario** disponible en tiempo real.

* Complejidad para gestionar de forma ordenada la **compra de cartas singles** (registro, trazabilidad y control).

* Limitación para tomar decisiones de **restock** basadas en datos de venta y rotación del inventario de singles.

* Falta de una experiencia digital estructurada para que los clientes consulten el inventario y realicen compras de acuerdo con su nivel de acceso.

## 2.3 Oportunidad / Motivación {#2.3-oportunidad-/-motivación}

Una plataforma enfocada en la operación de singles permitirá estandarizar la compra/venta, mejorar el control de inventario y habilitar reportes que faciliten estrategias de restock. Adicionalmente, la implementación de una **carpeta digital** abre un canal para que clientes consulten y compren inventario de singles, mejorando la experiencia y el alcance comercial, especialmente para usuarios con permisos de compra remota (VIP).

# 3\. Definiciones y glosario {#3.-definiciones-y-glosario}

* **TCG (Trading Card Game):** Juego de cartas coleccionables donde se compran, venden e intercambian cartas para coleccionar o jugar.

* **Single (Carta single):** Carta individual vendida por unidad (a diferencia de productos sellados como boosters, ETBs, etc.).

* **Catálogo (Card Catalog):** Base de datos de cartas con su información de identificación (nombre, set/edición, número de coleccionista, etc.). No implica disponibilidad en inventario.

* **Variante (Variant):** Características que diferencian una carta dentro del mismo catálogo, por ejemplo: idioma, foil/no foil, edición especial o promo (según aplique).

* **Condición (Condition):** Estado físico de una carta. Comúnmente se clasifica como:  
  Jugada, Pristine, Mint.  
   *Nota:* La condición impacta el precio de compra/venta.

* **Inventario:** Existencia disponible de cartas singles registradas en el sistema para venta.

* **Stock:** Cantidad disponible de una carta (y variante/condición cuando aplique) en inventario.

* **Buylist (Compra de singles):** Proceso mediante el cual Kidstop compra cartas singles a clientes/proveedores y las ingresa al inventario.

* **Precio de referencia (Reference Price):** Precio externo o de mercado usado como base de cálculo (ej. fuente de precios definida). No necesariamente es el precio final de venta.

* **Precio de compra:** Precio que Kidstop paga por una carta al adquirirla (buylist).

* **Precio sugerido de venta:** Precio recomendado para vender una carta, calculado a partir de reglas internas (margen, referencia, condición, etc.).

* **Margen:** Diferencia entre precio de venta y costo (precio de compra). Puede expresarse como monto o porcentaje.

* **Orden de compra (Purchase Order):** Registro formal de una compra de singles que incluye ítems, totales, responsable y estado.

* **Orden de venta (Sales Order):** Registro formal de una venta que incluye items, totales, cliente y estado.

* **Carrito (Cart):** Lista temporal de cartas seleccionadas por un usuario antes de confirmar una compra.

* **Checkout:** Flujo final donde el usuario confirma datos necesarios (cliente/entrega/pago según aplique) para crear una orden.

* **Wishlist (Lista de deseos):** Lista donde un cliente puede guardar cartas que desea comprar, especialmente cuando no hay stock disponible.

* **Panel administrativo (Admin):** Interfaz web interna para operar el negocio (compras, inventario, ventas, usuarios, reportes).

* **Carpeta digital:** Interfaz orientada al cliente para navegar el inventario de singles y realizar compras según permisos.

* **Roles del Panel Administrativo:**

  * **Administrador:** Usuario con permisos de configuración y control general.

  * **Recepción:** Usuario operativo que apoya en procesos definidos (según permisos acordados).

  * **Comprador:** Usuario responsable de compras de singles y operación de presupuesto.

* **Roles de la Carpeta Digital:**

  * **Público:** Usuario sin autenticación o con acceso limitado.

  * **Cliente:** Usuario autenticado con permisos estándar.

  * **Cliente VIP:** Usuario con permiso de compra remota (según reglas del negocio).

# 4\. Alcance del proyecto {#4.-alcance-del-proyecto}

## 4.1 In-scope (MVP) {#4.1-in-scope-(mvp)}

El MVP incluye el desarrollo de una plataforma responsive para la operación de cartas **singles** de *Pokémon TCG* y *Magic: The Gathering*, compuesta por:

**A) Panel administrativo (Web)**

* Acceso y operación por roles: **Administrador**, **Recepción** y **Comprador**.

* Funcionalidades orientadas a la administración de compras de singles, control de inventario y procesos de venta, de acuerdo con los módulos descritos en este documento.

**B) Carpeta digital (Web)**

* Experiencia orientada a clientes para navegar inventario de singles y realizar compras de acuerdo con su nivel de acceso.

* Roles incluidos: **Público**, **Cliente** y **Cliente VIP** (permiso de compra remota).

**C) Responsive**

* El sistema se validará principalmente en **celulares, tablets, laptops y escritorio**, garantizando adaptación visual y operativa a diferentes tamaños de pantalla.

## 4.2 Out-of-scope (MVP) {#4.2-out-of-scope-(mvp)}

Se considera fuera del alcance del MVP (salvo que se especifique explícitamente en este documento o mediante Change Request):

* Funcionalidades, pantallas, reglas de negocio o integraciones **no descritas** en la sección de requerimientos por módulo.

* Automatizaciones o integraciones adicionales distintas a las definidas en el apartado de **Integraciones**.

* Cualquier cambio sustancial a los flujos acordados que implique nuevas reglas, estados, reportes o roles no contemplados.

## 4.3 Roadmap por fases (Fase 2 / Backlog no comprometido) {#4.3-roadmap-por-fases-(fase-2-/-backlog-no-comprometido)}

Cualquier funcionalidad identificada como mejora futura o no prioritaria para el MVP se documentará como **Fase 2 / Backlog**, y no se considera comprometida en tiempo/costo del MVP hasta que sea estimada y aprobada.

### **4.4 Supuestos y dependencias de alcance** {#4.4-supuestos-y-dependencias-de-alcance}

* Cualquier integración externa (por ejemplo, fuentes de catálogo/precios) depende de la disponibilidad del servicio y de que el cliente provea los accesos necesarios (cuentas, llaves, permisos, etc.).

* En caso de limitaciones técnicas o de disponibilidad de un proveedor externo, se podrán aplicar alternativas (por ejemplo, uso de caché, carga manual o fuentes sustitutas), las cuales se alinearán con el cliente y se documentarán.

# 5\. Usuarios, roles y permisos {#5.-usuarios,-roles-y-permisos}

## 5.1 Roles incluidos {#5.1-roles-incluidos}

El sistema contempla dos superficies principales: **Panel administrativo** y **Carpeta digital**. Cada una cuenta con roles y permisos diferenciados.

**A) Panel administrativo (Web)**

* **Administrador:** usuario con control general del sistema, configuración y acceso a módulos administrativos según se defina.

* **Recepción:** usuario operativo con permisos limitados para ejecutar tareas definidas (por ejemplo, apoyo en procesos de compra/venta), sin acceso a configuraciones sensibles.

* **Comprador:** usuario responsable de gestionar compras de cartas singles, operar bajo un presupuesto asignado y registrar compras realizadas.

**B) Carpeta digital (Web)**

* **Público:** usuario sin autenticación o con acceso limitado a consulta, según reglas definidas.

* **Cliente:** usuario autenticado con permisos estándar de navegación y compra (según se establezca en los módulos correspondientes).

* **Cliente VIP:** usuario con permisos extendidos, incluyendo **compra remota** bajo las reglas del negocio.  
* **Cliente Tienda (Kiosk/iPad):** cuenta genérica de uso en tienda, destinada a clientes que no desean registrarse. Permite navegar el catálogo y generar pedidos desde un dispositivo (iPad) con sesión activa, pero con restricciones: **no puede** ver/editar perfil, **no puede** ver historial de pedidos, ni modificar datos/credenciales de la cuenta. En el checkout se habilita un formulario breve para capturar **nombre, teléfono y correo** del cliente real, los cuales se asocian al pedido para fines de notificación (“pedido listo para recolección”).  
* *Nota:* Los pedidos generados en modo Kiosk se registran como pedidos normales, pero el **correo/nombre del cliente real** se almacena a nivel de pedido (no como actualización del perfil de la cuenta Kiosk).

## 5.2 Principios de permisos {#5.2-principios-de-permisos}

* Los permisos se asignan por **rol** y aplican por **módulo/acción** (por ejemplo: ver, crear, editar, aprobar, cancelar, exportar).

* El sistema debe impedir acciones no autorizadas tanto a nivel de interfaz como a nivel de reglas del sistema.

* Los permisos específicos se documentan en la **matriz de permisos por módulo**.

## 5.3 Matriz de permisos por módulo {#5.3-matriz-de-permisos-por-módulo}

La siguiente matriz define los permisos mínimos del MVP. Cualquier permiso no listado se considera fuera de alcance.  
 Formato sugerido por acción:

* **Ver (Read)**

* **Crear (Create)**

* **Editar (Update)**

* **Eliminar/Cancelar (Delete/Cancel)**

* **Aprobar/Confirmar (Approve/Confirm)**

* **Exportar/Importar (Export/Import)** *(si aplica)*

**Nota:** Cualquier permiso o rol no especificado explícitamente en el documento se considera **no incluido** en el MVP, salvo aprobación mediante Change Request.

### 5.3.1 Roles {#5.3.1-roles}

* **Administrador**  
* **Recepción**  
* **Comprador**  
* **Cliente**  
* **Cliente VIP**  
* **Cliente Tienda (Kiosk/iPad)**

### 5.3.2 Permisos por módulo {#5.3.2-permisos-por-módulo}

**Backoffice**

| Módulo / Acción | Admin | Recepción | Comprador |
| ----- | ----- | ----- | ----- |
| **Autenticación / acceso al backoffice** | **✅** | **✅** | **✅** |
| **Cambiar contexto TCG (dropdown Pokémon/Magic)** | **✅** | **✅** | **✅** |
| **Catálogo: ver/listar/buscar cartas** | **✅** | **✅** | **✅** |
| **Catálogo: editar carta/variante manual** | **✅** | **✅** | **✅** |
| **Catálogo: ajustar precio público (carpeta digital)** | **✅** | **✅** | **✅** |
| **Compras: crear Draft / editar Draft** | **✅** | **✅** | **✅** |
| **Compras: enviar cotización (WhatsApp)** | **✅** | **✅** | **✅** |
| **Compras: marcar cotización (aceptada/rechazada)** | **✅** | **✅** | **✅** |
| **Compras: pasar a “Esperando precio”** | **✅** | **✅** | **✅** |
| **Compras: finalizar (sumar a stock)** | **✅** | **✅** | **✅** |
| **Inventario: ver stock y movimientos** | **✅** | **✅** | **✅** |
| **Inventario: ajustes manuales (+/-)** | **✅** | **❌** | **❌** |
| **Ventas/pedidos: ver pedidos (carpeta digital)** | **✅** | **✅** | **❌** |
| **Ventas/pedidos: cambiar estatus (En surtido / Listo / Completado)** | **✅** | **✅** | **❌** |
| **Ventas/pedidos: generar PDF picking list** | **✅** | **✅** | **❌** |
| **Clientes: ver/listar/buscar** | **✅** | **✅** | **❌** |
| **Clientes: bloquear/desbloquear** | **✅** | **✅** | **❌** |
| **Clientes: cambiar tipo (Cliente ↔ VIP)** | **✅** | **❌** | **❌** |
| **Most Wanted: configurar (agregar/quitar/ordenar/activar)** | **✅** | **✅** | **✅** |
| **Configuración (umbrales, horarios, geofence, etc.)** | **✅** | **❌** | **❌** |

**Carpeta Digital**

| Módulo / Acción | Público | Cliente | VIP | Kiosk |
| ----- | ----- | ----- | ----- | ----- |
| **Navegar catálogo / ver cartas** | **✅** | **✅** | **✅** | **✅** |
| **Wishlist (agregar/remover/ver)** | **❌** | **✅** | **✅** | **❌** |
| **Crear pedido (carrito/checkout)** | **❌** | **✅** | **✅** | **✅** |
| **Confirmar pedido** | **❌** | **✅ *(solo en tienda)*** | **✅ *(remoto)*** | **✅ *(en tienda)*** |
| **Perfil: ver/editar** | **❌** | **✅** | **✅** | **❌** |
| **Historial de pedidos** | **❌** | **✅** | **✅** | **❌** |

### 5.3.3 Notas y restricciones {#5.3.3-notas-y-restricciones}

* **Kiosk**: no puede ver/editar perfil ni historial; en checkout solicita **nombre y correo** del cliente real y los asocia al pedido.  
* **Inventario y datos sensibles**: el **Modo privacidad** en Compras debe ocultar información sensible al mostrar pantalla a terceros (según sección 7.4.9).  
* Cualquier excepción o permiso adicional se gestiona mediante el **Control de cambios**.

# 6\. Modelo de datos y reglas base {#6.-modelo-de-datos-y-reglas-base}

## 6.1 Entidades principales (conceptual) {#6.1-entidades-principales-(conceptual)}

El sistema se basa en las siguientes entidades principales:

* **Carta (Card):** registro base de una carta dentro del catálogo (por ejemplo: nombre, juego, set/edición, número de coleccionista).

* **Variante (Variant):** atributos que diferencian una carta (por ejemplo: idioma, foil/no foil, edición especial/promo cuando aplique).

* **Ítem de inventario (Inventory Item):** representación de stock disponible para venta. Puede incluir referencia a carta \+ variante y atributos operativos (por ejemplo: precio de venta, ubicación, estatus).

* **Compra (Buylist / Purchase):** transacción donde Kidstop adquiere cartas singles (incluye items, totales, responsable, estado).

* **Venta (Sale):** transacción donde Kidstop vende cartas singles (incluye items, totales, cliente, estado).

* **Cliente (Customer):** registro de cliente (público/autenticado/VIP según aplique).

* **Usuario (User):** cuenta interna o externa con rol, permisos y credenciales (según corresponda).

Nota: Los campos específicos por entidad se detallarán en cada módulo (Compras, Inventario, Ventas, Carpeta digital).

## 6.2 Estados y trazabilidad (base) {#6.2-estados-y-trazabilidad-(base)}

Para dar seguimiento operativo, el sistema manejará estados para entidades clave:

* **Compra:** estados definidos en el módulo de Compras (por ejemplo: cotizada, aceptada, rechazada, etc.).

* **Inventario:** estados del stock (por ejemplo: disponible, reservado, vendido) según se defina en el módulo de Inventario/Ventas.

* **Venta:** estados del proceso de venta y cumplimiento (según aplique).

El sistema deberá registrar la trazabilidad mínima necesaria para identificar:

* quién realizó acciones relevantes (por ejemplo: crear compra, confirmar venta, cambiar estatus), y

* cuándo se realizaron dichas acciones.

## 6.3 Reglas base del MVP {#6.3-reglas-base-del-mvp}

* **Certeza de stock:** el stock visible en el sistema debe corresponder al stock operable para venta según los estados definidos.

* **Descuento/afectación de inventario:** el momento exacto en el que el inventario se descuenta o reserva se define en los módulos operativos (Compras/Ventas).

* **Presupuesto por comprador:** el rol **Comprador** opera con un presupuesto asignado, y el sistema debe permitir visualizar compras realizadas y balance conforme a las reglas definidas.

* **Niveles de acceso:** la carpeta digital limita acciones según rol (Público/Cliente/VIP) y las reglas descritas en los módulos correspondientes.

## 6.4 Supuestos clave  {#6.4-supuestos-clave}

Para evitar interpretaciones distintas durante el desarrollo, el MVP parte de los siguientes supuestos (ajustables si se acuerda lo contrario):

* La representación de inventario se manejará al menos a nivel de **Carta \+ Variante** y stock disponible.

* La inclusión de **Condición** (Jugada/Pristine/Mint) se definirá explícitamente como parte del MVP o se documentará como fase posterior, según se acuerde en el módulo de Inventario/Compras.

* Las fuentes externas de catálogo/precio (si se usan) se consideran **dependencias** y su detalle se documenta en la sección de **Integraciones**.

* El backoffice operará con un “contexto de juego” (Pokémon/Magic) seleccionable desde navegación. Catálogo y Compras deberán filtrar su información con base en dicho contexto.

# 7\. Requerimientos por módulos {#7.-requerimientos-por-módulos}

## 7.0 Consideraciones generales {#7.0-consideraciones-generales}

Los requerimientos se describen por módulo usando una estructura consistente: **objetivo**, **actores/roles**, **alcance**, **flujos principales**, **reglas de negocio**, **validaciones**, y **criterios de aceptación**.  
Cualquier funcionalidad o comportamiento no descrito explícitamente en esta sección se considera **fuera de alcance del MVP**, salvo aprobación mediante **Change Request**.

### 7.0.1 Carpeta digital por juego y autenticación compartida {#7.0.1-carpeta-digital-por-juego-y-autenticación-compartida}

La carpeta digital se publicará en **dos sitios web independientes (dos dominios)**:

* Carpeta digital **Pokémon**  
* Carpeta digital **Magic**

Ambas carpetas digitales compartirán el **mismo sistema de autenticación** (cuentas unificadas). Es decir, un usuario registrado en la carpeta digital de Pokémon podrá iniciar sesión con las mismas credenciales en la carpeta digital de Magic, y viceversa.

**Reglas de separación por juego:**

* Cada dominio mostrará únicamente contenido del juego correspondiente (catálogo, inventario visible y navegación).  
* Las **órdenes de compra/venta** del usuario se visualizarán filtradas por el **tipo de TCG** del dominio actual.  
* El sistema deberá evitar cualquier mezcla de información entre juegos (por ejemplo, mostrar órdenes de Pokémon en el dominio de Magic).

**Criterios de aceptación:**

* Un usuario registrado en Pokémon puede iniciar sesión en Magic con el mismo email/contraseña.  
* En el dominio Pokémon, el usuario solo puede ver catálogo/ordenes relacionadas con Pokémon.  
* En el dominio Magic, el usuario solo puede ver catálogo/ordenes relacionadas con Magic.

**Nota de alcance técnico:**

* La autenticación compartida implica una base de usuarios única y un mecanismo de sesión compatible entre ambos dominios (la implementación específica se definirá durante desarrollo, sin alterar el comportamiento descrito en este documento).

## 7.1 Autenticación y seguridad {#7.1-autenticación-y-seguridad}

### 7.1.1 Objetivo {#7.1.1-objetivo}

Permitir el acceso seguro a la plataforma, garantizando autenticación, manejo de sesión y recuperación de contraseña para usuarios de panel administrativo y carpeta digital (cuando aplique).

### 7.1.2 Actores/Roles {#7.1.2-actores/roles}

* Panel administrativo: Administrador, Recepción, Comprador  
* Carpeta digital: Cliente, Cliente VIP (Público no requiere autenticación)

### 7.1.3 Alcance {#7.1.3-alcance}

**In-scope (MVP)**

* Inicio de sesión (login) para usuarios autenticados.  
* Cierre de sesión (logout).  
* Recuperación de contraseña vía email.  
* Cambio de contraseña (por usuario).  
* Reglas mínimas de sesión y vencimiento.

**Out-of-scope (MVP)**

* Single Sign-On (Google/Microsoft/Apple), MFA/2FA.  
* Gestión avanzada de políticas de seguridad (salvo lo descrito aquí).

### 7.1.4 Flujos principales {#7.1.4-flujos-principales}

* **Login:** usuario ingresa credenciales → sistema valida → permite acceso según rol.  
* **Recuperación:** usuario solicita recuperación → recibe enlace/código → define nueva contraseña.  
* **Cambio de contraseña:** usuario autenticado actualiza contraseña desde su perfil/configuración.

### 7.1.5 Reglas y validaciones {#7.1.5-reglas-y-validaciones}

* Las credenciales inválidas deben mostrar un mensaje genérico (sin revelar si el usuario existe).  
* El enlace/código de recuperación debe tener vigencia limitada.  
* La sesión debe expirar tras un periodo definido en una variable de entorno o por logout manual.  
* La contraseña debe cumplir una política mínima (longitud mínima recomendada) y no permitir contraseña vacía.

### 7.1.6 Criterios de aceptación {#7.1.6-criterios-de-aceptación}

* El usuario autenticado puede acceder solo a las pantallas permitidas por su rol.  
* Un usuario no autenticado no puede acceder a rutas protegidas.  
* La recuperación de contraseña permite restablecer el acceso mediante un mecanismo enviado al correo del usuario.  
* Al cerrar sesión, el usuario pierde acceso a rutas protegidas hasta volver a autenticarse.

## 7.2 Usuarios y roles {#7.2-usuarios-y-roles}

### 7.2.1 Objetivo {#7.2.1-objetivo}

Administrar usuarios internos del panel administrativo y asegurar que cada usuario opere con permisos conforme a su rol.

### 7.2.2 Actores/Roles {#7.2.2-actores/roles}

* Administrador (gestiona usuarios y roles)  
* Recepción / Comprador (usan el sistema con permisos limitados)

### 7.2.3 Alcance {#7.2.3-alcance}

**In-scope (MVP)**

* Alta de usuarios (crear).  
* Edición de usuario (actualizar datos y rol).  
* Activar/Desactivar usuario.  
* Listado y búsqueda de usuarios.  
* Asignación de rol: Administrador / Recepción / Comprador.

**Out-of-scope (MVP)**

* Roles personalizados (crear nuevos roles desde UI), permisos granulares custom (salvo matriz acordada).  
* Gestión avanzada: equipos, jerarquías, permisos por sucursal.

### 7.2.4 Reglas y validaciones {#7.2.4-reglas-y-validaciones}

* Solo el rol **Administrador** puede crear/editar/desactivar usuarios.  
* Un usuario desactivado no puede iniciar sesión.  
* Cada usuario debe tener exactamente un rol asignado.

### 7.2.5 Campos mínimos {#7.2.5-campos-mínimos}

* Nombre  
* Email (único)  
* Rol  
* Estado (activo/inactivo)

### 7.2.6 Criterios de aceptación {#7.2.6-criterios-de-aceptación}

* El Administrador puede crear un usuario y asignarle un rol.  
* El sistema impide crear usuarios con email duplicado.  
* Al desactivar un usuario, este pierde acceso al sistema.  
* Un usuario ve únicamente funcionalidades permitidas por su rol (según matriz de permisos).

## 7.3 Catálogo de cartas {#7.3-catálogo-de-cartas}

### 7.3.1 Objetivo {#7.3.1-objetivo}

Proveer una experiencia de consulta y búsqueda de cartas singles para **Pokémon TCG** y **Magic: The Gathering** que permita:

* Identificar una carta y su variante,  
* Mantener un **catálogo interno** (respaldo) de **Carta \+ Variante** para operación,  
* Asignar un **precio de venta al público** por Carta \+ Variante, y  
* Facilitar su selección para procesos operativos (por ejemplo, compras).

### 7.3.2 Actores/Roles {#7.3.2-actores/roles}

* Panel administrativo: Administrador, Recepción, Comprador

### 7.3.3 Alcance {#7.3.3-alcance}

**In-scope (MVP)**

* Selector de **contexto de juego** (Poké mon/Magic) desde la navegación del backoffice.  
* Listado de cartas con búsqueda y filtros por juego.  
* Vista de detalle de la carta y sus variantes relevantes.  
* **Respaldo interno del catálogo** provisto por fuentes externas (proveedores):  
  * Persistir/actualizar registros de **Carta** y **Carta** \+ **Variante**.  
* Configuración de **precio de venta al** público para cada Carta \+ Variante dentro del catálogo interno.  
* Consulta de **precio de referencia** (si aplica) como dato informativo (dependiente de proveedor/fuente).

**Out-of-scope (MVP)**

* Creación manual completa de cartas desde cero (si no provienen de proveedor).  
* Normalización avanzada entre múltiples fuentes (de duplicación compleja).  
* Pricing dinámico avanzado (reglas complejas por condición/mercado) fuera de lo descrito.

### 7.3.4 Reglas de contexto (Pokémon/Magic) {#7.3.4-reglas-de-contexto-(pokémon/magic)}

* El catálogo opera bajo un **contexto de juego** seleccionado por el usuario (Pokémon o Magic).  
* El listado, búsqueda, filtros y resultados del catálogo deben mostrar **exclusivamente** información del juego seleccionado.  
* El sistema debe impedir la mezcla de cartas/variantes entre juegos al momento de seleccionar o usar una carta en flujos posteriores.

### 7.3.5 Respaldo de catálogo y variantes {#7.3.5-respaldo-de-catálogo-y-variantes}

Con el objetivo de operar inventario y precios de forma consistente, el sistema mantendrá un **catálogo interno** como respaldo del catálogo provisto por fuentes externas.

**Reglas**

* El catálogo interno se considera la **fuente operativa** para:  
  * búsqueda y selección de **Carta \+ Variante**, y  
  * consulta de **precio de venta al público**.  
* La fuente externa se utiliza como mecanismo de **sincronización/actualización** de datos base (carta/variante), pero el **precio público** es un dato propio del sistema.

### 7.3.6 Funcionalidades {#7.3.6-funcionalidades}

**A) Listado**

* Mostrar listado de cartas del catálogo interno filtrado por juego.  
* Elementos visibles sugeridos:  
  * Nombre de la carta  
  * Set/edición  
  * Identificador (por ejemplo, número de coleccionista cuando aplique)  
  * Variante(s) disponibles (cuando aplique)  
  * Precio de venta al público (si existe)  
  * Precio de referencia (si existe)

**B) Búsqueda**

* Búsqueda por nombre (mínimo).  
* Filtros por set/edición y/o identificador (cuando aplique).

**C) Filtros**  
 Filtros base sugeridos (ajustables por juego y disponibilidad de datos):

* Set/edición  
* Variante (idioma, foil/no foil, etc.)  
* Rareza (si está disponible)  
* Rango de precio (público y/o referencia, si aplica)

**D) Detalle de carta / variantes**

* Mostrar información base de la carta y sus variantes relevantes.  
* Mostrar y permitir editar (según permisos) el **precio de venta al público** por **Carta \+ Variante**.

**E) Selección para operación**

* Permitir seleccionar una **Carta \+ Variante** desde el catálogo para utilizarla en flujos posteriores (por ejemplo, agregar a una compra), respetando el contexto de juego.

### 7.3.7 Permisos {#7.3.7-permisos}

* La modificación de **precio de venta al público** debe restringirse por rol (por ejemplo, Administrador y/o rol autorizado).  
  *Los permisos exactos se validarán en la matriz del capítulo 5\.*

### 7.3.8 Validaciones y manejo de fallas {#7.3.8-validaciones-y-manejo-de-fallas}

* Si un atributo no existe para un juego o no está disponible desde la fuente, se mostrará como “No disponible” sin bloquear el flujo.  
* Si la fuente externa no está disponible temporalmente, el sistema debe:  
  * permitir consultar el **catálogo interno** y sus precios públicos, y  
  * mostrar un mensaje indicando que la información de proveedor no pudo actualizarse.

### 7.3.9 Criterios de aceptación {#7.3.9-criterios-de-aceptación}

* Al seleccionar el contexto **Pokémon**, el catálogo solo muestra cartas/variantes de Pokémon.  
* Al seleccionar el contexto **Magic**, el catálogo solo muestra cartas/variantes de Magic.  
* Las cartas consultadas desde el proveedor quedan registradas/actualizadas en el **catálogo interno** con sus variantes.  
* El usuario autorizado puede asignar/actualizar el **precio de venta al público** para una **Carta \+ Variante**.  
* Si la fuente externa falla, el backoffice mantiene acceso al **catálogo interno** y al precio público.  
* El sistema impide seleccionar o usar cartas de un juego distinto al contexto activo.

## 7.4 Compras (Buylist / negociación) {#7.4-compras-(buylist-/-negociación)}

### 7.4.1 Objetivo {#7.4.1-objetivo}

Permitir al equipo de Kidstop registrar compras de cartas singles a vendedores (clientes/proveedores) desde el backoffice, con negociación por carta, control de presupuesto del comprador, captura de condición, registro de pagos y un flujo que garantice que las cartas compradas se publiquen con precio correcto antes de sumarse al stock disponible.

### 7.4.2 Actores/Roles {#7.4.2-actores/roles}

* **Comprador:** ejecuta compras y opera bajo presupuesto asignado.  
* **Recepción:** puede capturar compras (según matriz de permisos).  
* **Administrador:** configura reglas/límites y supervisa operación (según matriz de permisos).

### 7.4.3 Alcance {#7.4.3-alcance}

**In-scope (MVP)**

* Flujo de compra desde backoffice con **contexto de juego** (Pokémon/Magic).  
* Búsqueda de cartas (incluye **multibuscador**).  
* Tarjeta (card) por carta con información de referencia y métricas operativas (ver 7.4.7).  
* Lista de compra con items, condición y cálculo de total de oferta.  
* Registro/selección de **vendedor** (nuevo o existente).  
* Control por **presupuesto** del comprador (solo advertencia en MVP).  
* Advertencia por **límite de inventario por carta** (solo advertencia en MVP).  
* Flujo de estatus: **Draft → Cotizado → Esperando precio → Finalizado**, y **Rechazado**.  
* Envío de **cotización por WhatsApp** por **hipervínculo**.  
* Modal de confirmación para completar la compra.  
* Registro de pago: **Efectivo / Transferencia / Crédito en tienda** con opción de **dividir pago**.  
* Flujo post-compra: estado **Esperando precio** para ajustar precio público antes de sumar a stock.  
* Historial de compras con filtros por comprador/estatus/TCG.

**Out-of-scope (MVP)**

* Conciliación bancaria automática y facturación automatizada.  
* Aprobaciones jerárquicas obligatorias.

### 7.4.4 Reglas de contexto {#7.4.4-reglas-de-contexto}

* La compra opera bajo el **juego seleccionado** en el backoffice.  
* Búsqueda, selección de cartas, cotización y registro de compra deben pertenecer al **TCG activo**, sin mezclar Pokémon y Magic.

### 7.4.5 Estados de compra {#7.4.5-estados-de-compra}

* **Draft (Borrador):** compra en edición que aún no se envía al vendedor. Permite guardar y retomar posteriormente.  
* **Cotizado:** compra cuya oferta fue enviada al vendedor. Debe registrar fecha/hora de envío.  
* **Rechazado:** estado para cerrar una compra cuando:  
  * el vendedor rechaza la cotización (registrado manualmente por staff), o  
  * se decide cerrar un Draft sin proceder.  
* **Esperando precio:** cotización aceptada (registrado manualmente por staff); requiere ajustar **precio de venta al público** de las cartas compradas antes de sumarlas a stock.  
* **Finalizado:** precios públicos definidos; se **suma el stock** correspondiente y la compra queda cerrada.

### 7.4.6 Reglas de negocio {#7.4.6-reglas-de-negocio}

* **Presupuesto por comprador:** el sistema muestra presupuesto asignado (p. ej. mensual) y % utilizado.  
  * Si se excede el presupuesto, el sistema muestra **advertencia** pero **no bloquea** la compra en el MVP.  
* **Límite de inventario por carta:** el sistema considera un límite de 20 cartas  
  * Si se excede el límite, el sistema muestra **advertencia** pero **no bloquea** la compra en el MVP.  
* **Oferta negociable por carta:** el comprador define la oferta final por carta (por monto o ajuste porcentual, según UI).  
* **Condición por item:** cada carta comprada se registra con condición (ver 7.4.8).  
* **Envío de cotización por WhatsApp:**  
  * Desde un Draft, el usuario puede enviar una oferta al vendedor vía WhatsApp.  
  * El envío incluye un **hipervínculo** que permite consultar la cotización.  
  * Al enviar la oferta, la compra cambia de **Draft → Cotizado**.  
* **Aceptación/Rechazo de cotización (manual por staff):**  
  * Staff registra manualmente si la cotización fue **aceptada** o **rechazada**.  
  * Si es rechazada, se marca como **Rechazado**.  
  * Si es aceptada, avanza a **Esperando precio**.  
* **Regla clave de stock y publicación:**  
  * En **Esperando precio**, se ajusta el **precio de venta al público** (catálogo/carpeta digital) de las cartas compradas.  
  * Hasta que el precio público esté definido, esas cartas **no se suman al stock disponible**.  
  * Al completar el ajuste, la compra pasa a **Finalizado** y el stock se actualiza.

### 7.4.7 Búsqueda y tarjeta de carta {#7.4.7-búsqueda-y-tarjeta-de-carta}

Al buscar una carta (incluye multibuscador), el sistema mostrará resultados con una tarjeta por carta que incluya, como mínimo:

**Datos operativos visibles**

* Carta (nombre) y set/edición \+ identificadores relevantes (según el TCG).  
* Variante (cuando aplique: idioma, foil/no foil, etc.).  
* **Precio sugerido / referencia** (si está disponible desde proveedor/fuente).  
* **Inventario actual** (stock) y/o indicador de stock.  
* Controles para agregar a la compra.

**Métricas visibles por carta (dentro del módulo de compra)**

* **Fecha de última venta**  
* **Tiempo promedio en inventario**  
* **Cantidad de personas que la tienen en wishlist**

**Notas**

* Si alguna métrica no cuenta con datos suficientes, se muestra “—” sin bloquear el flujo.  
* Estas métricas se calculan con base en eventos de inventario/ventas y wishlist (definidos en módulos correspondientes).

### 7.4.8 Condición de cartas {#7.4.8-condición-de-cartas}

En la captura de items de compra, el sistema permitirá seleccionar la condición por carta (por item):

* **Jugada**  
* **Pristine**  
* **Mint**

### 7.4.9 Modo privacidad {#7.4.9-modo-privacidad}

El módulo de compras incluirá un **Modo privacidad** para mostrar la pantalla al vendedor sin exponer información sensible de Kidstop.

**Al activar Modo privacidad, se oculta/enmascara:**

* **Precio máximo de compra** (si aplica)  
* **Precio de referencia**  
* **Controles/indicadores sensibles de negociación** (por ejemplo, slider de negociación)

**Reglas**

* El modo privacidad solo afecta la **visualización**; no altera cálculos ni registros.  
* Al desactivarlo, se restablece la visualización completa.

### 7.4.10 Flujo principal {#7.4.10-flujo-principal}

1. Usuario selecciona el juego (Pokémon/Magic).  
2. Busca cartas (o multibuscador).  
3. Agrega cartas a la lista de compra; define oferta y condición por item.  
4. Captura/selecciona vendedor.  
5. Guarda como **Draft** (opcional) o continúa.  
6. Envía la oferta por **WhatsApp** (con hipervínculo) → estado **Cotizado**.  
7. Staff registra manualmente si la cotización fue **aceptada** (pasa a **Esperando precio**) o **rechazada** (pasa a **Rechazado**).  
8. En **Esperando precio**, se ajusta el **precio de venta al público** de las cartas compradas.  
9. Se confirma ajuste → se suma stock y la compra pasa a **Finalizado**.

### 7.4.11 Datos mínimos por compra {#7.4.11-datos-mínimos-por-compra}

**Compra**

* Comprador (usuario), TCG, fecha/hora  
* Total oferta, estatus (Draft/Cotizado/Rechazado/Esperando precio/Finalizado)  
* Método(s) de pago \+ montos (cuando aplique)  
* Indicadores: excede presupuesto (sí/no), excede límite inventario (sí/no)  
* Registro de envío de cotización (fecha/hora y enlace)

**Vendedor**

* Nombre, celular, email (opcional), notas (opcional)

**Items**

* Carta \+ Variante  
* Cantidad  
* Oferta final  
* Condición  
* Precio sugerido/referencia (si aplica)

### 7.4.12 Validaciones {#7.4.12-validaciones}

* No se puede enviar cotización (**Draft → Cotizado**) sin:  
  * vendedor,  
  * al menos 1 item,  
  * total de oferta calculado.  
* No se puede pasar a **Esperando precio** si la cotización no está en **Cotizado**.  
* No se puede **Finalizar** si las combinaciones compradas **Carta \+ Variante (+ condición si aplica)** no tienen **precio público definido**.  
* **Dividir pago:** la suma de montos por método debe coincidir con el total.  
* **Advertencias (no bloqueo en MVP):**  
  * Exceso de presupuesto: mostrar alerta y permitir continuar.  
  * Exceso de límite inventario: mostrar alerta y permitir continuar.

### 7.4.13 Criterios de aceptación {#7.4.13-criterios-de-aceptación}

* El contexto Pokémon/Magic filtra búsqueda, selección, cotización y registro; no se permite mezcla.  
* La tarjeta de carta muestra datos operativos y métricas (última venta, promedio en inventario, wishlist) o “—” si no hay datos.  
* El sistema permite guardar una compra como **Draft** y reanudarla.  
* El sistema permite enviar una cotización por WhatsApp con un **hipervínculo**; al enviarla, el estado cambia a **Cotizado**.  
* Staff puede marcar manualmente la cotización como **aceptada** (pasa a **Esperando precio**) o **rechazada** (pasa a **Rechazado**).  
* Si se excede presupuesto o límite de inventario, el sistema **advierte** pero permite continuar (MVP).  
* Al pasar a **Esperando precio**, el stock **no aumenta** todavía.  
* Al definir precios públicos, se suma el stock y la compra pasa a **Finalizado**.  
* El modo privacidad oculta referencia, precio máximo de compra y controles sensibles, sin romper el flujo.

## 7.5 Inventario y movimientos {#7.5-inventario-y-movimientos}

### 7.5.1 Objetivo {#7.5.1-objetivo}

Administrar el inventario de cartas singles de Kidstop de forma confiable, registrando existencias y movimientos (entradas/salidas/ajustes) y habilitando trazabilidad para operación (compras/ventas), métricas (última venta, tiempo en inventario) y publicación en carpeta digital.

### 7.5.2 Actores/Roles {#7.5.2-actores/roles}

* **Administrador:** control total, ajustes y configuración.  
* **Recepción:** operación diaria (según permisos).  
* **Comprador:** consulta/operación limitada relacionada a compras (según permisos).

### 7.5.3 Alcance {#7.5.3-alcance}

**In-scope (MVP)**

* Inventario operado por **TCG** (Pokémon / Magic) y filtrado por el contexto seleccionado en backoffice.  
* Existencias por **Carta \+ Variante** y, cuando aplique, **Condición**.  
* Estados de stock para control operativo (por ejemplo: Disponible, Esperando recolección, No disponible).  
* Registro de **movimientos** de inventario:  
  * Entradas (provenientes de compras finalizadas)  
  * Salidas (ventas finalizadas)  
  * Ajustes manuales (correcciones)  
* Historial de movimientos con filtros (fecha, tipo, usuario, TCG, carta).  
* Integración con módulo de Compras:  
  * En **Esperando precio**, las cartas **NO** incrementan stock.  
  * En **Finalizado**, las cartas **SÍ** incrementan stock.  
* Soporte para stock compartido entre **bar y tienda** (ver 7.5.6).

**Out-of-scope (MVP)**

* Gestión avanzada por ubicaciones múltiples con transferencias complejas.  
* Conteos cíclicos automatizados con escáner.

### 7.5.4 Modelo operativo de inventario {#7.5.4-modelo-operativo-de-inventario}

El inventario se gestionará como existencias operables para venta, asociadas al TCG correspondiente y a la combinación:

* **Carta \+ Variante (+ Condición, cuando aplique)**

Cada registro de inventario debe permitir:

* Ver stock actual disponible.  
* Identificar el origen (por ejemplo, compra finalizada) y el historial de cambios a través de movimientos.

### 7.5.5 Movimiento de inventario {#7.5.5-movimiento-de-inventario}

El sistema registrará un movimiento por cada evento relevante:

**Tipos de movimiento**

* **Entrada por compra:** cuando una compra pasa a **Finalizado**.  
* **Salida por venta:** cuando una venta se completa (definido en 7.6).  
* **Ajuste manual (+/-):** corrección de inventario por Admin (y/o rol autorizado).

**Datos mínimos por movimiento**

* Fecha/hora  
* Usuario responsable  
* Tipo de movimiento  
* TCG  
* Carta \+ Variante (+ Condición)  
* Cantidad (positiva o negativa)  
* Referencia (Compra/Venta/Manual)  
* Nota/motivo (recomendado para ajustes)

### 7.5.6 Stock compartido (bar y tienda)  {#7.5.6-stock-compartido-(bar-y-tienda)}

El inventario de singles será **compartido** entre bar y tienda.  
Esto implica:

* Un **solo stock** operativo por Carta \+ Variante (+ Condición) visible para ambas operaciones.  
* Las entradas/salidas impactan el mismo stock.  
* Si en el futuro se requiere separar existencias por ubicación, se documentará como fase posterior.

### 7.5.7 Métricas operativas {#7.5.7-métricas-operativas}

Para soportar métricas mostradas en otros módulos (Catálogo/Compras), el sistema deberá registrar trazabilidad mínima para calcular:

* **Fecha de última venta:** derivada de la última salida por venta de la carta.  
* **Tiempo promedio en inventario:** basado en fecha de entrada vs fecha de salida (histórico).  
* **Disponibilidad actual (stock):** stock resultante de entradas \- salidas ± ajustes.

Nota: Si no existen ventas o historial suficiente, las métricas se mostrarán como “—”.

### 7.5.8 Validaciones {#7.5.8-validaciones}

* El stock no debe permitir valores negativos en disponibilidad.  
* Ajustes manuales requieren motivo y rol autorizado.  
* No se debe incrementar stock por compras en estado **Esperando precio**.

### 7.5.9 Criterios de aceptación {#7.5.9-criterios-de-aceptación}

* El inventario se filtra por TCG y no mezcla cartas entre Pokémon y Magic.  
* Una compra en **Esperando precio** no incrementa stock; al pasar a **Finalizado** sí lo incrementa.  
* Una venta completada decrementa stock y registra movimiento.  
* Los ajustes manuales generan movimientos con responsable y motivo.  
* El historial de movimientos permite rastrear cambios por carta y por fecha.  
* El stock es compartido entre bar y tienda.

## 7.6 Ventas {#7.6-ventas}

### 7.6.1 Objetivo {#7.6.1-objetivo}

Permitir al staff de Kidstop gestionar y completar ventas de cartas singles **originadas exclusivamente desde la Carpeta Digital**, incluyendo surtido en mostrador, confirmación de entrega/venta, emisión de un PDF imprimible para picking/entrega y notificación por email al cliente cuando su pedido esté listo para recolección.

### 7.6.2 Actores/Roles {#7.6.2-actores/roles}

* **Recepción:** surte pedidos y completa la entrega/venta.  
* **Administrador:** supervisa y ajusta operación (según permisos).  
* **Cliente / Cliente VIP:** realiza pedidos desde Carpeta Digital (origen único de ventas en MVP).

### 7.6.3 Alcance {#7.6.3-alcance}

**In-scope (MVP)**

* Recepción de pedidos provenientes de la Carpeta Digital para surtido en mostrador.  
* Listado de pedidos/ventas con filtros (estatus, fecha, cliente, TCG).  
* Vista de detalle de pedido con items (Carta \+ Variante \+ Condición cuando aplique).  
* Generación de **PDF imprimible** con lista de cartas del pedido (picking list).  
* **Código de venta** único por transacción.  
* Modal de confirmación al **completar la venta/entrega**.  
* Notificación por **email** al cliente cuando el pedido esté **listo para recolección**.  
* Integración operativa con **Shopify**: el **código de venta** se utilizará como **nombre del ítem personalizado** (custom item) en Shopify.

**Out-of-scope (MVP)**

* Ventas directas en mostrador (sin Carpeta Digital).  
* Pagos en línea y conciliación automática .  
* Fulfillment/shipping automatizado y facturación automatizada.  
* Integración con inventario de Shopify.

### 7.6.4 Reglas de negocio {#7.6.4-reglas-de-negocio}

* **Origen único (MVP):** toda venta debe originarse desde la **Carpeta Digital**.  
  * El backoffice no permite crear ventas manuales de mostrador en el MVP.  
* **Código de venta:** cada pedido/venta genera un **código único**.  
  * Este código se utilizará en Shopify como el **nombre del ítem personalizado** asociado a la venta.  
* **Inventario:** al completar la venta, el sistema genera una **salida de inventario** y registra movimientos (relación con 7.5).  
* **Notificación “Listo para recolección”:**  
  * Cuando el staff marca el pedido como listo, el sistema envía un **email**  al cliente.  
* **Confirmación de cierre:** completar la venta requiere confirmación mediante **modal** para evitar cierres accidentales.

### 7.6.5 Estados de pedido/venta {#7.6.5-estados-de-pedido/venta}

Estados para el MVP:

* **Nuevo / Recibido:** pedido creado desde Carpeta Digital.  
* **En surtido:** el staff comenzó a preparar el pedido.  
* **Listo para recolección:** pedido preparado; se envía notificación por email.  
* **Completado:** pedido entregado y venta finalizada; inventario descontado.  
* **Cancelado:** pedido cancelado por staff.

### 7.6.6 Flujo principal {#7.6.6-flujo-principal}

1. Cliente realiza pedido en Carpeta Digital (se crea pedido/venta en el sistema).  
2. Recepción visualiza el pedido en el listado y entra al detalle.  
3. Recepción genera/imprime **PDF** con lista de cartas (picking list).  
4. Recepción surte el pedido y lo marca como **Listo para recolección**.  
5. Sistema envía **email** al cliente indicando que el pedido está listo.  
6. En el momento de entrega, Recepción completa la venta y confirma en el **modal**.  
7. Sistema marca **Completado**, descuenta inventario y registra movimientos.

### 7.6.7 PDF imprimible {#7.6.7-pdf-imprimible}

El sistema generará un PDF por pedido que contenga:

* Código de venta  
* Cliente (nombre/identificador)  
* Fecha  
* TCG (Pokémon/Magic)  
* Lista de items:  
  * Carta  
  * Set/edición  
  * Variante  
  * Condición (si aplica)  
  * Cantidad  
* Notas (opcional)

### 7.6.8 Integración con shopify {#7.6.8-integración-con-shopify}

* La transacción se identificará mediante un **código de venta**.  
* Dicho código se utilizará en Shopify como el **nombre del ítem personalizado** (custom item) asociado a la transacción.

### 7.6.9 Validaciones {#7.6.9-validaciones}

* No se puede completar una venta sin confirmación en modal.  
* No se puede marcar “Listo para recolección” si no hay items en el pedido.  
* El **código de venta** debe ser único.  
* El email de notificación requiere que el cliente tenga email registrado; si no existe, el sistema lo indicará al staff (sin bloquear el flujo, salvo que se defina lo contrario).

### 7.6.10 Criterios de aceptación {#7.6.10-criterios-de-aceptación}

* Todas las ventas visibles en el backoffice provienen de la Carpeta Digital (no existe creación manual de mostrador en MVP).  
* Desde el detalle de un pedido se puede generar un **PDF imprimible** con la lista de cartas.  
* Al marcar un pedido como **Listo para recolección**, el sistema envía un **email** al cliente.  
* Para completar una venta se muestra un **modal de confirmación** y solo al confirmar se marca como completada.  
* Al completar la venta, el sistema descuenta inventario y registra movimientos.  
* Se genera un **código de venta** y se utiliza como **nombre del ítem personalizado** en Shopify.

## 7.7 Clientes {#7.7-clientes}

### 7.7.1 Objetivo {#7.7.1-objetivo}

Administrar la información de clientes necesaria para operar la Carpeta Digital y el proceso de ventas, incluyendo registro, clasificación (Cliente / VIP), control de comportamiento (bloqueos por pedidos no concretados), validación de elegibilidad de compra por ubicación (no VIP) y datos de contacto para notificaciones.

### 7.7.2 Actores/Roles {#7.7.2-actores/roles}

* **Administrador:** administración completa de clientes y reglas.  
* **Recepción:** consulta y gestión operativa (según permisos).  
* **Cliente / Cliente VIP:** registro y gestión de su perfil (en Carpeta Digital).

### 7.7.3 Alcance {#7.7.3-alcance}

**In-scope (MVP)**

* Registro de cliente desde Carpeta Digital (cuenta unificada para Pokémon y Magic).  
* Perfil de cliente (ver/editar datos básicos) en Carpeta Digital.  
* Clasificación por tipo de cliente:  
  * **Cliente**  
  * **Cliente VIP** (permiso de compra remota)  
* Listado de clientes en backoffice con búsqueda y filtros.  
* Visualización de historial básico de pedidos/ventas por cliente (resumen).  
* Regla de control: **bloqueo de compras** por “pedidos no concretados” (configurable).  
* Regla de elegibilidad: **validación de ubicación** para concretar compras de usuarios **no VIP** (Google Maps API).  
* Registro de datos de contacto para:  
  * notificación de “pedido listo para recolección” por email, y  
  * contacto vía teléfono/WhatsApp (si aplica).

**Out-of-scope (MVP)**

* CRM avanzado (segmentación, campañas, puntos/recompensas).  
* Verificación de identidad avanzada / KYC.

### 7.7.4 Datos mínimos del cliente {#7.7.4-datos-mínimos-del-cliente}

* Nombre(s) y apellidos (o nombre completo)  
* Email (único) — requerido para notificaciones  
* Teléfono (recomendado para WhatsApp)  
* Tipo de cliente (Cliente / VIP)  
* Estatus (Activo / Bloqueado)  
* Fecha de registro

### 7.7.5 Reglas de negocio {#7.7.5-reglas-de-negocio}

* **Cuenta unificada (Pokémon/Magic):** el cliente usa el mismo usuario/credenciales en ambas carpetas digitales; pedidos e historial se filtran por TCG según el dominio actual.  
* **VIP:** el cliente VIP cuenta con permisos extendidos (compra remota) definidos en el módulo de Carpeta Digital.  
* **Bloqueo por pedidos no concretados:**  
  * El sistema permitirá configurar un umbral (N) de pedidos no concretados.  
  * Al superar el umbral, el cliente queda en estatus **Bloqueado** y no podrá realizar nuevas compras.  
  * El bloqueo puede ser levantado por staff autorizado (según permisos).  
* **Validación de ubicación para compras (no VIP):**  
  * Los usuarios **Cliente (no VIP)** solo podrán **concretar pedidos** desde Carpeta Digital si habilitan su **ubicación** y el sistema valida que se encuentran **en tienda** mediante integración con **Google Maps API** (geolocalización / geofencing).  
  * Los usuarios **Cliente VIP** pueden concretar pedidos **sin** validación de ubicación.  
  * Si el usuario no concede permisos de ubicación o se encuentra fuera del perímetro definido, el sistema debe impedir la confirmación del pedido y mostrar un mensaje claro.

* **Notificaciones:** el email del cliente se usa para notificaciones transaccionales (por ejemplo, “pedido listo para recolección”).

### 7.7.6 Flujos principales {#7.7.6-flujos-principales}

**A) Registro y acceso**

1. Cliente se registra en Carpeta Digital (Pokémon o Magic).  
2. Puede iniciar sesión en ambos dominios con las mismas credenciales.  
3. Consulta/actualiza su perfil (datos básicos).

**B) Gestión en backoffice**

1. Staff consulta el listado de clientes.  
2. Filtra/busca clientes.  
3. Visualiza resumen de actividad (pedidos/ventas).  
4. Cambia tipo de cliente a VIP o revoca VIP (si tiene permisos).  
5. Bloquea/desbloquea cliente (si tiene permisos).

### 7.7.7 Validaciones {#7.7.7-validaciones}

* El email debe ser único por cliente.  
* Para enviar notificación “listo para recolección”, el cliente debe tener email registrado; si no, el sistema lo debe indicar.  
* Un cliente **bloqueado** no puede realizar nuevas compras.  
* Un cliente **no VIP** no puede confirmar pedido si:  
  * no habilita ubicación, o  
  * está fuera del perímetro de tienda.

### 7.7.8 Criterios de aceptación {#7.7.8-criterios-de-aceptación}

* El cliente puede registrarse y usar la misma cuenta en Pokémon y Magic.  
* El cliente puede ver/editar su perfil en Carpeta Digital.  
* El backoffice muestra un listado de clientes con búsqueda/filtros.  
* Se puede clasificar a un cliente como VIP y reflejar sus permisos.  
* Si el cliente supera el umbral de pedidos no concretados, el sistema lo bloquea y evita nuevas compras.  
* El staff puede desbloquear a un cliente (según permisos).  
* Usuario no VIP dentro de tienda \+ ubicación habilitada → puede confirmar pedido.  
* Usuario no VIP fuera de tienda o sin ubicación → no puede confirmar pedido.  
* Usuario VIP → puede confirmar pedido sin validación de ubicación.

## 7.8 Carpeta digital {#7.8-carpeta-digital}

### 7.8.1 Objetivo {#7.8.1-objetivo}

Proveer una experiencia web para clientes donde puedan consultar el inventario de cartas singles y realizar pedidos desde una **carpeta digital**, con control por tipo de usuario, separación por TCG en **dos dominios** (Pokémon y Magic) y reglas de compra (ubicación obligatoria para no VIP, compra remota para VIP), incluyendo un modo “kiosk” para uso en tienda desde iPad.

### 7.8.2 Superficies y dominios {#7.8.2-superficies-y-dominios}

La carpeta digital se publicará en **dos sitios web independientes (dos subdominios)**:

* Carpeta digital **Pokémon**  
* Carpeta digital **Magic**

Ambas compartirán el **mismo sistema de autenticación** (cuentas unificadas). Un usuario registrado en Pokémon puede iniciar sesión en Magic con las mismas credenciales y viceversa.  
 Las órdenes e historial se mostrarán **filtrados** por el TCG del dominio actual.

### 7.8.3 Actores/Roles {#7.8.3-actores/roles}

* **Público:** usuario sin autenticación (acceso limitado).  
* **Cliente:** usuario autenticado.  
* **Cliente VIP:** usuario autenticado con permisos extendidos (compra remota).  
* **Cliente Tienda (Kiosk/iPad):** cuenta “genérica” controlada por Kidstop para uso en tienda.  
* **Staff (Recepción/Admin):** surte pedidos en backoffice (ver 7.6).

### 7.8.4 Alcance {#7.8.4-alcance}

**In-scope (MVP)**

* Navegación del catálogo/inventario (según TCG del dominio).  
* Búsqueda y filtros (mínimo por nombre y set/edición).  
* Vista de detalle de carta.  
* Carrito y creación de pedido.  
* Registro / login compartido entre dominios.  
* Pantalla de perfil para clientes autenticados (no kiosk).  
* Wishlist (guardar cartas).  
* Reglas de compra por tipo de usuario:  
  * No VIP: validación de ubicación en tienda para confirmar pedido.  
  * VIP: compra remota sin validación de ubicación.  
* Historial de pedidos del usuario (filtrado por TCG del dominio).  
* Modo de uso en tienda con **iPad** utilizando **Cuenta Cliente Tienda (Kiosk)** y formulario de checkout para capturar datos del cliente real (nombre y correo).

**Out-of-scope (MVP)**

* Envíos y tracking.  
* Pagos en línea integrados.  
* Marketplace público con venta a terceros.

### 7.8.5 Reglas de visibilidad y capacidades por tipo de usuario {#7.8.5-reglas-de-visibilidad-y-capacidades-por-tipo-de-usuario}

* **Público:** puede navegar (según decisión), pero no puede confirmar pedidos ni ver historial.  
* **Cliente:** puede crear pedidos y confirmar sujeto a reglas de ubicación (no VIP).  
* **Cliente VIP:** puede crear y confirmar pedidos remotamente.  
* **Cliente Tienda (Kiosk/iPad):**  
  * Puede navegar y crear pedidos.  
  * **No puede** acceder a perfil, editar datos de cuenta, ver histórico de pedidos ni cambiar credenciales.

### 7.8.6 Navegación, catálogo y stock {#7.8.6-navegación,-catálogo-y-stock}

* Cada dominio muestra únicamente inventario del TCG correspondiente (Pokémon o Magic).  
* El inventario mostrado corresponde al **stock disponible** (relación con 7.5).  
* Las cartas en wishlist no reservan stock por sí solas.

### 7.8.7 Carrito y creación de pedido {#7.8.7-carrito-y-creación-de-pedido}

**Flujo base**

1. Usuario agrega cartas al carrito (Carta \+ Variante \+ Cantidad; condición si aplica).  
2. Usuario revisa carrito y confirma pedido.

**Reglas**

* Validar stock al momento de confirmar pedido:  
  * Si hay faltantes, el sistema debe permitir:  
    * **Agregar cartas faltantes a wishlist**, y  
    * **Continuar compra** sin las cartas fuera de stock.  
* El pedido generado queda disponible para surtido en backoffice (ver 7.6).

### 7.8.8 Validación de ubicación {#7.8.8-validación-de-ubicación}

Para **Cliente (no VIP)**, confirmar un pedido requiere validar que el usuario se encuentra en tienda.

**Requisitos**

* Solicitar permiso de ubicación al momento de confirmar compra (o antes).  
* Validar ubicación mediante integración con **Google Maps API** (geolocalización/geofence).  
* Si no concede permisos o está fuera del perímetro definido:  
  * bloquear confirmación,  
  * mostrar mensaje claro y opciones (reintentar/instrucciones).

**VIP**

* Cliente VIP puede confirmar pedido sin validación de ubicación.

### 7.8.9 Cuenta Cliente Tienda (Kiosk/iPad) {#7.8.9-cuenta-cliente-tienda-(kiosk/ipad)}

Kidstop contará con una cuenta especial para uso interno en tienda, la cual permanecerá iniciada en sesión en un **iPad** para clientes que no deseen crear una cuenta propia.

**Restricciones**

* La cuenta Kiosk **no puede**:  
  * editar perfil,  
  * ver historial de pedidos,  
  * ver/editar datos de cuenta,  
  * cambiar credenciales,  
  * acceder a configuraciones.  
* La cuenta Kiosk **sí puede**:  
  * navegar el inventario,  
  * armar carrito,  
  * confirmar pedido (sujeto a reglas del módulo).

### 7.8.10 Checkout para Cuenta Cliente Tienda (Kiosk) {#7.8.10-checkout-para-cuenta-cliente-tienda-(kiosk)}

Cuando el pedido se realice desde la cuenta Kiosk, el checkout deberá habilitar un formulario breve para capturar los datos del cliente real para fines de notificación:

**Campos mínimos**

* **Nombre**  
* **Correo electrónico**

**Reglas**

* Esta información se asocia al **pedido** (no a la cuenta Kiosk).  
* El correo capturado se utilizará para la notificación de “pedido listo para recolección” (relación con 7.6).  
* Validar formato de correo antes de permitir confirmar pedido.

### 7.8.11 Perfil de usuario {#7.8.11-perfil-de-usuario}

Para cuentas **Cliente** y **VIP** (no aplica a Kiosk):

* Pantalla de perfil para ver/editar datos básicos (nombre, email, teléfono).  
* Mostrar tipo de usuario (Cliente/VIP) y estatus (activo/bloqueado).  
* Acceso a historial de pedidos del dominio/TCG actual.

### 7.8.12 Wishlist {#7.8.12-wishlist}

* Permitir agregar/remover cartas a la wishlist.  
* Permitir ver wishlist del usuario.  
* Exponer contador agregado para métricas internas (relación con 7.3 / 7.4).  
* Notificación de restock al correo  
* **Regla restock:** cuando una carta pase de stock 0 → \>0, el sistema enviará un correo a los usuarios que tengan esa carta en wishlist (filtrado por TCG del dominio), con límite de 1 notificación por evento de restock.

### 7.8.13 Historial de pedidos {#7.8.13-historial-de-pedidos}

* Mostrar listado de pedidos del usuario filtrados por el TCG del dominio actual.  
* Mostrar detalle básico del pedido (items, estatus, código de venta si aplica).  
* **No disponible para cuenta Kiosk.**

### 7.8.14 Validaciones {#7.8.14-validaciones}

* Usuario bloqueado (7.7) no puede confirmar pedidos.  
* No VIP no puede confirmar sin validación de ubicación en tienda.  
* Kiosk:  
  * no muestra perfil/historial/cambios de cuenta,  
  * requiere nombre y correo en checkout.  
* Validar stock al confirmar pedido y aplicar comportamiento acordado para faltantes.  
* Mantener separación por dominio/TCG para catálogo e historial.

### 7.8.15 Criterios de aceptación {#7.8.15-criterios-de-aceptación}

* Existen dos dominios (Pokémon y Magic) con contenido filtrado por TCG.  
* Login compartido: un usuario registrado en un dominio puede iniciar sesión en el otro.  
* Los pedidos e historial se muestran filtrados por TCG según el dominio.  
* La cuenta Kiosk puede navegar y comprar, pero **no** puede ver/editar perfil ni ver historial.  
* En checkout de Kiosk, el sistema solicita **nombre y correo** y los asocia al pedido.  
* Usuario no VIP dentro de tienda \+ ubicación habilitada → puede confirmar pedido.  
* Usuario no VIP fuera de tienda o sin ubicación → no puede confirmar pedido.  
* Usuario VIP → puede confirmar pedido sin validación de ubicación.  
* El sistema valida stock al confirmar; permite wishlist \+ continuar sin out-of-stock.  
* Los pedidos creados se reflejan en backoffice para surtido.

## 7.9 Most Wanted (Página pública por TCG) {#7.9-most-wanted-(página-pública-por-tcg)}

### 7.9.1 Objetivo {#7.9.1-objetivo}

Proveer una página pública por cada TCG (**Pokémon** y **Magic**) que Kidstop pueda usar como **display en pantalla** dentro de tienda para mostrar las cartas que actualmente desean **comprar**, y permitir que esta lista sea **configurable desde el backoffice**.

### 7.9.2 Actores/Roles {#7.9.2-actores/roles}

* **Público:** visualiza la página “Most Wanted” (sin login).  
* **Administrador:** configura contenido y orden (según permisos).  
* **Comprador / Recepción:** puede editar/actualizar lista si se autoriza.

### 7.9.3 Alcance {#7.9.3-alcance}

**In-scope (MVP)**

* Dos páginas públicas independientes:  
  * **Most Wanted – Pokémon**  
  * **Most Wanted – Magic**  
* Visualización optimizada para **pantalla/TV** (modo display).  
* Contenido administrable desde backoffice:  
  * activar/desactivar cartas mostradas,  
  * ordenar prioridad,  
  * mostrar datos clave por carta (ver 7.9.5).  
* La página debe mostrar únicamente cartas del TCG correspondiente (no mezclar).  
* URL(s) públicas accesibles sin autenticación.

**Out-of-scope (MVP)**

* Captura directa de ofertas desde la página pública (interacción del cliente).  
* Analítica avanzada de vistas/clics (salvo que se acuerde explícitamente).

### 7.9.4 Reglas de contexto {#7.9.4-reglas-de-contexto}

* El contenido de **Most Wanted – Pokémon** solo puede contener cartas de Pokémon.  
* El contenido de **Most Wanted – Magic** solo puede contener cartas de Magic.  
* El backoffice debe permitir administrar la lista considerando el **contexto de juego**.

### 7.9.5 Contenido visible por carta {#7.9.5-contenido-visible-por-carta}

La tarjeta/listado de cada carta en “Most Wanted” mostrará, como mínimo:

* Nombre de la carta  
* Set/edición (cuando aplique)  
* Variante (cuando aplique: idioma, foil/no foil, etc.)  
* Indicador de prioridad (por ejemplo: “Alta / Media / Baja” o ranking)  
* Notas opcionales (por ejemplo: “Buscamos x copias”, “Solo Mint”, etc.) 

### 7.9.6 Configuración desde backoffice {#7.9.6-configuración-desde-backoffice}

El backoffice permitirá:

* Agregar cartas a la lista “Most Wanted” seleccionándolas desde el **Catálogo** (Carta \+ Variante).  
* Definir prioridad/orden de aparición.  
* Activar/desactivar elementos.  
* (Opcional) agregar nota corta por carta.

### 7.9.7 Validaciones {#7.9.7-validaciones}

* No se permite agregar una carta de Pokémon a la página de Magic y viceversa.  
* La página pública debe funcionar sin autenticación.  
* El orden/prioridad configurado en backoffice se refleja en la página pública.

### 7.9.8 Criterios de aceptación {#7.9.8-criterios-de-aceptación}

* Existen dos URLs públicas: Most Wanted Pokémon y Most Wanted Magic.  
* Cada página muestra únicamente cartas del TCG correspondiente.  
* El contenido se administra desde backoffice (agregar/quitar/ordenar/activar/desactivar).  
* La vista es legible y usable en formato display (pantalla/TV).  
* Los cambios aplicados en backoffice se reflejan en la página pública.

# 8\. Integraciones {#8.-integraciones}

## 8.1 Objetivo {#8.1-objetivo}

Definir las integraciones externas requeridas para el MVP, incluyendo propósito, alcance, dependencias y responsabilidades, para evitar ambigüedades durante el desarrollo y la estimación.

## 8.2 Integraciones incluidas (MVP) {#8.2-integraciones-incluidas-(mvp)}

### 8.2.1 Proveedores de catálogo / precios {#8.2.1-proveedores-de-catálogo-/-precios}

**Propósito:** obtener información base de cartas y, cuando aplique, precios de referencia.  
 **Alcance MVP:**

* Consumir datos de proveedores para poblar/actualizar el **catálogo interno** (Carta \+ Variante).  
* Mostrar **precio de referencia** cuando esté disponible.  
* Permitir operación con el catálogo interno aun cuando el proveedor no esté disponible.  
   **Dependencias:**  
* Accesos/llaves/credenciales a los proveedores que Kidstop defina (Price charting para pokemon y card kingdom para Magic).  
* Definición de campos mínimos requeridos (carta, set, variante, etc.).  
   **Notas:**  
* El **precio público** es administrado por Kidstop y no depende del proveedor.

### 8.2.2 Google Maps API (Geolocalización / geofence) {#8.2.2-google-maps-api-(geolocalización-/-geofence)}

**Propósito:** validar que usuarios **no VIP** puedan confirmar pedido solo si están **en tienda**.  
 **Alcance MVP:**

* Solicitar permisos de ubicación en checkout.  
* Validar ubicación contra el perímetro definido de la tienda (geofence).  
* Bloquear confirmación si no concede permisos o está fuera del perímetro.  
   **Dependencias:**  
* API Key de Google Maps y configuración provista por el cliente.  
* Definición del perímetro (coordenadas y radio/polígono) por parte de Kidstop.  
  * se tomará como válido: radio en metros o polígono; se requiere definición de sucursal(es)

### 8.2.3 Shopify (flujo manual con ítem personalizado) {#8.2.3-shopify-(flujo-manual-con-ítem-personalizado)}

**Propósito:** utilizar un **código de venta** generado por el sistema como identificador para registrar/cobrar la transacción en Shopify mediante un **ítem personalizado**.  
 **Alcance MVP:**

* El sistema genera un **código único de venta** por pedido/venta.  
* El staff utiliza dicho código de forma **manual** en Shopify:  
  * creando un **ítem personalizado** cuyo **nombre** es el **código de venta**.  
* El sistema muestra el código en el detalle del pedido/venta y en el PDF de picking (si aplica) para facilitar su captura.  
   **Fuera de alcance (MVP):**  
* Integración automática con Shopify vía API (crear órdenes, ítems, pagos o sincronización).  
* Conciliación automática entre Shopify y el sistema.  
   **Dependencias:**  
* Acceso operativo a Shopify por parte del staff (no se requieren credenciales/API para el sistema).

### 8.2.4 Email transaccional {#8.2.4-email-transaccional}

**Propósito:** enviar notificaciones transaccionales y soportar recuperación de contraseña.  
 **Alcance MVP:**

* Email “**Pedido listo para recolección**”.  
* Email “**Notificación de restock al correo**”.  
* Emails de **recuperación/restablecimiento de contraseña**.  
   **Dependencias:**  
* Proveedor de correo (SMTP o servicio transaccional) y credenciales.  
* Remitente (from), dominio y plantillas base definidas por Kidstop/cliente.

### 8.2.5 WhatsApp (envío de cotización con hipervínculo) {#8.2.5-whatsapp-(envío-de-cotización-con-hipervínculo)}

**Propósito:** enviar cotizaciones desde el módulo de Compras al vendedor con un enlace consultable.  
 **Alcance MVP:**

* Generar enlace/mensaje para envío por WhatsApp (deep link o mecanismo equivalente).  
* Registrar en el sistema el evento de envío (fecha/hora) y el enlace asociado.  
   **Notas:**  
* La aceptación/rechazo de la cotización se registra **manual por staff**.  
   **Dependencias:**  
* Teléfono del vendedor (capturado en compra) para facilitar el envío.

### 8.2.6 Generación de PDF (picking list) {#8.2.6-generación-de-pdf-(picking-list)}

**Propósito:** generar un PDF imprimible por pedido/venta con la lista de cartas a entregar.  
 **Alcance MVP:**

* PDF descargable/imprimible desde backoffice con:  
  * código de venta,  
  * cliente (nombre/correo),  
  * TCG,  
  * items (carta, variante, condición, cantidad).  
     **Dependencias:**  
* Definición de formato final del PDF (logo/branding opcional).

## 8.3 Integraciones explícitamente no incluidas (MVP) {#8.3-integraciones-explícitamente-no-incluidas-(mvp)}

* Pagos en línea integrados (Stripe/MercadoPago/Shopify Payments, etc.).  
* Envíos/logística y tracking.  
* Automatizaciones/BI avanzado y reportes.  
* Integración automática con Shopify vía API.

## 8.4 Responsabilidades y prerrequisitos {#8.4-responsabilidades-y-prerrequisitos}

Para iniciar desarrollo y pruebas de integraciones, el cliente deberá proveer:

* Llaves y accesos necesarios (Google Maps, correo, proveedores de catálogo/precio).  
* Definición del **geofence** de tienda (coordenadas y radio/polígono).  
* Remitente y dominio para correos \+ plantillas/branding mínimo.  
* Validación del flujo manual de Shopify (cómo capturan el código y dónde lo registran).  
* Ambientes y variables de configuración (staging/producción) cuando aplique.

# 9\. Requerimientos no funcionales {#9.-requerimientos-no-funcionales}

## 9.1 Objetivo {#9.1-objetivo}

Definir los requerimientos no funcionales del MVP para asegurar que la plataforma sea segura, estable, usable y operable en producción, estableciendo mínimos de performance, disponibilidad, auditoría y manejo de datos.

## 9.2 Seguridad y acceso {#9.2-seguridad-y-acceso}

* **Autenticación y sesiones:** rutas protegidas para backoffice y carpeta digital (cuando aplique), con expiración de sesión y logout.  
* **Control de acceso por rol:** el backoffice debe restringir acciones por rol (Admin/Recepción/Comprador) y la carpeta digital por tipo de usuario (Público/Cliente/VIP/Kiosk).  
* **Protección de datos sensibles:** no exponer información interna (inventario, referencias, precios máximos) cuando se active Modo privacidad.  
* **Gestión de credenciales:** contraseñas no visibles, recuperación de contraseña vía email.  
* **Seguridad de integración:** uso de llaves/API Keys (Google Maps, proveedores) mediante variables de entorno, nunca hardcodeadas.

## 9.3 Disponibilidad y resiliencia {#9.3-disponibilidad-y-resiliencia}

* **Operación degradada:** si el proveedor de catálogo/precio está fuera de servicio, el sistema debe seguir operando con el **catálogo interno**.  
* **Manejo de fallas:** mensajes claros ante errores de red y capacidad de reintentar acciones.  
* **Prevención de duplicados:** mecanismos para evitar pedidos/acciones duplicadas por doble click (idempotencia a nivel de UI/servidor cuando aplique).

## 9.4 Usabilidad y compatibilidad {#9.4-usabilidad-y-compatibilidad}

* **Responsive:** todos los módulos web deben ser responsivos y funcionar en celular/tablet/desktop.  
* **Compatibilidad objetivo:**  
  * Backoffice: navegadores modernos (Chrome/Edge/Safari recientes).  
  * Carpeta Digital: móvil y tablet; caso especial: iPad con cuenta Kiosk.  
* **Accesibilidad básica:** contrastes legibles, estados de error claros, y navegación consistente.

## 9.5 Auditoría y trazabilidad {#9.5-auditoría-y-trazabilidad}

El sistema debe registrar, como mínimo:

* Usuario que realizó acciones relevantes (crear/editar compra, enviar cotización, cambiar estatus, completar venta, ajustes de inventario).  
* Fecha/hora de la acción.  
* Referencia a entidad afectada (compra/venta/inventario/cliente).

## 9.6 Datos, backups y retención {#9.6-datos,-backups-y-retención}

* **Backups:** respaldos regulares de base de datos (frecuencia a definir según infraestructura).  
* **Retención:** mantener historial de movimientos y transacciones para trazabilidad (periodo mínimo a acordar).

## 9.7 Ambientes y configuración {#9.7-ambientes-y-configuración}

Definir al menos dos ambientes: **staging** y **producción** (si aplica para el MVP).  
Configuración por variables de entorno:

* llaves de Google Maps,  
* credenciales de email,  
* endpoints de proveedores,  
* dominios (Pokémon/Magic),  
* parámetros de geofence y umbrales (bloqueo por pedidos no concretados).

## 9.8 Privacidad y cumplimiento {#9.8-privacidad-y-cumplimiento}

* Aviso básico de privacidad / consentimiento de ubicación (para no VIP).  
* Manejo responsable de datos personales (correo, nombre, teléfono).  
* No almacenar más datos de los necesarios para el MVP.

## 9.9 Criterios de aceptación {#9.9-criterios-de-aceptación}

* El sistema restringe accesos por rol y tipo de usuario.  
* Las acciones clave quedan registradas con usuario y timestamp.  
* El sistema opera con catálogo interno si fallan proveedores.  
* La carpeta digital funciona correctamente en móvil y en iPad (Kiosk).  
* La validación de ubicación bloquea confirmación no VIP fuera de tienda.  
* Las configuraciones (geofence, llaves, umbrales) son administrables por configuración y no requieren cambios de código para ajustes menores.

# 10\. Control de cambios (Change Requests) {#10.-control-de-cambios-(change-requests)}

## 10.1 Objetivo {#10.1-objetivo}

Establecer el proceso para solicitar, evaluar y aprobar cambios al alcance del MVP, asegurando trazabilidad e impacto claro en costo, tiempo y riesgos.

## 10.2 ¿Qué se considera un cambio? {#10.2-¿qué-se-considera-un-cambio?}

Se considera cambio cualquier ajuste que implique:

* Nuevas pantallas o flujos no descritos.  
* Nuevas reglas de negocio no documentadas o cambios en reglas existentes.  
* Nuevas integraciones (o cambios de proveedor) o automatizaciones adicionales.  
* Cambios de permisos/roles más allá de la matriz definida.  
* Incremento significativo de complejidad (por ejemplo: multi-sucursal con inventario separado, pagos en línea, shipping, API Shopify, etc.).

## 10.3 Proceso de solicitud {#10.3-proceso-de-solicitud}

1. **Solicitud**: el cliente o GRID registra el cambio por escrito (WhatsApp/Email/Doc) describiendo:  
   1. qué se desea cambiar,  
   2. motivo/objetivo,  
   3. urgencia (si aplica).  
2. **Análisis** (GRID): se evalúa impacto en:  
   1. alcance técnico y funcional,  
   2. esfuerzo/costo,  
   3. timeline,  
   4. riesgos y dependencias.  
3. **Propuesta**: GRID entrega una propuesta de cambio con:  
   1. descripción final del cambio,  
   2. costo adicional (si aplica),  
   3. ajuste de fechas (si aplica),  
   4. supuestos actualizados.  
4. **Aprobación**: el cambio se considera aprobado únicamente cuando exista confirmación explícita (por escrito) por parte del cliente.  
5. **Ejecución**: el cambio se agenda e implementa según prioridad acordada.

## 10.4 Registro y versionado {#10.4-registro-y-versionado}

Todo cambio aprobado debe reflejarse en:

* **Historial de cambios** del documento (Control del documento),  
* actualización de secciones afectadas,  
* y, si aplica, actualización de cotización.

Cambios no aprobados se mantienen como **Backlog / Fase 2** sin compromiso de entrega.