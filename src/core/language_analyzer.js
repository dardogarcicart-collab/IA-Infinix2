(function(global){
    /**
     * LanguageAnalyzer - detección de idioma, intención y control de respuestas.
     * Devuelve un objeto con: idiomaDetectado, intencionDetectada, estadoAcceso,
     * requiereCarga, tokensRequeridos, isBlocked y un código de motivo.
     */
    const FIXED_RESPONSES = {
        NO_AUTH: 'Acceso restringido. Inicia sesión.',
        INFINIX6_TOKENS: 'Te quedaste sin tokens para Infinix 6.',
        REQUIERE_CARGA: 'Esta función requiere carga adicional.',
        FUNCION_NO_PERMITIDA: 'Función no disponible en tu versión.'
    };

    const Analyzer = {
        detectLanguage(text){
            if (!text || typeof text !== 'string') return 'unknown';
            const t = text.toLowerCase();
            // heurísticas simples
            const es = /\b(¿|que|cómo|cuál|hola|gracias|por favor|buenas)\b/i.test(t);
            const en = /\b(what|how|please|thanks|hello|hi|function|class|login)\b/i.test(t);
            const pt = /\b(olá|por favor|obrigado|como|qual)\b/i.test(t);
            const slang = /(bruh|lol|wtf|brainrot|iykyk|xd|lmao)/i.test(t);
            if (slang) return 'mixed/slang';
            if (es && !en) return 'es';
            if (en && !es) return 'en';
            if (pt && !es && !en) return 'pt';
            // fallback: check chars frequency (accent marks favor es/pt)
            if (/[áéíóúñü]/i.test(t)) return 'es';
            if (t.split(' ').length < 3) return 'mixed';
            return 'en';
        },

        detectIntent(text){
            const t = (text||'').toLowerCase();
            if (t.includes('?') || /^((what|how|why|when|where)\b)/i.test(t)) return 'question';
            if (/login|iniciar sesión|inicia sesión|signin|authenticate|autenticación|token|key/.test(t)) return 'intent_login';
            if (/descargar|download|exec|run system|rm\s+-rf|sudo /.test(t)) return 'attempt_access';
            if (/generar código|genera código|genera|crea|implementa|function|def |class |script|lua|.lua\b/.test(t)) return 'request_code';
            if (/optimiza|optimizar|mejora|refactoriza|speed|performance/.test(t)) return 'request_optimize';
            return 'unknown';
        },

        evaluate(text, context){
            // context puede contener: authUser, versionInfinix, tokensDisponibles, permisoAvanzado
            const idioma = this.detectLanguage(text);
            const intencion = this.detectIntent(text);
            const estadoAcceso = (context && context.authUser) ? 'autenticado' : 'no autenticado';

            // reglas básicas
            let requiereCarga = false;
            let tokensRequeridos = 0;
            let isBlocked = false;
            let motivo = null;

            // si no autenticado -> bloquear acceso a todo excepto preguntas generales
            if (estadoAcceso === 'no autenticado'){
                if (intencion === 'question'){
                    // permitir preguntas simples
                } else {
                    isBlocked = true; motivo = 'NO_AUTH';
                }
            }

            // si intenta usar Infinix6 y no tiene tokens
            if (!isBlocked && context && context.versionInfinix === 6){
                if ((context.tokensDisponibles||0) <= 0){ isBlocked = true; motivo = 'INFINIX6_TOKENS'; }
            }

            // si la intención es request_code y versión no permite (free) -> bloquear función
            if (!isBlocked && intencion === 'request_code'){
                if (context && context.versionInfinix === 3){
                    // permitir generación básica solo, pero limitar según complejidad
                    // Si excede complejidad permitida en contexto, requerir carga
                    if (context.complejidadPermitida !== undefined && context.complejidadPermitida < 0.5){
                        requiereCarga = true; motivo = 'REQUIERE_CARGA';
                    }
                }
            }

            // bloque inteligente para comandos peligrosos
            if (!isBlocked && /eval\(|process\.|child_process|require\(|fs\.|system\(|rm\s+-rf/.test(text)){
                isBlocked = true; motivo = 'FUNCION_NO_PERMITIDA';
            }

            return {
                idiomaDetectado: idioma,
                intencionDetectada: intencion,
                estadoAcceso,
                requiereCarga,
                tokensRequeridos,
                isBlocked,
                motivo,
                fixedMessage: motivo ? FIXED_RESPONSES[motivo] : null
            };
        }
    };

    global.LanguageAnalyzer = Analyzer;
    global.LanguageAnalyzer.FIXED_RESPONSES = FIXED_RESPONSES;
})(window);
