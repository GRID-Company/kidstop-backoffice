# ngrok - Compartir Servidor Local

Guía para exponer el servidor de desarrollo de Kidstop Backoffice a través de internet usando ngrok.

## ¿Qué es ngrok?

ngrok crea un túnel seguro desde internet público hacia tu servidor local (`localhost:3000`), generando una URL pública HTTPS temporal.

## Instalación

### 1. Instalar ngrok

ngrok ya está instalado vía Homebrew. Si necesitas reinstalarlo:

```bash
brew install ngrok
```

### 2. Autenticar ngrok (REQUERIDO - Solo una vez)

ngrok requiere una cuenta gratuita para funcionar:

1. **Crear cuenta** (si no tienes):
   - Visita: https://dashboard.ngrok.com/signup
   - Regístrate con email o GitHub

2. **Obtener authtoken**:
   - Inicia sesión en: https://dashboard.ngrok.com/get-started/your-authtoken
   - Copia tu authtoken

3. **Configurar authtoken**:

   ```bash
   ngrok config add-authtoken TU_AUTHTOKEN_AQUI
   ```

   Ejemplo:

   ```bash
   ngrok config add-authtoken 2abc123def456ghi789jkl
   ```

Esto solo se hace **una vez**. El token se guarda en `~/.config/ngrok/ngrok.yml`

## Uso

### Opción 1: Script npm (Recomendado)

```bash
# Terminal 1: Levantar servidor de desarrollo
npm run dev

# Terminal 2: Exponer vía ngrok
npm run dev:ngrok
```

### Opción 2: Script helper con instrucciones

```bash
./scripts/ngrok-share.sh
```

Este script:

- Verifica que ngrok esté instalado
- Detecta si el servidor está corriendo en puerto 3000
- Muestra instrucciones para el Card Scanner
- Inicia el túnel con logs

### Opción 3: Comando directo

```bash
ngrok http 3000
```

## Output Esperado

```
ngrok

Session Status                online
Account                       Free
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123-def456.ngrok-free.app -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**URL pública**: `https://abc123-def456.ngrok-free.app`

## Inspector Web

Mientras ngrok está corriendo, abre en tu navegador:

```
http://127.0.0.1:4040
```

Funcionalidades:

- Ver todas las requests HTTP en tiempo real
- Inspeccionar headers, query params, body
- Ver responses completas
- **Replay** - Reenviar requests para debugging
- Filtrar por método, status code, path

## Casos de Uso Específicos

### 1. Testing del Card Scanner

El Card Scanner usa la API `getUserMedia` que **requiere HTTPS** para acceder a la cámara.

```bash
# Terminal 1
npm run dev

# Terminal 2
npm run dev:ngrok

# Compartir la URL HTTPS con tu colega
# Ejemplo: https://abc123.ngrok-free.app
```

**Importante**:

- El navegador pedirá permisos de cámara
- ngrok proporciona HTTPS automáticamente
- Funciona en cualquier dispositivo con cámara (móvil, laptop, tablet)

### 2. Demo a Clientes

```bash
# Compartir la URL pública temporalmente
# No requiere desplegar a producción
```

### 3. Testing en Dispositivos Móviles

```bash
# Abrir la URL ngrok en iPhone/Android
# Probar responsive, touch events, geolocalización
```

### 4. Webhooks de Desarrollo

```bash
# Configurar la URL ngrok en servicios externos
# Ejemplo: Stripe webhooks, PayPal IPN, etc.
```

## Opciones Avanzadas

### Con autenticación básica

```bash
ngrok http 3000 --basic-auth="usuario:password"
```

### Con dominio personalizado (requiere cuenta de pago)

```bash
ngrok http 3000 --domain=kidstop-demo.ngrok.io
```

### Con región específica

```bash
ngrok http 3000 --region=us  # us, eu, ap, au, sa, jp, in
```

## Limitaciones (Plan Free)

- ✅ HTTPS automático
- ✅ Inspector web
- ✅ Túneles ilimitados
- ⚠️ URL cambia en cada ejecución
- ⚠️ Límite de 40 conexiones/minuto
- ⚠️ Banner "Visit Site" en plan free

## Troubleshooting

### Error: "ngrok not found"

```bash
brew install ngrok
```

### Error: "Failed to start tunnel"

Verifica que el puerto 3000 esté libre:

```bash
lsof -i:3000
```

Si hay un proceso, mátalo:

```bash
kill -9 <PID>
```

### El servidor no responde

Asegúrate de que Next.js esté corriendo:

```bash
npm run dev
```

### La cámara no funciona en el Card Scanner

Verifica:

1. Estás usando la URL **HTTPS** (no HTTP)
2. El navegador tiene permisos de cámara
3. El dispositivo tiene cámara disponible

### Requests muy lentas

ngrok free tiene latencia adicional. Para mejor performance:

- Usar región más cercana (`--region`)
- Considerar plan de pago
- O desplegar temporalmente en Vercel/Netlify

## Detener ngrok

Presiona `Ctrl+C` en la terminal donde está corriendo ngrok.

## Alternativas

- **localtunnel** - Similar, open source
- **Cloudflare Tunnel** - Más robusto, gratis
- **serveo** - Basado en SSH
- **Tailscale** - Para redes privadas

## Seguridad

⚠️ **IMPORTANTE**:

- No compartas URLs ngrok públicamente (Twitter, GitHub, etc.)
- Las URLs son temporales pero públicas mientras estén activas
- Considera usar autenticación básica para demos sensibles
- No expongas datos de producción
- Revoca el túnel cuando termines (`Ctrl+C`)

## Recursos

- [Documentación oficial ngrok](https://ngrok.com/docs)
- [ngrok Dashboard](https://dashboard.ngrok.com/)
- [Inspector Web](http://127.0.0.1:4040) (cuando ngrok está corriendo)
