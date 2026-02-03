# 🤝 Guía de Contribución y Desarrollo

¡Gracias por tu interés en contribuir a Infinix AI! 🎉

Bienvenido al proyecto. Esta guía te ayudará a contribuir de forma efectiva.

---

## 📋 Tabla de Contenidos

1. [Antes de Empezar](#antes-de-empezar)
2. [Flujo de Trabajo](#flujo-de-trabajo)
3. [Estándares de Código](#estándares-de-código)
4. [Crear una Característica](#crear-una-característica)
5. [Reportar Bugs](#reportar-bugs)
6. [Proceso de Review](#proceso-de-review)

---

## 🚀 Antes de Empezar

### Requisitos

- Conocimiento de JavaScript ES6+
- Familiaridad con HTML5 y CSS3
- Git instalado
- Cuenta GitHub

### Configurar Entorno Local

```bash
# 1. Fork el repositorio
git clone https://github.com/TU_USUARIO/IA-Infinix2.git
cd IA-Infinix2

# 2. Crear rama de desarrollo
git checkout -b feature/tu-caracteristica

# 3. Abrir en navegador
open index.html  # Mac
# o
start index.html # Windows
# o
firefox index.html # Linux
```

---

## 🔄 Flujo de Trabajo

### 1. Elegir una Tarea

- Revisar [Issues abiertos](https://github.com)
- Asignar issue a ti mismo
- O crear un issue nuevo con tu propuesta

### 2. Crear Rama

```bash
# Feature
git checkout -b feature/nombre-caracteristica

# Fix
git checkout -b fix/nombre-bug

# Documentation
git checkout -b docs/nombre-documento
```

### 3. Implementar Cambios

Seguir estándares de código (ver sección siguiente)

### 4. Probar Cambios

```bash
# Abrir en navegador y probar manualmente
# Usar Console (F12) para verificar errores
# Usar DebugPanel (Ctrl+D) para inspeccionar estado
```

### 5. Hacer Commit

```bash
git add .
git commit -m "tipo: descripción breve"
git push origin feature/nombre
```

### 6. Pull Request

1. Crear PR en GitHub
2. Describir cambios y motivación
3. Incluir screenshots si es visual
4. Esperar review

---

## 📝 Estándares de Código

### Convención de Commits

```
tipo(scope): descripción

feat(parser): agregar operadores ternarios
fix(logger): corregir buffer límite
docs(readme): actualizar ejemplos
refactor(script): modularizar generarRespuesta

Tipos:
- feat: Nueva característica
- fix: Corrección de bug
- docs: Documentación
- refactor: Reorganización
- style: Formato (sin cambios funcionales)
- test: Tests
- chore: Mantenimiento
```

### JavaScript

**Naming:**
```javascript
// ✅ BIEN
const contadorMensajes = 0;
function generarRespuesta() { }
const AIEngine = { };
const LOADING_DURATION = 4000;

// ❌ MAL
const contador_mensajes = 0;
const x = 5;
var procesarDatos = () => { };
```

**Comentarios:**
```javascript
// ✅ BIEN
/**
 * Analiza un mensaje del usuario
 * @param {string} text - Texto a analizar
 * @returns {{complexity: number}}
 */
function analyzeMessage(text) { }

// ✅ BIEN: Explicar lógica compleja
// Usar shunting-yard para conversión segura a RPN
const tokens = tokenizeExpression(input);

// ❌ MAL
const x = 5; // Asignar 5 a x
```

**Indentación:**
```javascript
// ✅ BIEN: 4 espacios
function miFunction() {
    if (condition) {
        doSomething();
    }
}

// ❌ MAL
function miFunction(){
if (condition) {
doSomething();
}
}
```

### HTML

```html
<!-- ✅ BIEN: Semántico -->
<div id="debug-panel" role="region" aria-label="Debug">
    <button aria-label="Cerrar">✕</button>
</div>

<!-- ❌ MAL -->
<div>
    <div>Cerrar</div>
</div>
```

### CSS

```css
/* ✅ BIEN */
.message-bubble { }
.message-bubble--user { }
.button {
    background: var(--color-primary);
}

/* ❌ MAL */
.button {
    background: #ff3333;
}
```

---

## ✨ Crear una Característica

### Plugin Nuevo

```javascript
// nuevo_plugin.js
(function(global) {
    const MiPlugin = {
        version: '1.0.0',
        
        init() {
            Logger?.info('Plugin iniciado');
        },
        
        cleanup() {
            Logger?.info('Plugin limpiado');
        },
        
        procesar(data) {
            return data;
        }
    };
    
    global.MiPlugin = MiPlugin;
})(window);
```

Luego en `index.html`:
```html
<script src="nuevo_plugin.js"></script>
```

Y en `script.js`:
```javascript
PluginSystem.register('miPlugin', MiPlugin);
PluginSystem.activate('miPlugin');
```

### Nueva Regla

```javascript
RulesEngine.defineRule('mi_regla', {
    priority: 100,
    condition: (ctx) => ctx.message.includes('palabra'),
    action: (ctx) => {
        Logger?.info('Regla ejecutada');
    }
});
```

### Mejorar Parser

```javascript
// En tokenizeExpression o evalRPN
const funciones = {
    'atan': Math.atan,
    'asin': Math.asin,
    'acos': Math.acos
};
```

---

## 🐛 Reportar Bugs

### Formato Recomendado

```markdown
## Descripción
[Describe el bug brevemente]

## Pasos para Reproducir
1. [Primer paso]
2. [Segundo paso]

## Comportamiento Esperado
[Qué debería pasar]

## Comportamiento Actual
[Qué pasa realmente]

## Ambiente
- Navegador: Chrome 120
- OS: Windows 11
- Versión: 4.0.0

## Screenshots
[Si aplica]
```

---

## 👀 Proceso de Review

### Qué se Evalúa

- **Funcionalidad**: ¿Funciona?
- **Código**: ¿Legible y limpio?
- **Documentación**: ¿Está documentado?
- **Performance**: ¿Afecta velocidad?
- **Compatibilidad**: ¿Funciona en todos los navegadores?

### Ciclo

```
PR → Checks → Review → Ajustes → Aprobación → Merge
```

### Responder a Feedback

```bash
# Hacer cambios
git add .
git commit -m "refactor: feedback del review"
git push origin feature/nombre

# NO crear PR nuevo, actualiza el existente
```

---

## ✅ Checklist Antes de PR

- [ ] Cambios probados
- [ ] Commits con buena descripción
- [ ] Código sigue estándares
- [ ] Sin errores en console
- [ ] Documentación actualizada
- [ ] Probado en 2+ navegadores
- [ ] Rama actualizada con main

---

## 📞 Preguntas

- **Issues**: Bugs y features
- **Discussions**: Preguntas generales
- **Email**: Asuntos privados

---

## 📜 Código de Conducta

- Sé respetuoso con todos
- Acepta críticas constructivas
- Mantén discusiones profesionales
- No toleramos discriminación

---

## 🙏 ¡Gracias por Contribuir!

Tus contribuciones hacen que Infinix AI sea mejor para todos. 🎉