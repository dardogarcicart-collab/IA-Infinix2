/**
 * CONFIG.JS - Configuración centralizada del proyecto
 * Punto único de verdad para todas las variables y constantes
 */
(function(global){
    const CONFIG = {
        // ===== NÚCLEO =====
        PROJECT_NAME: 'Infinix AI',
        VERSION: '2.0.0',
        
        // ===== TIEMPOS =====
        LOADING_DURATION: 4000,
        AI_RESPONSE_DELAY: 500,
        INFINIX6_TIME_LIMIT: 600,
        INFINIX6_MESSAGE_LIMIT: 3,
        
        // ===== MODELOS DE RESPUESTA =====
        RESPONSE_STYLES: {
            normal: 1,
            short: 1,
            long: 1,
            chaotic: 0.3,
            brainrot: 0.2,
            serious: 0.8
        },
        
        // ===== PERSONALIDADES =====
        PERSONALITIES: ['neutral', 'friendly', 'sarcastic', 'academic'],
        DEFAULT_PERSONALITY: 'neutral',
        
        // ===== MEMORIA =====
        MAX_SHORT_TERM_MEMORY: 50,
        MAX_SESSION_MEMORY: 1000,
        MEMORY_RETENTION_MS: 3600000, // 1 hora
        
        // ===== LENGUAJES SOPORTADOS =====
        SUPPORTED_LANGUAGES: ['javascript', 'java', 'python', 'cpp', 'html', 'css'],
        DEFAULT_LANGUAGE: 'javascript',
        
        // ===== ALMACENAMIENTO =====
        STORAGE_KEYS: {
            theme: 'infinix_theme_v1',
            history: 'infinix_history_v1',
            session: 'infinix_session_v1',
            profile: 'infinix_profile_v1',
            logs: 'infinix_logs_v1'
        },
        
        // ===== VARIABLES DE INTELIGENCIA INICIALES =====
        AI_INITIAL_STATE: {
            cargaCognitiva: 0.1,
            entropiaInterna: 0.05,
            nivelRazonamiento: 0.5,
            factorAleatoriedad: 0.2,
            estabilidadRespuesta: 0.9,
            coherenciaGlobal: 0.9,
            fatigaIA: 0.0,
            adaptabilidad: 0.5,
            estabilidadSistema: 0.9,
            confianzaContextual: 0.8,
            cargaProcesamiento: 0.2,
            evolucionInterna: 0.0
        },
        
        // ===== REGLAS DE DECISIÓN =====
        DECISION_RULES: {
            minConfidenceForResponse: 0.3,
            maxResponseTime: 7000,
            autoLearnThreshold: 0.6,
            contextMemoryWeight: 0.3
        },
        
        // ===== PLUGINS PREDETERMINADOS =====
        CORE_PLUGINS: ['math', 'code', 'chat', 'graphics'],
        
        // ===== MODO DEBUG =====
        DEBUG_MODE: false,
        LOG_LEVEL: 'info' // debug, info, warn, error
    };
    
    // Proteger configuración (no permitir cambios accidentales)
    Object.freeze(CONFIG);
    global.CONFIG = CONFIG;
})(window);
