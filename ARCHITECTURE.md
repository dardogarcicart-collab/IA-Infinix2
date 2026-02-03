/**
 * ARCHITECTURE.MD - Documentación de Arquitectura Detallada
 */

# 🏗️ Arquitectura de Infinix AI v4

> Arquitectura Modular Expandida con Sistema de Plugins, Perfiles y Aprendizaje

---

## 📊 Diagrama de Dependencias

```
┌─────────────────────────────────────────────────────────┐
│                    index.html (Interfaz)                │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                  Capas de Carga                         │
├─────────────────────────────────────────────────────────┤
│ 1. config.js         - Configuración congelada ✓        │
│ 2. logger.js         - Sistema de logging ✓             │
│ 3. plugins_system.js - Gestor de plugins ✓              │
│ 4. user_profiles.js  - Perfiles de usuario ✓            │
│ 5. rules_engine.js   - Motor de reglas ✓                │
│ 6. learning_system.js- Simulación de aprendizaje ✓      │
│ 7. ai_engine.js      - Métricas y decisiones ✓          │
│ 8. code_generator.js - Generación de código ✓           │
│ 9. script.js         - Orquestrador principal ✓         │
│ 10. debug_panel.js   - Herramientas de dev ✓            │
└─────────────────────────────────────────────────────────┘
```

**Orden CRÍTICO**: Respetar el orden de carga para garantizar que dependencias estén disponibles.

---

## 🔄 Flujo de Procesamiento de Mensaje

```
USER INPUT
    ↓
┌─ VALIDACIÓN ──────────────────────────────────────┐
│ • Verificar no vacío                              │
│ • Cachear en DOM                                  │
│ • Actualizar contador                             │
└───────────────────────────────────────────────────┘
    ↓
┌─ ANÁLISIS ─────────────────────────────────────────┐
│ • analyzeMessage()                                │
│  - Longitud, palabras, complejidad                │
│  - Detección de intención                         │
│  - Conceptos clave                                │
│ • updateStateFromAnalysis()                       │
│  - Energía IA                                     │
│  - Nivel de análisis                              │
│ • Logger.logDecision()                            │
└───────────────────────────────────────────────────┘
    ↓
┌─ HOOKS PRE-RESPUESTA ──────────────────────────────┐
│ • PluginSystem.executeHook('before_response')    │
│  - Reglas ejecutadas (RulesEngine)                │
│  - Análisis de plugins                            │
│ • UserProfiles.updateStats()                      │
│  - Incrementar contador de mensajes               │
└───────────────────────────────────────────────────┘
    ↓
┌─ CÁLCULO DE DELAY ─────────────────────────────────┐
│ • computeThinkingDelay()                          │
│  - Basado en complejidad                          │
│  - Rango: 300-3000ms                              │
│ • addTypingBubble()                               │
│  - Mostrar indicador "pensando..."                │
└───────────────────────────────────────────────────┘
    ↓
┌─ GENERACIÓN DE RESPUESTA ──────────────────────────┐
│ • generarRespuesta()                              │
│  1. Casos especiales (versión, temas)             │
│  2. Conocimiento matemático                       │
│  3. Detección de código                           │
│  4. Evaluación matemática                         │
│  5. Respuestas base + estilo + personalidad       │
│ • Logger.info()                                   │
│  - Registrar respuesta generada                   │
└───────────────────────────────────────────────────┘
    ↓
┌─ HOOKS POST-RESPUESTA ─────────────────────────────┐
│ • PluginSystem.executeHook('after_response')     │
│  - LearningSystem.recordExperience()              │
│  - LearningSystem.analyzePattern()                │
│  - Actualización de estadísticas                  │
└───────────────────────────────────────────────────┘
    ↓
┌─ ANIMACIÓN DE TIPEO ──────────────────────────────┐
│ • revealTyping()                                  │
│  - Carácter por carácter                          │
│  - Hesitaciones en puntuación                     │
│  - Delays variados                                │
└───────────────────────────────────────────────────┘
    ↓
AI RESPONSE DISPLAYED
```

