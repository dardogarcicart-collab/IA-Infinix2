/**
 * RULES_ENGINE.JS - Motor de reglas configurable
 * Permite definir y ejecutar reglas de negocio dinámicamente
 */
(function(global){
    const RulesEngine = {
        rules: {},
        ruleOrder: [],
        
        // Definir una regla
        defineRule(name, config){
            if (this.rules[name]){
                Logger?.warn(`Rule ${name} already defined`);
                return false;
            }
            
            this.rules[name] = {
                name,
                condition: config.condition, // Función que retorna boolean
                action: config.action,       // Función que se ejecuta si condition es true
                priority: config.priority || 0,
                enabled: config.enabled !== false,
                async: config.async || false
            };
            
            this.ruleOrder.push(name);
            this.ruleOrder.sort((a, b) => {
                return this.rules[b].priority - this.rules[a].priority;
            });
            
            Logger?.info(`Rule defined: ${name}`, {priority: config.priority});
            return true;
        },
        
        // Evaluar todas las reglas
        async evaluateRules(context){
            const results = [];
            
            for (const ruleName of this.ruleOrder){
                const rule = this.rules[ruleName];
                if (!rule.enabled) continue;
                
                try {
                    const conditionMet = rule.condition(context);
                    if (conditionMet){
                        if (rule.async){
                            await rule.action(context);
                        } else {
                            rule.action(context);
                        }
                        results.push({rule: ruleName, executed: true});
                        Logger?.debug(`Rule executed: ${ruleName}`, {context});
                    }
                } catch (e){
                    Logger?.error(`Rule error ${ruleName}: ${e.message}`);
                    results.push({rule: ruleName, error: e.message});
                }
            }
            
            return results;
        },
        
        // Habilitar/Deshabilitar regla
        toggleRule(name, enabled){
            if (this.rules[name]){
                this.rules[name].enabled = enabled;
                Logger?.info(`Rule ${enabled ? 'enabled' : 'disabled'}: ${name}`);
                return true;
            }
            return false;
        },
        
        // Eliminar regla
        deleteRule(name){
            delete this.rules[name];
            this.ruleOrder = this.ruleOrder.filter(r => r !== name);
            Logger?.info(`Rule deleted: ${name}`);
            return true;
        }
    };
    
    // Reglas por defecto
    RulesEngine.defineRule('math_detection', {
        priority: 100,
        condition: (ctx) => /[+\-*/()\d.^√]/.test(ctx.message),
        action: (ctx) => Logger?.debug('Math expression detected')
    });
    
    RulesEngine.defineRule('code_detection', {
        priority: 95,
        condition: (ctx) => /función|function|def |class |var |const |let |struct/.test(ctx.message),
        action: (ctx) => Logger?.debug('Code generation request detected')
    });
    
    RulesEngine.defineRule('question_detection', {
        priority: 90,
        condition: (ctx) => ctx.message.includes('?'),
        action: (ctx) => {
            if (state) state.intencionUsuario = 'question';
            Logger?.debug('Question detected');
        }
    });
    
    global.RulesEngine = RulesEngine;
})(window);
