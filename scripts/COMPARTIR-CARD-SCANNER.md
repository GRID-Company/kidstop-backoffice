# Compartir Card Scanner - Guía Rápida

Instrucciones para exponer el Card Scanner de Kidstop Backoffice a un colega remoto.

## Para el Desarrollador (Tú)

### Setup Inicial (Solo la primera vez)

1. **Autenticar ngrok**:

   ```bash
   # Crear cuenta gratuita en https://dashboard.ngrok.com/signup
   # Obtener authtoken en https://dashboard.ngrok.com/get-started/your-authtoken

   ngrok config add-authtoken TU_AUTHTOKEN_AQUI
   ```

### Compartir el Card Scanner

1. **Levantar el servidor** (Terminal 1):

   ```bash
   cd kidstop-backoffice
   npm run dev
   ```

2. **Exponer vía ngrok** (Terminal 2):

   ```bash
   npm run dev:ngrok
   ```

   O usar el script helper:

   ```bash
   ./scripts/ngrok-share.sh
   ```

3. **Copiar la URL pública**:

   ```
   Forwarding    https://abc123-def456.ngrok-free.app -> http://localhost:3000
                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                 Esta es la URL que debes compartir
   ```

4. **Compartir con tu colega**:

   ```
   Hola! Puedes probar el Card Scanner en:
   https://abc123-def456.ngrok-free.app

   Credenciales de prueba:
   - Email: [email de prueba]
   - Password: [password de prueba]

   Navega a: /card-scanner (o la ruta correspondiente)
   ```

5. **Monitorear requests** (Opcional):
   - Abre http://127.0.0.1:4040 en tu navegador
   - Verás todas las requests que hace tu colega en tiempo real

6. **Detener cuando termines**:
   - Presiona `Ctrl+C` en la terminal de ngrok

## Para el Colega (Usuario Remoto)

### Requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Dispositivo con cámara (laptop, móvil, tablet)
- Conexión a internet

### Pasos para Probar el Card Scanner

1. **Abrir la URL compartida**:

   ```
   https://abc123-def456.ngrok-free.app
   ```

2. **Aceptar el banner de ngrok** (solo plan free):
   - Verás un banner "Visit Site"
   - Click en "Visit Site" para continuar

3. **Iniciar sesión**:
   - Usar las credenciales proporcionadas
   - Email: [proporcionado por el desarrollador]
   - Password: [proporcionado por el desarrollador]

4. **Navegar al Card Scanner**:
   - Buscar en el menú o sidebar
   - O usar la ruta directa si fue proporcionada

5. **Permitir acceso a la cámara**:
   - El navegador pedirá permisos de cámara
   - Click en "Permitir" / "Allow"
   - Si no aparece el prompt, revisar configuración del navegador

6. **Probar la funcionalidad**:
   - Escanear cartas
   - Probar búsqueda
   - Reportar cualquier bug o comportamiento inesperado

### Troubleshooting para el Colega

#### La cámara no funciona

1. Verifica que estás usando la URL **HTTPS** (no HTTP)
2. Verifica permisos de cámara en el navegador:
   - Chrome: `chrome://settings/content/camera`
   - Firefox: Preferencias > Privacidad y seguridad > Permisos > Cámara
   - Safari: Preferencias > Sitios web > Cámara
3. Prueba en modo incógnito/privado
4. Prueba en otro navegador

#### La página no carga

1. Verifica que la URL esté correcta
2. Verifica tu conexión a internet
3. Contacta al desarrollador (el túnel puede haber expirado)

#### Errores de autenticación

1. Verifica las credenciales
2. Intenta cerrar sesión y volver a entrar
3. Contacta al desarrollador

## Notas Importantes

### Para el Desarrollador

- ⚠️ La URL ngrok cambia cada vez que reinicias el túnel
- ⚠️ El túnel se cierra cuando presionas `Ctrl+C` o cierras la terminal
- ⚠️ Plan free tiene límite de 40 conexiones/minuto
- ✅ El inspector web (localhost:4040) te permite ver todas las requests
- ✅ Puedes usar "Replay" en el inspector para debugging

### Para el Colega

- ⚠️ Esta es una URL temporal, no la guardes como favorito
- ⚠️ La URL dejará de funcionar cuando el desarrollador cierre el túnel
- ⚠️ No compartas esta URL con terceros (puede contener datos sensibles)
- ✅ Funciona en cualquier dispositivo con cámara y navegador moderno

## Alternativas

Si ngrok no funciona o hay problemas:

1. **Videollamada con screen share**:
   - Zoom, Google Meet, Teams
   - El desarrollador muestra el Card Scanner en vivo

2. **Grabación de video**:
   - Loom, QuickTime, OBS
   - Grabar demo del Card Scanner

3. **Deploy temporal**:
   - Vercel, Netlify (si es solo frontend)
   - Render, Railway (si requiere backend)

## Recursos

- [Documentación completa ngrok](scripts/README-NGROK.md)
- [AGENTS.md - Sección Sharing](../AGENTS.md#sharing--remote-access)
- [ngrok Dashboard](https://dashboard.ngrok.com/)
