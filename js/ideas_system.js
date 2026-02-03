/**
 * 💡 SISTEMA DE ZONA DE IDEAS - Infinix AI
 * 
 * Propósito: Crear un sistema interno que almacena, analiza y sugiere
 * respuestas basadas en palabras clave y contexto del usuario.
 * 
 * Funcionamiento:
 * 1. Usuario escribe mensaje
 * 2. Sistema analiza palabras clave
 * 3. Busca coincidencias en la base de ideas
 * 4. Genera respuesta mejorada usando sugerencias
 * 
 * Uso:
 *   const ideas = IdeasSystem.analizarMensaje("¿Cómo sumo 2+2?");
 *   const respuesta = IdeasSystem.generarRespuestaConIdeas(mensaje, ideasEncontradas);
 */

const IdeasSystem = (function() {
    'use strict';

    // ===== BASE DE DATOS DE IDEAS =====
    // Estructura: { tema, keywords, sugerencias, tipoRespuesta, ejemplo }
    const ideasDeRespuesta = [
        // MATEMÁTICAS
        {
            tema: 'Matemáticas Básica',
            keywords: ['sumar', 'suma', '+', 'más', 'agregar', 'adicionar'],
            sugerencias: [
                'Muestra el proceso paso a paso',
                'Usa números pequeños primero',
                'Explica qué significa la suma en la vida real',
                'Pregunta si necesita más ejemplos'
            ],
            tipoRespuesta: 'educativo',
            ejemplo: 'Para sumar 5 + 3: Toma 5 objetos, agrega 3 más = 8 en total'
        },
        {
            tema: 'Matemáticas Básica',
            keywords: ['restar', 'resta', '-', 'menos', 'quitar', 'disminuir'],
            sugerencias: [
                'Muestra cómo se quita cantidad',
                'Usa visualización (línea numérica)',
                'Explica que no puede haber resultado negativo (en contexto real)',
                'Sugiere practicar con números pequeños'
            ],
            tipoRespuesta: 'educativo',
            ejemplo: 'Para restar 8 - 3: Empieza en 8, muévete 3 pasos atrás = 5'
        },
        {
            tema: 'Matemáticas Avanzada',
            keywords: ['ecuación', 'incógnita', 'x', 'despejar', 'resolver'],
            sugerencias: [
                'Aísla la variable paso a paso',
                'Muestra cada operación inversa',
                'Verifica el resultado sustituyendo',
                'Explica el concepto de ecuación balanceada'
            ],
            tipoRespuesta: 'analítico',
            ejemplo: 'Para x + 5 = 12: Restamos 5 a ambos lados → x = 7'
        },
        {
            tema: 'Matemáticas Avanzada',
            keywords: ['derivada', 'integral', 'cálculo', 'diferencial'],
            sugerencias: [
                'Explica el concepto gráficamente',
                'Muestra la fórmula paso a paso',
                'Aplica a ejemplos reales',
                'Menciona qué mide (pendiente, área, etc)'
            ],
            tipoRespuesta: 'académico',
            ejemplo: 'La derivada mide qué tan rápido cambia una función'
        },

        // PROGRAMACIÓN
        {
            tema: 'Programación',
            keywords: ['código', 'javascript', 'python', 'java', 'c++', 'función', 'variable'],
            sugerencias: [
                'Muestra código funcional y comentado',
                'Explica cada línea',
                'Proporciona un ejemplo ejecutable',
                'Pregunta qué lenguaje prefiere'
            ],
            tipoRespuesta: 'técnico',
            ejemplo: 'function suma(a, b) { return a + b; }'
        },
        {
            tema: 'Programación',
            keywords: ['error', 'bug', 'bug', 'no funciona', 'falla', 'undefined'],
            sugerencias: [
                'Pide el código completo o fragmento relevante',
                'Sugiere técnicas de debugging',
                'Explica errores comunes',
                'Ofrece soluciones paso a paso'
            ],
            tipoRespuesta: 'soporte',
            ejemplo: 'Los errores "undefined" usualmente indican variable no definida'
        },
        {
            tema: 'Programación',
            keywords: ['bucle', 'for', 'while', 'iteración', 'repetir'],
            sugerencias: [
                'Muestra la estructura del bucle',
                'Explica cuándo termina',
                'Usa variable contadora clara',
                'Advierte sobre bucles infinitos'
            ],
            tipoRespuesta: 'educativo',
            ejemplo: 'for(let i = 0; i < 10; i++) { console.log(i); }'
        },

        // LÓGICA Y ANÁLISIS
        {
            tema: 'Lógica',
            keywords: ['si', 'si no', 'condición', 'if', 'else', 'verdadero', 'falso'],
            sugerencias: [
                'Explica qué condición se evalúa',
                'Muestra ambas ramas (verdadero/falso)',
                'Usa ejemplos del mundo real',
                'Diagrama el flujo (opcional)'
            ],
            tipoRespuesta: 'lógico',
            ejemplo: 'Si el número es mayor que 10: "es grande", Si no: "es pequeño"'
        },
        {
            tema: 'Análisis',
            keywords: ['analizar', 'explicar', 'entender', 'significado', 'qué significa'],
            sugerencias: [
                'Divide el concepto en partes',
                'Usa analogías y metáforas',
                'Proporciona ejemplos concretos',
                'Resume al final'
            ],
            tipoRespuesta: 'explicativo',
            ejemplo: 'Primero explica la definición, luego un ejemplo, finalmente resumen'
        },

        // CIENCIAS
        {
            tema: 'Física',
            keywords: ['velocidad', 'fuerza', 'movimiento', 'aceleración', 'newton'],
            sugerencias: [
                'Incluye la fórmula física',
                'Explica variables (m, v, a, f)',
                'Usa ejemplos visuales',
                'Menciona aplicaciones reales'
            ],
            tipoRespuesta: 'científico',
            ejemplo: 'F = m × a (Fuerza = masa × aceleración)'
        },
        {
            tema: 'Química',
            keywords: ['elemento', 'molécula', 'reacción', 'ecuación química', 'h2o'],
            sugerencias: [
                'Muestra la fórmula química',
                'Explica qué elementos contiene',
                'Describe la reacción paso a paso',
                'Menciona propiedades importantes'
            ],
            tipoRespuesta: 'científico',
            ejemplo: 'H₂O (agua) = 2 átomos de hidrógeno + 1 de oxígeno'
        },

        // ESCRITURA Y LENGUAJE
        {
            tema: 'Escritura',
            keywords: ['escribir', 'redactar', 'ensayo', 'párrafo', 'estructura', 'ortografía'],
            sugerencias: [
                'Sugiere estructura: introducción, desarrollo, conclusión',
                'Da tips de claridad y concisión',
                'Proporciona ejemplos bien escritos',
                'Revisa si hay errores gramaticales'
            ],
            tipoRespuesta: 'creativo',
            ejemplo: 'Un buen párrafo tiene: idea principal + evidencia + conclusión'
        },
        {
            tema: 'Lenguaje',
            keywords: ['significado', 'definición', 'sinónimo', 'antónimo', 'palabra'],
            sugerencias: [
                'Da la definición clara y concisa',
                'Incluye un ejemplo en contexto',
                'Menciona sinónimos o antónimos',
                'Explica origen si es interesante'
            ],
            tipoRespuesta: 'lingüístico',
            ejemplo: 'Paradigma = modelo o patrón a seguir | Sinónimo: arquetipo'
        },

        // GENERAL / CONVERSACIÓN
        {
            tema: 'Conversación General',
            keywords: ['hola', 'saludos', 'buenos días', 'qué tal', 'cómo estás'],
            sugerencias: [
                'Responde con calidez',
                'Pregunta qué necesita',
                'Sé breve pero amigable',
                'Muestra disponibilidad'
            ],
            tipoRespuesta: 'social',
            ejemplo: '¡Hola! Me alegra hablar contigo. ¿En qué puedo ayudarte?'
        },
        {
            tema: 'Conversación General',
            keywords: ['gracias', 'thanks', 'merci', 'agradecido'],
            sugerencias: [
                'Responde positivamente',
                'Ofrece más ayuda',
                'Sé humilde',
                'Cierra con buena nota'
            ],
            tipoRespuesta: 'social',
            ejemplo: '¡De nada! Estoy aquí si necesitas más ayuda.'
        },

        // AYUDA Y SOLICITUDES
        {
            tema: 'Ayuda',
            keywords: ['ayuda', 'ayúdame', 'no entiendo', 'confundido', 'problema'],
            sugerencias: [
                'Pregunta qué no entienden específicamente',
                'Simplifica la explicación',
                'Ofrece múltiples enfoques',
                'Comprueba si quedó claro'
            ],
            tipoRespuesta: 'soporte',
            ejemplo: '¿Cuál parte específicamente no queda clara? Podemos revisarla juntos.'
        },
        {
            tema: 'Solicitud de Código',
            keywords: ['código', 'genera código', 'escribe código', 'cómo hago', 'programa'],
            sugerencias: [
                'Pregunta el lenguaje preferido',
                'Pide detalles de requisitos',
                'Genera código limpio y comentado',
                'Ofrece explicación de cada parte'
            ],
            tipoRespuesta: 'técnico',
            ejemplo: '¿En qué lenguaje? ¿Qué debe hacer exactamente?'
        }
    ];

    // ===== ESTADO INTERNO =====
    const estado = {
        ideasActuales: [],        // Ideas encontradas en el último análisis
        historialIdeas: [],       // Histórico de ideas usadas
        estadísticas: {
            mensajesAnalizados: 0,
            ideasUtilizadas: 0,
            temasComunes: {}
        },
        debugMode: false          // Mostrar ideas en consola/UI
    };

    // ===== FUNCIONES PÚBLICAS =====

    /**
     * Analiza un mensaje del usuario y encuentra ideas relevantes
     * @param {string} mensaje - Mensaje del usuario
     * @returns {Array} Array de ideas relevantes ordenadas por relevancia
     */
    function analizarMensaje(mensaje) {
        if (!mensaje || typeof mensaje !== 'string') return [];

        const mensajeLower = mensaje.toLowerCase();
        const palabrasClaves = extraerPalabrasClaves(mensajeLower);
        
        // Encontrar ideas que coincidan
        const ideasEncontradas = [];
        
        ideasDeRespuesta.forEach(idea => {
            let puntaje = 0;
            
            idea.keywords.forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
                const coincidencias = (mensaje.match(regex) || []).length;
                puntaje += coincidencias;
            });
            
            if (puntaje > 0) {
                ideasEncontradas.push({
                    ...idea,
                    puntaje: puntaje,
                    palabrasCoincidentes: palabrasClaves
                });
            }
        });

        // Ordenar por relevancia (puntaje más alto primero)
        ideasEncontradas.sort((a, b) => b.puntaje - a.puntaje);

        // Guardar en estado
        estado.ideasActuales = ideasEncontradas.slice(0, 3); // Top 3 ideas
        estado.estadísticas.mensajesAnalizados++;
        
        if (ideasEncontradas.length > 0) {
            const tema = ideasEncontradas[0].tema;
            estado.estadísticas.temasComunes[tema] = 
                (estado.estadísticas.temasComunes[tema] || 0) + 1;
        }

        if (estado.debugMode) {
            console.log('💡 Ideas encontradas:', estado.ideasActuales);
        }

        return estado.ideasActuales;
    }

    /**
     * Genera una respuesta mejorada usando las ideas
     * @param {string} respuestaOriginal - Respuesta sin ideas
     * @param {Array} ideas - Ideas encontradas
     * @returns {string} Respuesta enriquecida con sugerencias
     */
    function enriquecerRespuesta(respuestaOriginal, ideas = null) {
        const ideasAUsar = ideas || estado.ideasActuales;
        
        if (ideasAUsar.length === 0) {
            return respuestaOriginal;
        }

        const ideaPrincipal = ideasAUsar[0];
        const sugerenciasAleatorias = seleccionarSugerencias(
            ideaPrincipal.sugerencias, 
            2 // Usar 2 sugerencias aleatorias
        );

        // Construir respuesta enriquecida
        let respuestaEnriquecida = respuestaOriginal;

        // Agregar contexto de tipo de respuesta
        if (ideaPrincipal.tipoRespuesta === 'educativo') {
            respuestaEnriquecida += '\n\n📚 **Tip de aprendizaje:** ' + 
                sugerenciasAleatorias[0];
        } else if (ideaPrincipal.tipoRespuesta === 'técnico') {
            respuestaEnriquecida += '\n\n💻 **Nota técnica:** ' + 
                sugerenciasAleatorias[0];
        } else if (ideaPrincipal.tipoRespuesta === 'soporte') {
            respuestaEnriquecida += '\n\n🔧 **Para ayudarte mejor:** ' + 
                sugerenciasAleatorias[0];
        }

        if (sugerenciasAleatorias[1]) {
            respuestaEnriquecida += '\n\n💡 **Considera:** ' + 
                sugerenciasAleatorias[1];
        }

        estado.estadísticas.ideasUtilizadas++;
        estado.historialIdeas.push({
            tema: ideaPrincipal.tema,
            timestamp: new Date().toISOString()
        });

        return respuestaEnriquecida;
    }

    /**
     * Obtiene solo las sugerencias de las ideas encontradas
     * @param {Array} ideas - Ideas encontradas
     * @returns {Array} Array de sugerencias
     */
    function obtenerSugerencias(ideas = null) {
        const ideasAUsar = ideas || estado.ideasActuales;
        const sugerencias = [];

        ideasAUsar.forEach(idea => {
            sugerencias.push(...idea.sugerencias);
        });

        return [...new Set(sugerencias)]; // Eliminar duplicados
    }

    /**
     * Agrega una idea nueva a la base de datos
     * @param {Object} nuevaIdea - { tema, keywords, sugerencias, tipoRespuesta, ejemplo }
     * @returns {boolean} True si se agregó correctamente
     */
    function agregarIdea(nuevaIdea) {
        if (!validarIdea(nuevaIdea)) {
            console.error('❌ Idea inválida. Estructura requerida:', 
                {tema: 'string', keywords: ['array'], sugerencias: ['array'], tipoRespuesta: 'string'});
            return false;
        }

        ideasDeRespuesta.push(nuevaIdea);
        console.log('✅ Idea agregada:', nuevaIdea.tema);
        return true;
    }

    /**
     * Actualiza una idea existente
     * @param {string} temaBuscar - Tema de la idea a actualizar
     * @param {Object} actualizaciones - Campos a actualizar
     * @returns {boolean} True si se actualizó
     */
    function actualizarIdea(temaBuscar, actualizaciones) {
        const indice = ideasDeRespuesta.findIndex(
            idea => idea.tema.toLowerCase() === temaBuscar.toLowerCase()
        );

        if (indice === -1) {
            console.warn('⚠️ Idea no encontrada:', temaBuscar);
            return false;
        }

        ideasDeRespuesta[indice] = {
            ...ideasDeRespuesta[indice],
            ...actualizaciones
        };

        console.log('✏️ Idea actualizada:', temaBuscar);
        return true;
    }

    /**
     * Obtiene estadísticas del sistema
     * @returns {Object} Estadísticas de uso
     */
    function obtenerEstadísticas() {
        return {
            ...estado.estadísticas,
            totalIdeas: ideasDeRespuesta.length,
            ideasActuales: estado.ideasActuales.length,
            historialReciente: estado.historialIdeas.slice(-5)
        };
    }

    /**
     * Obtiene todas las ideas actuales
     * @returns {Array} Ideas encontradas en último análisis
     */
    function obtenerIdeasActuales() {
        return estado.ideasActuales;
    }

    /**
     * Obtiene todas las ideas disponibles (para admin/debug)
     * @returns {Array} Todas las ideas en la base de datos
     */
    function obtenerTodasLasIdeas() {
        return ideasDeRespuesta;
    }

    /**
     * Limpia el estado de ideas actuales
     */
    function limpiarIdeasActuales() {
        estado.ideasActuales = [];
    }

    /**
     * Activa/desactiva modo debug
     * @param {boolean} activar - True para activar, False para desactivar
     */
    function setDebugMode(activar) {
        estado.debugMode = !!activar;
        console.log(activar ? '🐛 Debug activado' : '🐛 Debug desactivado');
    }

    /**
     * Reseta todas las estadísticas
     */
    function resetearEstadísticas() {
        estado.estadísticas = {
            mensajesAnalizados: 0,
            ideasUtilizadas: 0,
            temasComunes: {}
        };
        estado.historialIdeas = [];
        console.log('🔄 Estadísticas reseteadas');
    }

    // ===== FUNCIONES PRIVADAS =====

    /**
     * Extrae palabras clave del mensaje (palabras > 3 caracteres)
     */
    function extraerPalabrasClaves(texto) {
        return texto
            .split(/\s+/)
            .filter(palabra => palabra.length > 3)
            .filter(palabra => /^[a-záéíóúñ]+$/i.test(palabra));
    }

    /**
     * Selecciona sugerencias aleatorias
     */
    function seleccionarSugerencias(sugerencias, cantidad) {
        const shuffled = [...sugerencias].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, cantidad);
    }

    /**
     * Valida estructura de una idea
     */
    function validarIdea(idea) {
        return idea &&
            typeof idea.tema === 'string' &&
            Array.isArray(idea.keywords) &&
            Array.isArray(idea.sugerencias) &&
            typeof idea.tipoRespuesta === 'string' &&
            idea.keywords.length > 0 &&
            idea.sugerencias.length > 0;
    }

    // ===== EXPORTACIÓN =====
    return {
        analizarMensaje,
        enriquecerRespuesta,
        obtenerSugerencias,
        agregarIdea,
        actualizarIdea,
        obtenerEstadísticas,
        obtenerIdeasActuales,
        obtenerTodasLasIdeas,
        limpiarIdeasActuales,
        setDebugMode,
        resetearEstadísticas
    };
})();

// Registrar en Logger si está disponible
if (typeof Logger !== 'undefined') {
    Logger.info('IdeasSystem iniciado', {
        ideasCargadas: IdeasSystem.obtenerTodasLasIdeas().length,
        timestamp: new Date().toISOString()
    });
}
