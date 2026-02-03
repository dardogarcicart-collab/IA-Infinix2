/**
 * AI Engine - Variables y sistemas matemáticos avanzados
 * Provee funciones para carga cognitiva, entropía, pesos probabilísticos y decisión.
 * Este módulo expone `AIEngine` global que el UI puede usar sin alterar `script.js`.
 */
(function(global){
    const AIEngine = {
        // variables extremas iniciales
        cargaCognitiva: 0.1,
        entropiaInterna: 0.05,
        nivelRazonamiento: 0.5,
        factorAleatoriedad: 0.2,
        estabilidadRespuesta: 0.9,
        coherenciaGlobal: 0.9,
        fatigaIA: 0.0,

        // inicializar con estado externo si se quiere
        init(initial){
            if (!initial) return;
            Object.assign(this, initial);
        },

        // actualizar variables internas basadas en análisis del input
        updateState(appState, analysis){
            // análisis contiene complexity, wordCount, conceptsCount
            const complexity = analysis.complexity || 0;
            const concepts = analysis.conceptsCount || 0;
            const len = analysis.wordCount || Math.max(1, Math.floor(analysis.length/5));

            // cargas y fatiga: más complejidad aumenta carga
            this.cargaCognitiva = Math.min(1, this.cargaCognitiva*0.8 + complexity*0.15 + concepts*0.04);
            // entropía aumenta con aleatoriedad del input
            this.entropiaInterna = Math.min(1, this.entropiaInterna*0.9 + (Math.random()*0.15) + (complexity*0.05));
            // nivel de razonamiento ajustado por estado de la app y energía
            const energia = appState.energiaIA || 0.8;
            this.nivelRazonamiento = Math.max(0, Math.min(1, (1 - this.cargaCognitiva)*energia + complexity*0.1));
            // factor de aleatoriedad controlado por entropía
            this.factorAleatoriedad = Math.min(1, 0.1 + this.entropiaInterna*0.7 + Math.random()*0.1);
            // fatiga aumenta con interacciones
            this.fatigaIA = Math.min(1, this.fatigaIA + len*0.001);
            // estabilidad disminuye con fatiga y entropía
            this.estabilidadRespuesta = Math.max(0, 1 - this.fatigaIA*0.5 - this.entropiaInterna*0.3);
            // coherencia global modula según estabilidad y razonamiento
            this.coherenciaGlobal = Math.max(0, Math.min(1, this.nivelRazonamiento * this.estabilidadRespuesta));
        },

        // función que toma opciones y devuelve una elección ponderada por factores internos
        decideWeighted(options){
            // options: [{label,score}] score: base score
            // compute weight = score * (coherenciaGlobal) * (1 - factorAleatoriedad) + random*factorAleatoriedad
            const weights = options.map(opt => {
                const base = opt.score || 1;
                const coherent = base * (this.coherenciaGlobal * (1 - this.factorAleatoriedad));
                const randomness = Math.random() * this.factorAleatoriedad * (base+0.5);
                return Math.max(0, coherent + randomness);
            });
            const sum = weights.reduce((s,v)=>s+v,0);
            let r = Math.random()*sum;
            for (let i=0;i<weights.length;i++){
                if (r < weights[i]) return options[i];
                r -= weights[i];
            }
            return options[0];
        },

        // métricas matemáticas de decisión: devuelve un objeto con fórmulas y valores
        computeDecisionMetrics(analysis){
            const complexity = analysis.complexity || 0;
            const load = this.cargaCognitiva;
            // ejemplo: profundidadScore = nivelRazonamiento * (1 + complexity) / (1 + load)
            const profundidadScore = this.nivelRazonamiento * (1 + complexity) / (1 + load);
            // tiempo esperado = base + alpha * complexity * (1 + entropia)
            const expectedTime = 200 + 300 * complexity * (1 + this.entropiaInterna);
            // decisionEntropy (medida de incertidumbre) -> se normaliza en [0,1]
            const decisionEntropy = Math.min(1, (this.entropiaInterna + (1 - this.coherenciaGlobal))/2);
            return {profundidadScore, expectedTime, decisionEntropy};
        }
    };

    global.AIEngine = AIEngine;
})(window);
