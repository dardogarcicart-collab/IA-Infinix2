/**
 * PERSONALITY.JS - Sistema de Personalidad, Apodos y Memoria
 * Permite configurar la IA con personalidades, apodos y memoria persistente
 */

(function(global){
    const Personality = {
        // Personalidades disponibles
        personalidades: {
            neutral: {
                nombre: 'Neutral',
                tonalidad: 'profesional',
                informalidad: 0.3,
                emojis: false,
                longitudPromedio: 'media',
                descripcion: 'Respuestas serias y directas'
            },
            friendly: {
                nombre: 'Amigable',
                tonalidad: 'cálida',
                informalidad: 0.7,
                emojis: true,
                longitudPromedio: 'larga',
                descripcion: 'Respuestas amigables y empáticas'
            },
            sarcastic: {
                nombre: 'Sarcástica',
                tonalidad: 'burlona',
                informalidad: 0.8,
                emojis: true,
                longitudPromedio: 'media',
                descripcion: 'Respuestas con toque sarcástico'
            },
            academic: {
                nombre: 'Académica',
                tonalidad: 'técnica',
                informalidad: 0.1,
                emojis: false,
                longitudPromedio: 'larga',
                descripcion: 'Respuestas técnicas y detalladas'
            },
            chaotic: {
                nombre: 'Caótica',
                tonalidad: 'aleatoria',
                informalidad: 1,
                emojis: true,
                longitudPromedio: 'random',
                descripcion: 'Respuestas impredecibles y divertidas'
            }
        },

        // Estado actual
        personalidadActual: 'neutral',
        apodoUsuario: null,
        usaApodo: false,
        memoria: {
            corta: [],      // Mensajes actuales
            media: {},      // Preferencias
            persistente: {} // LocalStorage
        },

        // Inicializar
        init() {
            this.cargarMemoriaPersistente();
            Logger?.info('Personality System initialized', {
                personalidad: this.personalidadActual,
                apodo: this.apodoUsuario
            });
        },

        // ===== PERSONALIDAD =====
        setPersonality(nombre) {
            if (!this.personalidades[nombre]) {
                Logger?.warn(`Personalidad desconocida: ${nombre}`);
                return false;
            }
            this.personalidadActual = nombre;
            this.guardarMemoriaPersistente();
            Logger?.info(`Personalidad cambiada a: ${nombre}`);
            return true;
        },

        getPersonality() {
            return this.personalidades[this.personalidadActual];
        },

        listPersonalities() {
            return Object.keys(this.personalidades);
        },

        // ===== APODOS =====
        setNickname(apodo) {
            if (!apodo || apodo.length > 20) {
                Logger?.warn('Apodo inválido');
                return false;
            }
            this.apodoUsuario = apodo;
            this.usaApodo = true;
            this.guardarMemoriaPersistente();
            Logger?.info(`Apodo establecido: ${apodo}`);
            return true;
        },

        getNickname() {
            return this.usaApodo ? this.apodoUsuario : null;
        },

        forgetNickname() {
            this.apodoUsuario = null;
            this.usaApodo = false;
            this.guardarMemoriaPersistente();
            Logger?.info('Apodo olvidado');
        },

        // ===== MEMORIA CORTA (Sesión) =====
        addToMemory(mensaje, tipo = 'user') {
            this.memoria.corta.unshift({
                tipo: tipo,
                texto: mensaje,
                timestamp: Date.now()
            });
            // Mantener solo últimos 50 mensajes
            if (this.memoria.corta.length > 50) {
                this.memoria.corta.pop();
            }
        },

        getMemoryRecent(n = 10) {
            return this.memoria.corta.slice(0, n);
        },

        clearMemory() {
            this.memoria.corta = [];
            Logger?.info('Memoria corta limpiada');
        },

        // ===== MEMORIA MEDIA (Preferencias) =====
        setPreference(clave, valor) {
            this.memoria.media[clave] = valor;
            this.guardarMemoriaPersistente();
        },

        getPreference(clave, default_val = null) {
            return this.memoria.media[clave] || default_val;
        },

        // ===== MEMORIA PERSISTENTE =====
        guardarMemoriaPersistente() {
            const datos = {
                personalidad: this.personalidadActual,
                apodo: this.apodoUsuario,
                usaApodo: this.usaApodo,
                preferencias: this.memoria.media,
                timestamp: Date.now()
            };
            try {
                localStorage.setItem('infinix_personality', JSON.stringify(datos));
                Logger?.debug('Memoria persistente guardada');
            } catch (e) {
                Logger?.error('Error guardando memoria persistente: ' + e.message);
            }
        },

        cargarMemoriaPersistente() {
            try {
                const datos = JSON.parse(localStorage.getItem('infinix_personality'));
                if (datos) {
                    this.personalidadActual = datos.personalidad || 'neutral';
                    this.apodoUsuario = datos.apodo;
                    this.usaApodo = datos.usaApodo || false;
                    this.memoria.media = datos.preferencias || {};
                    Logger?.info('Memoria persistente cargada');
                }
            } catch (e) {
                Logger?.warn('No hay memoria persistente guardada');
            }
        },

        // ===== OBTENER ESTADO COMPLETO =====
        getMemory() {
            return {
                personalidad: this.personalidadActual,
                apodo: this.apodoUsuario,
                usaApodo: this.usaApodo,
                mensajesEnMemoria: this.memoria.corta.length,
                preferencias: this.memoria.media
            };
        },

        // ===== APLICAR PERSONALIDAD A RESPUESTA =====
        applyToResponse(texto) {
            const pers = this.getPersonality();
            let respuesta = texto;

            // Aplicar emojis o no según personalidad
            if (!pers.emojis) {
                respuesta = respuesta.replace(/[😊🤖💙😔]/g, '');
            }

            // Agregar saludo con apodo si existe
            if (this.usaApodo && this.apodoUsuario) {
                respuesta = `${respuesta}\n\nEspero haber sido útil, ${this.apodoUsuario}`;
            }

            return respuesta;
        }
    };

    // Inicializar al cargar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => Personality.init());
    } else {
        Personality.init();
    }

    global.Personality = Personality;
})(window);
