# 🚀 INFINIX AI - Sistema Avanzado de Inteligencia Artificial

![Infinix AI](https://img.shields.io/badge/version-4.0.0-red)
![Arquitectura](https://img.shields.io/badge/arquitectura-modular-blue)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/license-MIT-blue)

**Versión 4 - Arquitectura Modular Expandida**

Sistema vanilla JavaScript de IA conversacional con capacidades matemáticas, generación de código, análisis de patrones y simulación de aprendizaje. Diseñado para ser extensible, mantenible y sin dependencias externas.

## 🚀 Demo en Vivo

[Ver Demo](https://tu-usuario.github.io/infinix-ai/) _(Reemplaza con tu URL de GitHub Pages)_

## ✨ Características

### 🤖 Tres Versiones de IA

- **Infinix 4** - Motor de IA especializado en ciencias exactas
  - Matemáticas avanzadas
  - Física
  - Química
  - Programación

- **Fanix 5** - Motor de IA social con todas las capacidades de Infinix 4
  - Conversación natural
  - Empatía y soporte emocional
  - Todas las funciones de Infinix 4

- **Infinix 6 Quantum** (Modo Prueba) - Motor cuántico de última generación
  - Mecánica cuántica
  - Machine Learning
  - Simulaciones científicas complejas
  - Límite: 3 mensajes o 10 minutos

### 🧮 Herramientas Matemáticas

- Calculadora científica integrada
- Funciones trigonométricas (sin, cos, tan)
- Logaritmos (log, ln)
- Raíces cuadradas
- Potencias
- Constantes matemáticas (π, e)
- Resolver ecuaciones lineales
- Análisis de funciones
- Fracciones
---

## 📋 Tabla de Contenidos

- [Características Principales](#características-principales)
- [Arquitectura Modular](#arquitectura-modular)
- [Instalación y Uso](#instalación-y-uso)
- [Módulos Disponibles](#módulos-disponibles)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Desarrollo y Extensión](#desarrollo-y-extensión)
- [Compatibilidad](#compatibilidad)

---

## ✨ Características Principales

### 🎯 Capacidades de IA

- **Procesamiento de Lenguaje Natural**: Análisis semántico, detección de intención, complejidad adaptativa
- **Evaluación Matemática Segura**: Parser shunting-yard (sin eval), soporta:
  - Operaciones: `+`, `-`, `*`, `/`, `^`
  - Funciones: `sin`, `cos`, `sqrt`, `log`, etc.
  - Constantes: `π`, `e`
  - Multiplicación implícita: `2x` = `2*x`
  - Operadores unarios: `-x`

- **Generación de Código**: 6 lenguajes (Python, JavaScript, Java, C++, HTML, CSS)
- **Visualización Gráfica**: Canvas interactivo con grid, ejes, pan y zoom
- **Sistema de Personalidades**: Múltiples estilos (neutral, friendly, sarcastic, academic)
- **Comportamiento Humano-Simulado**: Delays dinámicos, tipeo animado, hesitaciones
- **Temas Oscuro/Claro**: Con persistencia automática
- **Historial de Sesión**: Almacenamiento local

### 🏗️ Arquitectura Modular

- Sistema de plugins extensible
- Perfiles de usuario con persistencia
- Motor de reglas configurable
- Simulación de aprendizaje progresivo
- Sistema de logs inteligente
- Panel de debug para desarrolladores

### 🔐 Seguridad

✅ Parser sin `eval()`  
✅ XSS prevention  
✅ Validación de entrada  
✅ CONFIG congelado  

---

## 🏗️ Arquitectura Modular

```
config.js (Configuración centralizada)
    ↓
logger.js (Sistema de logging)
    ↓
[Módulos Avanzados]
├── plugins_system.js
├── user_profiles.js
├── rules_engine.js
├── learning_system.js
    ↓
[Engines IA]
├── ai_engine.js
├── code_generator.js
    ↓
script.js (Orquestrador)
    ↓
debug_panel.js (Herramientas Dev)
```

---

## 📦 Módulos Disponibles

### Core (Fondación)

| Módulo | Descripción | Función Principal |
|--------|-------------|-------------------|
| **config.js** | Configuración centralizada congelada | `CONFIG.*` |
| **logger.js** | Sistema de logs con 4 niveles | `Logger.info/debug/warn/error` |

### Avanzados (Características)

| Módulo | Descripción | Función Principal |
|--------|-------------|-------------------|
| **plugins_system.js** | Gestor de plugins extensible | `PluginSystem.activate/register` |
| **user_profiles.js** | Perfiles de usuario con persistencia | `UserProfiles.createProfile` |
| **rules_engine.js** | Motor de reglas con prioridades | `RulesEngine.defineRule` |
| **learning_system.js** | Simulación de aprendizaje | `LearningSystem.recordExperience` |

### IA (Motores)

| Módulo | Descripción | Función Principal |
|--------|-------------|-------------------|
| **ai_engine.js** | Métricas y decisiones | `AIEngine.updateState` |
| **code_generator.js** | Generación de código 6 lenguajes | `CodeGenerator.generarCodigo` |

### Desarrollo

| Módulo | Descripción | Acceso |
|--------|-------------|--------|
| **debug_panel.js** | Panel visual de debugging | Ctrl+D |

---

## 💻 Instalación y Uso

### Requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Soporte para ES6+, Canvas, localStorage

### Pasos

1. **Clonar o descargar**
   ```bash
   git clone <repositorio>
   cd IA-Infinix2
   ```

2. **Abrir en navegador**
   ```bash
   # Solo abre index.html - no requiere servidor
   # Funciona completamente offline
   ```

3. **Usar atajos de teclado**
   - `Ctrl+L`: Limpiar chat
   - `Ctrl+H`: Mostrar historial
   - `Ctrl+D`: Abrir panel de debug

---

## 🎯 Ejemplos de Uso

### Matemáticas

```
Usuario: Resuelve 2x + 5 = 15
IA: x = 5
    [Explicación paso a paso]

Usuario: Grafica sin(x)
IA: [Abre modal con gráfico interactivo]
```

### Generación de Código

```
Usuario: Haz una función en Python que cuente palabras
IA: [Genera código Python con explicación]
```

### Conversación Natural

```
Usuario: ¿Qué es pi?
IA: Pi (π) ≈ 3.14159... [explicación contextual]
```

---

## 🛠️ Desarrollo y Extensión

### Crear un Plugin

```javascript
PluginSystem.register('miPlugin', {
    version: '1.0.0',
    init: () => console.log('Iniciado'),
    cleanup: () => console.log('Limpiado')
});

PluginSystem.activate('miPlugin');
```

### Crear una Regla

```javascript
RulesEngine.defineRule('detectorPalabra', {
    priority: 100,
    condition: (ctx) => ctx.message.includes('palabra'),
    action: (ctx) => Logger.info('Regla ejecutada')
});
```

### Registrar Hook

```javascript
PluginSystem.registerHook('before_response', async (data) => {
    // Procesar antes de generar respuesta
    return data;
});
```

### Agregar Experiencia de Aprendizaje

```javascript
LearningSystem.recordExperience('mathematics', 2);
LearningSystem.analyzePattern(mensaje, respuesta);
```

---

## 📊 APIs Principales

### Logger
```javascript
Logger.debug(msg, data)
Logger.info(msg, data)
Logger.warn(msg, data)
Logger.error(msg, data)
Logger.logDecision(name, metrics)
Logger.logStateChange(field, {old, new})
Logger.getRecent(n) → Array
Logger.getByLevel(level) → Array
Logger.export() → JSON
Logger.clear()
```

### PluginSystem
```javascript
PluginSystem.register(name, config) → boolean
PluginSystem.activate(name) → boolean
PluginSystem.deactivate(name) → boolean
PluginSystem.registerHook(name, callback) → void
PluginSystem.executeHook(name, data) → Promise
PluginSystem.status() → {registered, active}
```

### UserProfiles
```javascript
UserProfiles.createProfile(name, settings)
UserProfiles.selectProfile(name)
UserProfiles.getCurrentProfile() → Object
UserProfiles.updateStats(stat, increment)
UserProfiles.listProfiles() → Array
UserProfiles.deleteProfile(name)
UserProfiles.saveProfile() / loadProfile(name)
```

### RulesEngine
```javascript
RulesEngine.defineRule(name, config)
RulesEngine.evaluateRules(context) → Promise
RulesEngine.toggleRule(name, enabled)
RulesEngine.deleteRule(name)
```

### LearningSystem
```javascript
LearningSystem.recordExperience(area, difficulty)
LearningSystem.analyzePattern(message, response)
LearningSystem.suggestFocus() → string | null
LearningSystem.getExpertiseLevel() → string
LearningSystem.getStats() → Object
LearningSystem.adaptResponseQuality(quality) → number
```

---

## 🎨 Variables de Configuración

En `config.js`:

```javascript
CONFIG = {
    LOADING_DURATION: 4000,           // ms
    AI_RESPONSE_DELAY: 500,           // ms
    MAX_SHORT_TERM_MEMORY: 50,        // items
    RESPONSE_STYLES: { ... },         // pesos
    PERSONALITIES: ['neutral', ...],  // disponibles
    CORE_PLUGINS: ['math', 'code', ...],
    DEBUG_MODE: false                 // mostrar console logs
}
```

---

## 📱 Compatibilidad

| Navegador | Versión | Estado |
|-----------|---------|--------|
| Chrome | 90+ | ✅ |
| Firefox | 88+ | ✅ |
| Safari | 14+ | ✅ |
| Edge | 90+ | ✅ |
| Opera | 76+ | ✅ |
| Mobile | Moderno | ✅ |

---

## 🔍 Troubleshooting

**Logger no funciona**: Verificar orden de scripts en HTML

**Plugin no se activa**: Usar `PluginSystem.status()` para verificar

**Gráficos no se muestran**: Canvas debe estar disponible

**DebugPanel no aparece**: Presionar Ctrl+D

---

## 🤝 Contribución

Ver [contributing.md](contributing.md) para guía completa.

Pasos rápidos:
1. Fork el proyecto
2. `git checkout -b feature/nueva-feature`
3. Commit cambios
4. Push y Pull Request

---

## 📄 Licencia

MIT License - Libre para uso educativo y comercial

---

## 🎓 Hoja de Ruta (Roadmap)

### Próximas Mejoras

- [ ] Sistema de caché avanzado
- [ ] Soporte para LaTeX
- [ ] Más idiomas (en, pt, fr)
- [ ] API REST para integración
- [ ] PWA - Offline support
- [ ] Web Workers para paralelismo
- [ ] IndexedDB para persistencia
- [ ] Sincronización multi-dispositivo

### En Consideración

- Sistema de recomendaciones
- Análisis de sentimiento
- Generador de problemas
- Modo colaborativo

---

## 👥 Equipo y Autores

**Desarrollo Principal**
- Arquitectura modular y sistemas avanzados

**Contribuidores**
- Bienvenidas contribuciones de la comunidad

---

## 📞 Soporte y Comunidad

- 🐛 Reportar bugs: [Issues](https://github.com)
- 💬 Discusiones: [Discussions](https://github.com)
- 📧 Email: support@infinix-ai.local

---

**Última Actualización**: 2024  
**Versión**: 4.0.0 - Arquitectura Modular Expandida  
**Estado**: ✅ Activo y Mantenido
⭐ Si te gusta este proyecto, dale una estrella en GitHub!

Hecho con ❤️ y mucho ☕