---

## 🔌 Sistema de Plugins

### Arquitectura

```javascript
{
    plugins: {},           // Registry de plugins disponibles
    activePlugins: {},     // Plugins actualmente activos
    hooks: {},             // Puntos de extensión
    
    register(name, plugin) // Registrar plugin
    activate(name)         // Activar plugin
    deactivate(name)       // Desactivar plugin
    registerHook(name, fn) // Registrar hook
    executeHook(name, data)// Ejecutar hooks
    status()               // Estado actual
}
```

### Plugins Core

```
┌─────────────────────────────────────────┐
│         PLUGINS CORE PREDEFINIDOS       │
├─────────────────────────────────────────┤
│ • math    - Evaluación matemática       │
│ • code    - Generación de código        │
│ • chat    - Conversación general        │
│ • graphics- Ploteo de gráficos          │
└─────────────────────────────────────────┘
```

### Puntos de Extensión (Hooks)

```
before_response
├─ Ejecutado: Antes de generarRespuesta()
├─ Datos: {message, analysis, isCode}
├─ Usuarios: RulesEngine
└─ Propósito: Modificar entrada antes de procesar

after_response
├─ Ejecutado: Después de generarRespuesta()
├─ Datos: {message, response, analysis}
├─ Usuarios: LearningSystem
└─ Propósito: Registrar estadísticas y patrones
```

---

## 👤 Sistema de Perfiles de Usuario

### Estructura de Perfil

```javascript
{
    name: "Default",
    created: "2024-02-03T...",
    
    // Preferencias
    theme: "dark",
    responseStyle: "normal",
    personality: "neutral",
    language: "es",
    
    // Comportamiento
    preferredTopics: [],
    responseLength: "medium",
    aiAggression: 0.5,
    learningMode: false,
    notifications: true,
    
    // Personalización
    customRules: [],
    
    // Estadísticas
    stats: {
        messagesCount: 0,
        calculationsCount: 0,
        codeGenCount: 0,
        lastActive: "2024-02-03T..."
    }
}
```

### Persistencia

```
Profile → JSON → localStorage:infinix_profile_*
```

---

## ⚙️ Sistema de Reglas

### Evaluación de Reglas

```
Input Message
    ↓
┌─ Ordenar por prioridad (descendente) ─┐
    ↓
┌─ Para cada regla (ordenada): ─────────┐
│ 1. Evaluar condition(context)         │
│ 2. Si true → ejecutar action()        │
│ 3. Log resultado                       │
│ 4. Continuar con siguiente regla       │
└─────────────────────────────────────────┘
    ↓
Resultados (Array de ejecuciones)
```

### Reglas Predefinidas

```javascript
// math_detection (prioridad: 100)
condition: /[+\-*/()\d.^√]/.test(message)
action: () => Logger.debug('Math detected')

// code_detection (prioridad: 95)
condition: /function|def |class |var /.test(message)
action: () => Logger.debug('Code detected')

// question_detection (prioridad: 90)
condition: message.includes('?')
action: () => state.intencionUsuario = 'question'
```

---

## 🧠 Sistema de Aprendizaje

### Estructura de Conocimiento

```javascript
{
    knowledge: {},              // Conocimiento acumulado
    experience: 0,              // Puntos de experiencia total
    
    knowledgeAreas: {
        mathematics: 0,
        programming: 0,
        physics: 0,
        chemistry: 0,
        general: 0
    },
    
    conversationPatterns: [     // Últimos 100 patrones
        {
            timestamp,
            messageLength,
            responseLength,
            hasQuestion,
            hasCode,
            hasMath
        }
    ]
}
```

### Cálculo de Nivel

```
experience:  0-10   → beginner
experience: 10-50   → intermediate
experience: 50-100  → advanced
experience: 100+    → expert
```

### Sugestión Automática

```
Analizar últimos 10 patrones
├─ Contar temas frecuentes
├─ Detectar área dominante
└─ Sugerir enfoque (mathematics|programming)
```

