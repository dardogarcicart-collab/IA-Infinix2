/**
 * LOGGER.JS - Sistema de logs inteligentes
 * Registra decisiones, errores y estados sin afectar rendimiento
 */
(function(global){
    const Logger = {
        logs: [],
        maxLogs: 500,
        level: (global.CONFIG?.LOG_LEVEL || 'info'),
        
        // Niveles de severidad
        LEVELS: { debug: 0, info: 1, warn: 2, error: 3 },
        
        log(message, data, level = 'info'){
            if (this.LEVELS[level] < this.LEVELS[this.level]) return; // filtrar por nivel
            
            const entry = {
                timestamp: Date.now(),
                level: level,
                message: message,
                data: data || {},
                tag: level.toUpperCase()
            };
            
            this.logs.unshift(entry); // agregar al inicio
            if (this.logs.length > this.maxLogs) this.logs.pop(); // limitar tamaño
            
            // si debug mode, log en consola también
            if (global.CONFIG?.DEBUG_MODE){
                const prefix = `[${level.toUpperCase()}]`;
                console.log(`${prefix} ${message}`, data || '');
            }
        },
        
        debug(msg, data){ this.log(msg, data, 'debug'); },
        info(msg, data){ this.log(msg, data, 'info'); },
        warn(msg, data){ this.log(msg, data, 'warn'); },
        error(msg, data){ this.log(msg, data, 'error'); },
        
        logDecision(decision, reason, confidence){
            this.info(`Decision: ${decision}`, {reason, confidence});
        },
        
        logStateChange(varName, oldVal, newVal){
            this.debug(`State change: ${varName}`, {from: oldVal, to: newVal});
        },
        
        getRecent(n = 20){
            return this.logs.slice(0, n);
        },
        
        getByLevel(level){
            return this.logs.filter(log => log.level === level);
        },
        
        clear(){
            this.logs = [];
            this.info('Logs cleared');
        },
        
        export(){
            return JSON.stringify(this.logs, null, 2);
        }
    };
    
    global.Logger = Logger;
})(window);
