/**
 * DEPLOYMENT.MD - Guía de Instalación y Deployment
 */

# 🚀 Guía de Instalación y Deployment

> Instrucciones para instalar, configurar y desplegar Infinix AI

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Instalación Local](#instalación-local)
3. [Desarrollo Local](#desarrollo-local)
4. [Testing](#testing)
5. [Deployment](#deployment)
6. [Troubleshooting](#troubleshooting)

---

## ✅ Requisitos Previos

### Hardware Mínimo

- Procesador: 1 GHz
- RAM: 512 MB
- Espacio disco: 10 MB
- Navegador: Moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### Software Requerido

- Git (opcional, para clonar)
- Editor de texto (cualquiera)
- Navegador web moderno

### Sin Requisitos:

- ❌ Node.js
- ❌ npm o yarn
- ❌ Servidor web (funciona sin él)
- ❌ Base de datos
- ❌ Dependencias externas

---

## 💻 Instalación Local

### Opción 1: Descargar ZIP

```bash
# 1. Descargar el ZIP desde GitHub
# 2. Extraer en la carpeta deseada
cd /ruta/a/IA-Infinix2

# 3. Abrir en navegador
# Windows
start index.html

# macOS
open index.html

# Linux
firefox index.html  # o tu navegador preferido
```

### Opción 2: Clonar desde Git

```bash
# 1. Clonar el repositorio
git clone https://github.com/usuario/IA-Infinix2.git
cd IA-Infinix2

# 2. (Opcional) Crear rama de desarrollo
git checkout -b development

# 3. Abrir en navegador
open index.html
```

### Opción 3: Servidor Local (Python)

Si necesitas un servidor HTTP local:

```bash
# Python 3
python -m http.server 8000

# O si usas Python 2
python -m SimpleHTTPServer 8000

# Luego acceder a http://localhost:8000
```

### Opción 4: Servidor Local (Node.js)

```bash
# Si tienes Node instalado
npx http-server

# O con live-server (refresca automáticamente)
npm install -g live-server
live-server
```

---

## 🛠️ Desarrollo Local

### Estructura de Directorios Recomendada

```
tu-proyecto/
├── IA-Infinix2/
│   ├── index.html
│   ├── script.js
│   ├── styles.css
│   ├── config.js
│   ├── logger.js
│   ├── plugins_system.js
│   ├── user_profiles.js
│   ├── rules_engine.js
│   ├── learning_system.js
│   ├── ai_engine.js
│   ├── code_generator.js
│   ├── debug_panel.js
│   ├── README.md
│   ├── contributing.md
│   ├── ARCHITECTURE.md
│   └── .gitignore
└── README.md (del proyecto general)
```

### Flujo de Desarrollo

```bash
# 1. Crear rama para nueva feature
git checkout -b feature/tu-feature

# 2. Hacer cambios
# - Editar archivos
# - Abrir en navegador para probar
# - Usar Ctrl+D para Debug Panel

# 3. Verificar en múltiples navegadores
# - Chrome
# - Firefox
# - Safari (si es Mac)
# - Edge (si es Windows)

# 4. Verificar que no hay errores
# F12 → Console (debe estar limpia)

# 5. Commit
git add .
git commit -m "feat: descripción"

# 6. Push y PR
git push origin feature/tu-feature
```

### Editor Recomendado

- **VS Code**: Gratis, extensiones útiles
- **Sublime Text**: Ligero y rápido
- **WebStorm**: Profesional (pago)
- **Atom**: Basado en comunidad

**Extensiones VS Code Recomendadas:**

```json
{
    "extensions": [
        "esbenp.prettier-vscode",
        "dbaeumer.vscode-eslint",
        "ritwickdey.LiveServer",
        "ms-python.python",
        "eamodio.gitlens"
    ]
}
```

---

## 🧪 Testing

### Testing Manual

#### 1. Funcionalidad Básica

```
[ ] Cargar página
[ ] Chat responde a mensajes
[ ] Historial se guarda
[ ] Tema oscuro/claro funciona
[ ] Atajos de teclado funcionan
```

#### 2. Matemáticas

```
[ ] 2 + 2 = 4
[ ] sin(π/2) = 1
[ ] √16 = 4
[ ] 2x + 5 = 13, resolver x
[ ] Graficar sin(x)
```

#### 3. Código

```
[ ] Generar código Python
[ ] Generar código JavaScript
[ ] Generar código Java
[ ] Generar código C++
[ ] Generar HTML
[ ] Generar CSS
```

#### 4. Perfiles

```
[ ] Crear nuevo perfil
[ ] Cambiar de perfil
[ ] Estadísticas se actualizan
[ ] Datos persisten al recargar
```

#### 5. Debug Panel

```
[ ] Abrir con Ctrl+D
[ ] Mostrar estado actual
[ ] Mostrar plugins activos
[ ] Limpiar logs
[ ] Exportar logs
```

#### 6. Navegadores (Compatibilidad)

```
[ ] Chrome
[ ] Firefox
[ ] Safari (Mac)
[ ] Edge
[ ] Opera
[ ] Mobile Chrome (Android)
[ ] Mobile Safari (iOS)
```

### Testing Automatizado (Futuro)

```javascript
// Estructura recomendada (no implementado aún)
describe('Parser Matemático', () => {
    it('debería resolver 2+2', () => {
        const result = evaluarMatematica('2+2');
        expect(result).toBe('2 + 2 = 4');
    });
});
```

---

## 🚀 Deployment

### Opción 1: GitHub Pages (Recomendado)

**Ventajas**: Gratis, automático, HTTPS

```bash
# 1. Crear repositorio en GitHub (si aún no existe)
git remote add origin https://github.com/usuario/IA-Infinix2.git

# 2. Push a main
git branch -M main
git push -u origin main

# 3. Ir a Settings → Pages
# 4. En "Source", seleccionar rama "main" y carpeta "/(root)"
# 5. Guardar
# 6. URL será: https://usuario.github.io/IA-Infinix2/
```

### Opción 2: Netlify

**Ventajas**: Automático, preview de PRs, sin mantenimiento

```bash
# 1. Conectar repositorio en Netlify.com
# 2. Configurar:
#    Build command: (dejar vacío)
#    Publish directory: (raíz del proyecto)
# 3. Deploy automáticamente en cada push
```

### Opción 3: Vercel

**Ventajas**: Performance optimizado, CLI disponible

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Desde la carpeta del proyecto
vercel

# 3. Seguir las instrucciones
# 4. URL será: https://infinix-ai.vercel.app/
```

### Opción 4: Servidor Propio

```bash
# 1. Copiar archivos a servidor web
scp -r IA-Infinix2/* usuario@server:/var/www/infinix/

# 2. Configurar nginx (ejemplo)
server {
    listen 80;
    server_name infinix.ejemplo.com;
    root /var/www/infinix;
    index index.html;
}

# 3. Recargar nginx
sudo systemctl reload nginx
```

### Checklist de Deployment

- [ ] Todos los archivos están presentes
- [ ] No hay errores en console (F12)
- [ ] Debug panel funciona (Ctrl+D)
- [ ] Probado en 2+ navegadores
- [ ] localStorage funciona
- [ ] Gráficos se renderizan correctamente
- [ ] Plugins se activan
- [ ] Performance aceptable

---

## 🔍 Troubleshooting

### El proyecto no carga

**Síntoma**: Página en blanco o error 404

**Soluciones**:

```bash
# 1. Verificar que todos los archivos estén presentes
ls -la *.js *.html *.css

# 2. Verificar rutas en index.html
# Los scripts deben ser relativos: src="config.js"
# No: src="/config.js" o src="./config.js"

# 3. Usar servidor HTTP si es necesario
python -m http.server 8000
```

### Errores en console

**Síntoma**: F12 muestra errores rojos

**Soluciones**:

```bash
# Verificar orden de scripts en index.html:
# 1. config.js
# 2. logger.js
# 3. plugins_system.js
# 4. user_profiles.js
# 5. rules_engine.js
# 6. learning_system.js
# 7. ai_engine.js
# 8. code_generator.js
# 9. script.js
# 10. debug_panel.js
```

### localStorage no funciona

**Síntoma**: Datos no persisten

**Causas posibles**:

```bash
# 1. Privado/Incógnito - localStorage limitado
# → Usar modo normal

# 2. CORS o dominio local
# → Si es file://, algunos navegadores restringen
# → Usar servidor HTTP local

# 3. Navegador muy antiguo
# → Actualizar navegador

# Verificar en console:
localStorage.setItem('test', 'value')
localStorage.getItem('test')
```

### Debug Panel no abre

**Síntoma**: Ctrl+D no abre el panel

**Soluciones**:

```javascript
// En consola, abrir manualmente:
DebugPanel.toggle()

// O verificar que está cargado:
console.log(typeof DebugPanel) // Debe ser 'object'
```

### Plugin no se activa

**Síntoma**: Plugin registrado pero no activo

**Verificar**:

```javascript
// En console:
PluginSystem.status()
// Debe mostrar: {registered: [...], active: [...]}

// Activar manualmente:
PluginSystem.activate('miPlugin')
```

### Gráficos no se muestran

**Síntoma**: Modal de gráfico vacío

**Causas**:

```bash
# 1. Canvas no soportado (muy raro en navegadores modernos)
# 2. Función no válida sintácticamente
# 3. Rango X incorrecto

# Verificar en console:
const canvas = document.getElementById('mathCanvas')
console.log(canvas.getContext('2d')) // Debe retornar objeto
```

### Performance lento

**Síntoma**: Tipeo lento, respuestas tardías

**Optimizaciones**:

```javascript
// Limpiar logs frecuentemente
Logger.clear()

// Reducir perfiles guardados
// Eliminar perfiles no usados

// Limpiar memoria caché
localStorage.removeItem('infinix_profile_viejo')

// Usar Debug Panel para monitorear
// Ctrl+D → Ver Memory usage
```

---

## 📚 Archivos de Configuración

### .gitignore Recomendado

```
# Node modules (si usas alguno)
node_modules/
npm-debug.log

# Archivos del sistema
.DS_Store
Thumbs.db
.vscode/settings.json

# Logs
*.log

# Archivos temporales
*.tmp
.temp/

# Ambiente
.env.local
.env.*.local
```

### .github/workflows (CI/CD Futuro)

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test
      - name: Deploy to GitHub Pages
        if: github.ref == 'refs/heads/main'
        run: # deployment script
```

---

## 🔐 Seguridad en Deployment

### Recomendaciones

```
✅ Usar HTTPS (requieren todos los hosts modernos)
✅ Actualizar navegadores regularmente
✅ No exponer credenciales en código
✅ Usar Content Security Policy (CSP)
✅ Validar todos los inputs de usuario
✅ No usar eval() - ✓ Ya implementado
```

### Headers de Seguridad (nginx)

```nginx
add_header X-Content-Type-Options "nosniff";
add_header X-Frame-Options "SAMEORIGIN";
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
```

---

## 📊 Monitoreo en Producción

### Google Analytics (Opcional)

```html
<!-- Agregar a index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Tracking (Sentry)

```javascript
// En script.js
if (typeof Sentry !== 'undefined') {
    Sentry.captureException(error);
}
```

---

## 📞 Soporte Post-Deployment

### Escalabilidad

Para grandes volúmenes:

```
1. Cachear en CDN (Cloudflare, etc.)
2. Comprimir archivos (gzip)
3. Minificar JS/CSS
4. Usar ServiceWorker para offline
5. Lazy loading de recursos
```

### Actualizaciones

```bash
# Actualizar en producción
git pull origin main
# Los cambios se recargan automáticamente en navegadores

# Forzar recarga en clientes
# Cambiar versión en config.js
CONFIG.VERSION = "4.0.1"
```

---

## 🎯 Próximos Pasos

1. **Testing**: Probar en todos los navegadores
2. **Deployment**: Publicar en GitHub Pages o similar
3. **Monitoreo**: Configurar análisis (opcional)
4. **Mantenimiento**: Actualizar regularmente
5. **Comunidad**: Recibir feedback de usuarios

---

## 📖 Referencias

- [README.md](README.md) - Documentación general
- [contributing.md](contributing.md) - Contribución
- [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitectura

---

**Última Actualización**: 2024-02-03  
**Versión**: 4.0.0  
**Status**: ✅ LISTO PARA DEPLOYMENT