---

## 📊 Sistema de Logging

### Niveles de Severidad

```
debug   - Información detallada para debugging
info    - Eventos normales del sistema
warn    - Situaciones anómalas pero recuperables
error   - Errores que afectan funcionalidad
```

### Tipos de Log

```javascript
// Logging general
Logger.debug('Message', {data})
Logger.info('Message', {data})
Logger.warn('Message', {data})
Logger.error('Message', {data})

// Logging especializado
Logger.logDecision('decision_name', {metrics})
Logger.logStateChange('field_name', {old, new})

// Consultas
Logger.getRecent(10)      // Array con últimas 10
Logger.getByLevel('error')// Array con errors
Logger.export()           // JSON completo
```

### Almacenamiento

```
Historial en memoria
├─ Máximo: 500 entradas
├─ FIFO: Más antiguas se remueven
└─ Filtrable por nivel
```

---

## 🤖 Motor de Decisiones IA

### Variables Internas

```javascript
state.cargaCognitiva        // 0-1: Carga mental
state.entropiaInterna       // 0-1: Aleatoriedad
state.nivelRazonamiento     // 0-1: Profundidad análisis
state.coherenciaGlobal      // 0-1: Consistencia
state.fatigaIA              // 0-1: Agotamiento simulado
state.estabilidadRespuesta  // 0-1: Consistencia
```

### Métricas de Decisión

```javascript
AIEngine.computeDecisionMetrics(analysis)
    ↓
{
    profundidadScore,       // 0-1: Profundidad requerida
    decisionEntropy,        // 0-1: Entropía de decisión
    complexityAdjustment,   // 0-2: Multiplicador complejidad
    fatigaFactor,           // 0-1: Impacto fatiga
    coherenceFactor         // 0-1: Impacto coherencia
}
```

---

## 🔐 Seguridad del Parser Matemático

### Flujo Seguro de Evaluación

```
User Input: "sin(x^2 + 3)"
    ↓
┌─ VALIDACIÓN ─────────────────────────────┐
│ validarEntrada(): Whitelist de caracteres│
│ Bloquear: eval, Function, window, etc.   │
└──────────────────────────────────────────┘
    ↓
┌─ TOKENIZACIÓN ──────────────────────────┐
│ tokenizeExpression(): Dividir en tokens  │
│ Aplicar multiplicación implícita         │
│ Detectar operadores unarios              │
└──────────────────────────────────────────┘
    ↓
┌─ CONVERSIÓN A RPN ──────────────────────┐
│ toRPN(): Shunting-yard algorithm        │
│ Respeta precedencia                      │
│ Genera tokens en notación polaca inversa │
└──────────────────────────────────────────┘
    ↓
┌─ EVALUACIÓN RPN ─────────────────────────┐
│ evalRPN(): Procesar pila                │
│ Sin eval(), solo operaciones permitidas  │
│ Generar pasos para explicación           │
└──────────────────────────────────────────┘
    ↓
Result: {"valor": 4.5, "pasos": [...]}
```

### Funciones Permitidas

```javascript
// Trigonométricas
sin, cos, tan, asin, acos, atan

// Logarítmicas
log, ln

// Exponenciales
exp, sqrt, pow

// Utilidades
abs, floor, ceil, round
```

---

## 📈 Estadísticas y Métricas

### Por Sesión (state)

```javascript
contadorMensajes      // Total mensajes
contadorCalculos      // Cálculos realizados
contadorCodigo        // Códigos generados
tiempoRestante        // Para modo Infinix6
```

### Por Perfil (UserProfiles)

```javascript
profile.stats = {
    messagesCount,      // Total acumulado
    calculationsCount,  // Total acumulado
    codeGenCount,       // Total acumulado
    lastActive          // Última actividad
}
```

### Sistema de Aprendizaje (LearningSystem)

```javascript
totalExperience         // Puntos acumulados
knowledgeAreas: {
    mathematics,        // Puntos matemática
    programming,        // Puntos programación
    // ...
}
expertiseLevel          // Cálculo: beginner/intermediate/advanced/expert
patternsAnalyzed        // Patrones detectados (máx 100)
```

