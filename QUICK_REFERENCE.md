/**
 * QUICK_REFERENCE.MD - Referencia Rápida para Desarrolladores
 */

# ⚡ Referencia Rápida - Infinix AI v4

> Guía de bolsillo para desarrolladores. Atajos, APIs y ejemplos frecuentes.

---

## 🎮 Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl+L` | Limpiar chat |
| `Ctrl+H` | Mostrar/ocultar historial |
| `Ctrl+D` | Abrir panel de debug |
| `Enter` | Enviar mensaje |

---

## 📞 APIs Principales

### Logger

```javascript
Logger.debug(msg, data)           // Información detallada
Logger.info(msg, data)            // Eventos importantes
Logger.warn(msg, data)            // Advertencias
Logger.error(msg, data)           // Errores
Logger.logDecision(name, metrics) // Decisiones IA
Logger.logStateChange(field, {old, new}) // Cambios de estado

// Consultas
Logger.getRecent(10)              // Últimas 10 entradas
Logger.getByLevel('error')        // Filtrar por nivel
Logger.export()                   // JSON completo
Logger.clear()                    // Limpiar historial
```

### PluginSystem

```javascript
PluginSystem.register(name, config)     // Registrar plugin
PluginSystem.activate(name)              // Activar
PluginSystem.deactivate(name)            // Desactivar
PluginSystem.registerHook(name, fn)     // Registrar hook
PluginSystem.executeHook(name, data)    // Ejecutar hooks
PluginSystem.status()                   // Ver estado
```

### UserProfiles

```javascript
UserProfiles.createProfile(name, settings)  // Crear
UserProfiles.selectProfile(name)            // Usar
UserProfiles.getCurrentProfile()            // Obtener actual
UserProfiles.updateStats(stat, increment)  // Actualizar stats
UserProfiles.listProfiles()                 // Listar todos
UserProfiles.deleteProfile(name)            // Eliminar
UserProfiles.saveProfile()                  // Guardar
UserProfiles.loadProfile(name)              // Cargar
```

### RulesEngine

```javascript
RulesEngine.defineRule(name, config)    // Definir regla
RulesEngine.evaluateRules(context)      // Evaluar todas
RulesEngine.toggleRule(name, enabled)   // Activar/desactivar
RulesEngine.deleteRule(name)            // Eliminar
```

### LearningSystem

```javascript
LearningSystem.recordExperience(area, difficulty)  // Registrar exp
LearningSystem.analyzePattern(msg, response)       // Analizar
LearningSystem.suggestFocus()                      // Sugerir área
LearningSystem.getExpertiseLevel()                 // Nivel actual
LearningSystem.getStats()                         // Estadísticas
LearningSystem.adaptResponseQuality(quality)      // Ajustar calidad
```

### AIEngine

```javascript
AIEngine.updateState(state, analysis)    // Actualizar estado
AIEngine.decideWeighted(options)          // Elegir opción
AIEngine.computeDecisionMetrics(analysis) // Calcular métricas
```

---

## 🔧 Ejemplos Rápidos

### Crear un Plugin

```javascript
PluginSystem.register('miPlugin', {
    version: '1.0.0',
    init: () => console.log('Iniciado'),
    cleanup: () => console.log('Limpiado')
});

PluginSystem.activate('miPlugin');
```

### Registrar un Hook

```javascript
PluginSystem.registerHook('before_response', async (data) => {
    console.log('Procesando:', data.message);
    // Modificar data
    data.modified = true;
    return data;
});
```

### Crear una Regla

```javascript
RulesEngine.defineRule('miRegla', {
    priority: 100,
    condition: (ctx) => ctx.message.includes('palabra'),
    action: (ctx) => {
        Logger.info('Regla ejecutada');
    }
});
```

### Crear un Perfil

```javascript
UserProfiles.createProfile('Mi Perfil', {
    theme: 'dark',
    personality: 'friendly',
    responseLength: 'medium'
});

UserProfiles.selectProfile('Mi Perfil');
```

### Registrar Experiencia

```javascript
LearningSystem.recordExperience('mathematics', 2);
LearningSystem.analyzePattern(userMsg, aiResponse);

// Verificar nivel
const nivel = LearningSystem.getExpertiseLevel();
if (nivel === 'expert') {
    // Respuestas más avanzadas
}
```

### Usar Debug Panel

```javascript
// Abrir con Ctrl+D
// O programáticamente:
DebugPanel.toggle();

// Comandos de consola:
DebugPanel.commands.state()     // Ver estado
DebugPanel.commands.logs()      // Ver logs
DebugPanel.commands.plugins()   // Ver plugins
```

---

## 🎨 Variables de Estado Global

```javascript
state = {
    // Contadores
    contadorMensajes,
    contadorCalculos,
    infinix6Mensajes,
    
    // Modo y Personalidad
    mode: 'chat',
    mood: 'calm',
    personality: 'neutral',
    
    // IA Interna
    energiaIA,
    estadoMental,
    nivelAnalisis,
    
    // Memoria
    context,
    shortTermMemory: [],
    
    // Estado Infinix 6
    infinix6Activo,
    tiempoRestante
}
```

---

## 📊 Constantes de CONFIG

```javascript
CONFIG.LOADING_DURATION         // ms de pantalla de carga
CONFIG.AI_RESPONSE_DELAY        // ms delay de respuesta
CONFIG.INFINIX6_TIME_LIMIT      // segundos de duración
CONFIG.MAX_SHORT_TERM_MEMORY    // items de memoria
CONFIG.RESPONSE_STYLES          // pesos de estilos
CONFIG.PERSONALITIES            // tipos disponibles
CONFIG.CORE_PLUGINS             // plugins predeterminados
CONFIG.DEBUG_MODE               // mostrar logs console
```

