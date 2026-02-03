/**
 * LANGUAGE_ANALYZER.JS - Análisis de Idioma, Intención y Control de Acceso
 * Analiza el idioma, intención del usuario y controla respuestas permitidas
 */

(function(global){
    const LanguageAnalyzer = {
        // Idiomas detectados
        idiomasDetectados: {
            es: 'Español',
            en: 'Inglés',
            pt: 'Portugués',
            mix: 'Mixto/Slang'
        },

        // Palabras clave por idioma
        palabrasClave: {
            es: {
                pregunta: ['qué', 'cuál', 'cómo', 'dónde', 'cuándo', 'por qué', 'quién'],
                orden: ['haz', 'crea', 'genera', 'resuelve', 'explica', 'muestra'],
                bloqueado: ['hack', 'crack', 'exploit', 'virus', 'malware']
            },
            en: {
                pregunta: ['what', 'which', 'how', 'where', 'when', 'why', 'who'],
                orden: ['do', 'create', 'make', 'generate', 'solve', 'explain'],
                bloqueado: ['hack', 'crack', 'exploit', 'virus', 'malware']
            }
        },

        // Respuestas predeterminadas obligatorias
        mensajesPredeterminados: {
            bloqueado: '🔒 Acceso restringido. Esa función no está disponible.',
            requiereCarga: '⚡ Esta función requiere carga adicional.',
            limiteToknes: '❌ Te quedaste sin tokens para esta función.',
            sinAutenticacion: '🔐 Debes iniciar sesión para usar esto.',
            versionNoDisponible: '📦 Esta función no está disponible en tu versión.'
        },

        // Estado de análisis
        analisisActual: {
            idioma: 'es',
            intencion: 'casual',
            esBlocked: false,
            requiereCarga: false,
            fixedMessage: null
        },

        /**
         * Método principal: Analizar mensaje completo
         */
        evaluate(mensaje, contexto = {}) {
            const resultado = {
                idiomaDetectado: this.detectarIdioma(mensaje),
                intencionDetectada: this.detectarIntencion(mensaje),
                estadoAcceso: this.verificarAcceso(contexto),
                isBlocked: false,
                requiereCarga: false,
                fixedMessage: null
            };

            // Aplicar lógica de bloqueo
            if (resultado.estadoAcceso === 'bloqueado') {
                resultado.isBlocked = true;
                resultado.fixedMessage = this.mensajesPredeterminados.bloqueado;
            }

            if (resultado.estadoAcceso === 'requiere_carga') {
                resultado.requiereCarga = true;
                resultado.fixedMessage = this.mensajesPredeterminados.requiereCarga;
            }

            this.analisisActual = resultado;
            
            Logger?.info('Mensaje analizado', {
                idioma: resultado.idiomaDetectado,
                intencion: resultado.intencionDetectada
            });

            return resultado;
        },

        /**
         * Detectar idioma del mensaje
         */
        detectarIdioma(mensaje) {
            const lower = mensaje.toLowerCase();
            let puntajes = {
                es: 0,
                en: 0,
                pt: 0
            };

            // Palabras indicadoras español
            const esPatterns = [
                /\bel\b|\bla\b|\blos\b|\bun\b|\bunos?\b|\bcómo\b|\bqué\b|\bde\b/g,
                /ación\b|idad\b|mente\b|ía\b/g
            ];

            // Palabras indicadoras inglés
            const enPatterns = [
                /\bthe\b|\ba\b|\ban\b|\bis\b|\bare\b|\bwhat\b|\bhow\b/g,
                /ing\b|tion\b|ous\b|able\b/g
            ];

            esPatterns.forEach(p => puntajes.es += (lower.match(p) || []).length);
            enPatterns.forEach(p => puntajes.en += (lower.match(p) || []).length);

            // Heurística simple
            if (puntajes.en > puntajes.es && puntajes.en > 3) return 'en';
            if (puntajes.es > 3) return 'es';
            return 'es'; // Default español
        },

        /**
         * Detectar intención del usuario
         */
        detectarIntencion(mensaje) {
            const lower = mensaje.toLowerCase();

            if (/\?|^¿/.test(mensaje)) return 'pregunta';
            if (/^(haz|crea|genera|resuelve|explica|haz|dame)\b/i.test(mensaje)) return 'orden';
            if (/saludo|hola|hey|buenos|buenas/i.test(mensaje)) return 'saludo';
            if (/gracias|thanks|obrigado/.test(lower)) return 'agradecimiento';
            if (/ayuda|help|socorro/.test(lower)) return 'solicitud_ayuda';

            return 'casual';
        },

        /**
         * Verificar estado de acceso
         */
        verificarAcceso(contexto = {}) {
            const { versionInfinix = 4, tokensDisponibles = 100, permisoAvanzado = false } = contexto;

            // Si Infinix 3 (gratis)
            if (versionInfinix === 3) return 'permitido';

            // Si Infinix 4 (no usable)
            if (versionInfinix === 4) return 'version_no_disponible';

            // Si Infinix 6 con tokens
            if (versionInfinix === 6) {
                if (tokensDisponibles <= 0) return 'limite_tokens';
                if (!permisoAvanzado) return 'requiere_carga';
                return 'permitido';
            }

            return 'permitido';
        },

        /**
         * Obtener análisis actual
         */
        getAnalysis() {
            return this.analisisActual;
        },

        /**
         * Limpiar análisis
         */
        clearAnalysis() {
            this.analisisActual = {
                idioma: 'es',
                intencion: 'casual',
                esBlocked: false,
                requiereCarga: false,
                fixedMessage: null
            };
        }
    };

    global.LanguageAnalyzer = LanguageAnalyzer;
})(window);