---

## 🎨 Estados de UI

### Estados de IA

```javascript
state.mood = 'calm' | 'excited' | 'confused'
state.personality = 'neutral' | 'friendly' | 'sarcastic' | 'academic'
state.energiaIA = 0 - 1  // Energía simulada
```

### Estados de Respuesta

```javascript
RESPONSE_STYLES = {
    normal: 1.0,        // Peso en selección
    short: 1.0,         // Respuestas cortas
    long: 1.0,          // Respuestas largas
    chaotic: 0.3,       // Impredecibles
    brainrot: 0.2,      // Extremadamente informales
    serious: 0.8        // Profesionales
}
```

---

## 🔍 Debug Panel

### Información Mostrada

```
STATE:
├─ Messages: contador
├─ Calculations: contador
├─ Mood: estado
├─ Personality: tipo
├─ Energy: 0-1
└─ Memory: items

SYSTEM:
├─ Time: HH:MM:SS
├─ Profile: nombre actual
└─ Experience: puntos

PLUGINS:
├─ Active: [lista]
└─ Available: cantidad
```

### Comandos de Consola

```javascript
DebugPanel.commands.state()      // Ver todo state
DebugPanel.commands.logs()       // Últimas 10 entradas
DebugPanel.commands.plugins()    // Status plugins
DebugPanel.commands.profile()    // Perfil actual
DebugPanel.commands.clear()      // Limpiar logs
```

---

## 🔄 Ciclo de Vida de Aplicación

```
┌─ CARGA ──────────────────────────────┐
│ 1. Cargar scripts en orden           │
│ 2. Inicializar CONFIG                │
│ 3. Inicializar Logger                │
│ 4. Cargar plugins core               │
│ 5. Registrar reglas predefinidas     │
│ 6. Cargar perfiles desde localStorage│
│ 7. Mostrar UI                        │
└──────────────────────────────────────┘
    ↓
┌─ OPERACIÓN ──────────────────────────┐
│ Usuario interactúa (mensajes, etc.)  │
│ Sistema procesa según flujo          │
│ Registra estadísticas                │
└──────────────────────────────────────┘
    ↓
┌─ ACTUALIZACIÓN ──────────────────────┐
│ Cada mensaje:                        │
│ - Actualiza stats de perfil          │
│ - Registra en logger                 │
│ - Guarda en localStorage             │
│ - Actualiza UI                       │
└──────────────────────────────────────┘
    ↓
┌─ DESCARGA (Opcional) ────────────────┐
│ Usuario cierra navegador             │
│ localStorage preserva todo           │
│ Próxima sesión carga desde almacén   │
└──────────────────────────────────────┘
```

---

## 📦 Tamaño de Archivos

```
config.js           ~2.6 KB
logger.js           ~2.1 KB
plugins_system.js   ~4.2 KB
user_profiles.js    ~4.9 KB
rules_engine.js     ~3.6 KB
learning_system.js  ~3.2 KB
ai_engine.js        ~4.2 KB
code_generator.js   ~12 KB
script.js           ~54 KB
debug_panel.js      ~6.3 KB
styles.css          ~550 KB
─────────────────────────
Total JS:          ~97 KB (minificado: ~35 KB)
Total CSS:         ~550 KB
Total HTML:        ~9.4 KB
```

---

## 🎯 Próximas Mejoras Arquitectónicas

1. **Separar script.js** en módulos más pequeños
2. **Implementar State Management** centralizado
3. **Agregar Service Workers** para PWA
4. **Mejorar performance** con Web Workers
5. **Aumentar cobertura de tests**

---

## 📚 Referencias Internas

- [README.md](README.md) - Documentación usuario
- [contributing.md](contributing.md) - Guía de contribución
- Código comentado en cada archivo

---

**Última Actualización**: 2024-02-03  
**Versión**: 4.0.0  
**Estado**: ✅ Documentación Completa