---

## 🔍 Debugging

### Ver Estado Completo

```javascript
// En consola
state                                  // Todo el estado
CONFIG                                 // Configuración
PluginSystem.status()                 // Plugins
UserProfiles.getCurrentProfile()      // Perfil actual
LearningSystem.getStats()             // Estadísticas
Logger.export()                       // Todos los logs
```

### Activar Todos los Logs

```javascript
CONFIG.DEBUG_MODE = true;
Logger.debug('Mensaje de debug', {data});
```

### Inspeccionar Plugins

```javascript
PluginSystem.status()
// {
//   registered: ['math', 'code', 'chat', 'graphics'],
//   active: ['math', 'code', 'chat', 'graphics']
// }
```

---

## 🔐 Seguridad - Nunca Hacer

```javascript
// ❌ NO EVALUAR INPUT DIRECTO
eval(userInput);
new Function(userInput);

// ❌ NO USAR innerHTML DIRECTAMENTE
element.innerHTML = userInput;

// ✅ SI USAR
evaluarMatematica(userInput);      // Parser seguro
addMessage(userInput, 'user');      // Usa textContent
```

---

## 📁 Estructura de Archivos

```
index.html          ← UI principal
├─ config.js        ← Cargar PRIMERO
├─ logger.js        ← Cargar SEGUNDO
├─ plugins_system.js
├─ user_profiles.js
├─ rules_engine.js
├─ learning_system.js
├─ ai_engine.js
├─ code_generator.js
├─ script.js        ← Orquestrador
└─ debug_panel.js   ← Herramientas dev

styles.css          ← Estilos
README.md           ← Documentación
contributing.md     ← Contribución
ARCHITECTURE.md     ← Detalles técnicos
```

**⚠️ IMPORTANTE**: Respeta el orden de carga en index.html

---

## 🚀 Snippets Útiles

### Agregar un Concepto Matemático

```javascript
// En conocimientoMatematico (script.js)
conocimientoMatematico["tu_concepto"] = "Tu explicación";
```

### Agregar una Función Matemática

```javascript
// En evalRPN (script.js)
const funciones = {
    'atan': Math.atan,
    'sinh': Math.sinh,
    // Agregar tu función aquí
};
```

### Agregar un Lenguaje de Código

```javascript
// En code_generator.js
CodeGenerator['generarTuLenguaje'] = function(concepts) {
    // Implementar generación
    return {
        lenguaje: 'TuLenguaje',
        codigo: '...',
        explicacion: '...'
    };
};
```

### Agregar un Estilo de Respuesta

```javascript
// En script.js
const estilos = {
    'miEstilo': {
        pesos: 1.0,
        transformar: (text) => {
            // Transformar texto
            return text;
        }
    }
};
```

---

## 📈 Performance Tips

### Monitorizar Performance

```javascript
console.time('operacion');
// ... código a medir
console.timeEnd('operacion');
```

### Limitar Logs

```javascript
// Logger automáticamente limita a 500 entradas
// Limpiar manualmente si necesario:
Logger.clear();
```

### Cachear Elementos DOM

```javascript
// Ya hecho en elementos = { }
// Para nuevos elementos:
const nuevoElemento = document.getElementById('id');
```

---

## 🎯 Flujo Típico de Procesamiento

```
1. Usuario escribe en input
2. Presiona Enter → sendMessage()
3. Validación y cacheo
4. processUserMessage()
5. analyzeMessage() → análisis
6. updateStateFromAnalysis() → actualizar estado
7. RulesEngine.evaluateRules() → ejecutar reglas
8. computeThinkingDelay() → calcular espera
9. addTypingBubble() → mostrar "pensando..."
10. generarRespuesta() → generar respuesta
11. LearningSystem hooks → registrar aprendizaje
12. revealTyping() → animar tipeo
13. Update profiles stats → actualizar estadísticas
```

---

## 💡 Buenas Prácticas

### ✅ HACER

```javascript
// Usar Logger para debugging
Logger.info('Mensaje', {data});

// Registrar experiencia
LearningSystem.recordExperience('area', difficulty);

// Definir reglas con prioridades claras
RulesEngine.defineRule('name', { priority: 100 });

// Usar hooks en lugar de modificar script.js
PluginSystem.registerHook('before_response', fn);

// Crear perfiles para usuarios distintos
UserProfiles.createProfile('usuario');
```

### ❌ NO HACER

```javascript
// No usar eval() directamente
eval(userInput);

// No modificar CONFIG directamente (está congelado)
CONFIG.LOADING_DURATION = 1000;

// No hacer calls síncronos largos
fetch(url); // Sin await en procesamientos críticos

// No clonar state innecesariamente
const newState = JSON.parse(JSON.stringify(state));

// No usar var
var x = 5;
```

---

## 📞 Contacto y Soporte

**Reportar Bugs**: Issues en GitHub  
**Preguntas**: Discussions o email  
**Contribuir**: Ver contributing.md  

---

## 🔗 Referencias Internas

- [README.md](README.md) - Documentación completa
- [ARCHITECTURE.md](ARCHITECTURE.md) - Detalles técnicos
- [contributing.md](contributing.md) - Guía de contribución
- Código comentado en cada archivo

---

**Última Actualización**: 2024-02-03  
**Versión**: 4.0.0  
**Para**: Desarrolladores de Infinix AI
