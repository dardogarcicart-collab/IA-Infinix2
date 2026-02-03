# 🚀 Infinix AI v4 - Versión Optimizada

> **Estructura Limpia | Modular | Listo para Chrome**

## 📁 Estructura del Proyecto

```
IA-Infinix2/
├── index.html              ← PUNTO DE ENTRADA PRINCIPAL
├── js/                     ← Todos los scripts JavaScript
│   ├── config.js           ├─ Configuración centralizada
│   ├── logger.js           ├─ Sistema de logging
│   ├── plugins_system.js   ├─ Gestor de plugins
│   ├── user_profiles.js    ├─ Perfiles de usuario
│   ├── rules_engine.js     ├─ Motor de reglas
│   ├── learning_system.js  ├─ Simulación de aprendizaje
│   ├── ai_engine.js        ├─ Métricas de IA
│   ├── code_generator.js   ├─ Generación de código (6 lenguajes)
│   ├── debug_panel.js      ├─ Panel de debugging (Ctrl+D)
│   └── script.js           └─ Orquestrador principal
├── css/                    ← Estilos CSS
│   ├── styles.css          ├─ Estilos principales
│   └── visual.css          └─ Estilos visuales adicionales
├── assets/                 ← Recursos (imágenes, fuentes, etc)
├── docs/                   ← Documentación adicional
└── README.md              ← Este archivo
```

## 🚀 Cómo Ejecutar

### Opción 1: Servidor Local (Recomendado para Chrome)

```bash
# Con Python 3
python -m http.server 8000

# O con Node.js
npx http-server

# O con Live Server (VS Code)
# Instalar extensión: Live Server
# Click derecho en index.html → Open with Live Server
```

Luego abre: **http://localhost:8000**

### Opción 2: Abrir directamente
Simplemente abre `index.html` en Chrome (puede tener limitaciones con CORS en algunos casos)

## ✨ Características Implementadas

### 🤖 Sistema de IA
- ✅ 3 versiones (Infinix 4, Fanix 5, Infinix 6)
- ✅ Procesamiento de lenguaje natural
- ✅ Análisis de complejidad adaptativo
- ✅ Respuestas con estilos variados

### 🧮 Matemáticas
- ✅ Parser seguro (sin `eval()`)
- ✅ Operadores: `+`, `-`, `*`, `/`, `^`
- ✅ Funciones: `sin`, `cos`, `tan`, `log`, `ln`, `sqrt`
- ✅ Constantes: `π`, `e`
- ✅ Multiplicación implícita: `2x` = `2*x`
- ✅ Evaluación paso a paso

### 💻 Generación de Código
- ✅ 6 lenguajes: JavaScript, Python, Java, C++, HTML, CSS
- ✅ Análisis automático de intención
- ✅ Códigos funcionales y comentados
- ✅ Modal interactivo

### 🎮 Interfaz
- ✅ Tema oscuro/claro (persistente)
- ✅ Barra de herramientas matemáticas
- ✅ Panel de estadísticas en tiempo real
- ✅ Historial de conversación
- ✅ Panel de debug flotante (Ctrl+D)

### 🔧 Sistemas Avanzados
- ✅ Plugin System: extensible y modular
- ✅ User Profiles: múltiples perfiles con estadísticas
- ✅ Rules Engine: reglas evaluables dinámicamente
- ✅ Learning System: simulación de aprendizaje progresivo
- ✅ Logger: 4 niveles de logging (debug, info, warn, error)
- ✅ AI Engine: métricas y decisiones ponderadas

## 🎯 Cómo Usar

### Cálculos Matemáticos
```
Usuario: 2 + 2
Infinix: 4

Usuario: sin(π/2)
Infinix: 1

Usuario: √16
Infinix: 4

Usuario: x^2 + 3x - 5 cuando x=2
Infinix: 5
```

### Generación de Código
```
Usuario: Crea una función en JavaScript que sume dos números
Infinix: [Genera código funcional con explicación]

Usuario: Código Python para leer un archivo
Infinix: [Genera código con best practices]
```

### Cambiar Versión
Usa los botones en el header:
- **Infinix 4**: Especializada en ciencias exactas
- **Fanix 5**: Versión social (todas las capacidades + empatía)
- **Infinix 6**: Modo cuántico (3 mensajes / 10 min)

### Debug
Presiona **Ctrl+D** para abrir el panel de debugging que muestra:
- Estado de la aplicación
- Logs en tiempo real
- Plugins activos
- Perfil actual
- Métricas de rendimiento

## 🔐 Seguridad

✅ Sin `eval()`  
✅ Parser seguro (Shunting-yard + RPN)  
✅ Validación de entrada  
✅ XSS prevention  
✅ Config inmutable (Object.freeze)  

## 📊 Estadísticas

- **Total de código**: ~3000 líneas
- **Módulos**: 10 principales
- **Lenguajes soportados**: 6
- **Funciones matemáticas**: 10+
- **Navegadores**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 🛠️ Desarrollo

### Agregar un Plugin

```javascript
const miPlugin = {
    version: '1.0.0',
    init: function() {
        console.log('Mi plugin iniciado');
    },
    cleanup: function() {
        console.log('Mi plugin desactivado');
    }
};

PluginSystem.register('miPlugin', miPlugin);
PluginSystem.activate('miPlugin');
```

### Agregar una Regla

```javascript
RulesEngine.defineRule('miRegla', {
    priority: 100,
    condition: (ctx) => ctx.message.includes('hola'),
    action: (ctx) => {
        console.log('Detectado saludo');
    }
});
```

### Usar el Logger

```javascript
Logger.info('Mensaje de información', {datos: 'ejemplo'});
Logger.warn('Advertencia', {nivel: 'alto'});
Logger.error('Error', {codigo: 500});
Logger.debug('Debug', {variable: valor});
```

## 📚 Documentación Adicional

- [ARCHITECTURE.md](ARCHITECTURE.md) - Arquitectura detallada
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Referencia rápida de APIs
- [DEPLOYMENT.md](DEPLOYMENT.md) - Guía de deployment
- [contributing.md](contributing.md) - Guía de contribución

## 🎨 Personalización

### Cambiar tema
Haz click en el botón 🌙 del header (se guarda automáticamente)

### Cambiar personalidad de la IA
```javascript
state.personality = 'sarcastic'; // o 'friendly', 'academic', 'neutral'
```

### Ajustar respuestas
Modifica los pesos en `CONFIG.RESPONSE_STYLES` en `js/config.js`

## ✅ Testing en Chrome

1. Abre las DevTools: **F12**
2. Consola: Sin errores
3. Tab **Debug Panel**: Presiona Ctrl+D
4. Red: Todos los scripts cargan (200 OK)

## 📝 Licencia

MIT License - Úsalo libremente

---

**Versión**: 4.0.0  
**Última actualización**: Feb 3, 2026  
**Navegadores soportados**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

¡Disfruta usando Infinix AI! 🚀
