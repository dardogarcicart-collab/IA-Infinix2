// Configuración centralizada cargada como variable global `CONFIG`
(function(global){
    const cfg = {
        PROJECT_NAME: 'Infinix AI',
        VERSION: '4.0.0',
        LOADING_DURATION: 4000,
        INFINIX6_TIME_LIMIT: 600,
        INFINIX6_MESSAGE_LIMIT: 3,
        AI_RESPONSE_DELAY: 500,
        RESPONSE_STYLES: {
            normal: 1,
            short: 1,
            long: 1,
            chaotic: 0.3,
            brainrot: 0.2,
            serious: 0.8
        },
        MAX_SHORT_TERM_MEMORY: 50,
        PERSONALITIES: ['neutral','friendly','sarcastic','academic'],
        DEFAULT_PERSONALITY: 'neutral',
        CORE_PLUGINS: ['math','code','chat','graphics'],
        DEBUG_MODE: false,
        LOG_LEVEL: 'info'
    };
    global.CONFIG = Object.freeze(cfg);
})(window);
