/**
 * Infinix AI - Sistema Avanzado
 * Script principal
 */

// ===== Configuración y datos =====
const CONFIG = {
    LOADING_DURATION: 4000,
    INFINIX6_TIME_LIMIT: 600, // 10 minutos en segundos
    INFINIX6_MESSAGE_LIMIT: 3,
    AI_RESPONSE_DELAY: 500
};
// Variables adicionales configurables
Object.assign(CONFIG, {
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
    DEFAULT_PERSONALITY: 'neutral'
});

const diccionario = [
    "Hola", "Saludos", "Bienvenido", "Algoritmo", "Quantum", "Neurona", 
    "Sinápsis", "Infinito", "Matemática", "Ecuación", "Derivada", 
    "Integral", "Exponencial", "Logaritmo", "Teorema", "Axioma",
    "Dimensión", "Fractal", "Paradoja", "Simetría", "Vector", "Matriz"
];

const conocimientoMatematico = {
    "pi": "Pi (π) ≈ 3.14159265359. Relación entre circunferencia y diámetro.",
    "fibonacci": "Secuencia: 0, 1, 1, 2, 3, 5, 8, 13, 21...",
    "euler": "Número de Euler (e) ≈ 2.71828. Base de ln.",
    "pitagoras": "a² + b² = c²",
    "raiz": "√n × √n = n",
    "primo": "Números divisibles solo por 1 y sí mismos: 2, 3, 5, 7, 11...",
    "fraccion": "a/b representa parte de un todo"
};

// ===== Estado de la aplicación =====
const state = {
    versionActual: 4,
    contadorMensajes: 0,
    contadorCalculos: 0,
    infinix6Mensajes: 0,
    infinix6Timer: null,
    tiempoRestante: CONFIG.INFINIX6_TIME_LIMIT,
    infinix6Activo: false
};
// Estado extendido de IA (configurable en runtime)
Object.assign(state, {
    mode: 'chat', // modos: chat/math/assistant
    mood: 'calm', // ejemplo de estado interno
    personality: CONFIG.DEFAULT_PERSONALITY,
    context: '',
    shortTermMemory: [] // array para memoria temporal
});

// ===== Elementos del DOM =====
const elementos = {
    loadingScreen: null,
    mainInterface: null,
    chatContainer: null,
    userInput: null,
    messageCount: null,
    calcCount: null,
    versionLabel: null,
    aiName: null,
    aiEngine: null,
    trialTimer: null,
    timeRemaining: null,
    versionButtons: null
};

// ===== Inicialización =====
function inicializarApp() {
    // Cachear elementos del DOM
    elementos.loadingScreen = document.getElementById('loading-screen');
    elementos.mainInterface = document.getElementById('main-interface');
    elementos.chatContainer = document.getElementById('chatContainer');
    elementos.userInput = document.getElementById('userInput');
    elementos.messageCount = document.getElementById('messageCount');
    elementos.calcCount = document.getElementById('calcCount');
    elementos.versionLabel = document.getElementById('versionLabel');
    elementos.aiName = document.getElementById('aiName');
    elementos.aiEngine = document.getElementById('aiEngine');
    elementos.trialTimer = document.getElementById('trialTimer');
    elementos.timeRemaining = document.getElementById('timeRemaining');
    elementos.versionButtons = document.querySelectorAll('.version-btn');

    // Theme & history buttons
    elementos.toggleTheme = document.getElementById('toggleTheme');
    elementos.openHistory = document.getElementById('openHistory');
    elementos.historyPanel = null;

    // ===== Integración de nuevos sistemas =====
    
    // Activar plugins core
    if (typeof PluginSystem !== 'undefined'){
        PluginSystem.activate('math');
        PluginSystem.activate('code');
        PluginSystem.activate('chat');
        PluginSystem.activate('graphics');
    }
    
    // Registrar hooks para procesos de mensaje
    if (typeof PluginSystem !== 'undefined'){
        PluginSystem.registerHook('before_response', async (data) => {
            // Evaluar reglas antes de generar respuesta
            if (typeof RulesEngine !== 'undefined'){
                await RulesEngine.evaluateRules({message: data.message});
            }
            return data;
        });
        
        PluginSystem.registerHook('after_response', async (data) => {
            // Registrar experiencia después de responder
            if (typeof LearningSystem !== 'undefined'){
                const area = data.isCode ? 'programming' : 'general';
                LearningSystem.recordExperience(area);
                LearningSystem.analyzePattern(data.message, data.response);
            }
            return data;
        });
    }
    
    // Logger info
    if (typeof Logger !== 'undefined'){
        Logger.info('Application initialized', {
            version: state.versionActual,
            timestamp: new Date().toISOString()
        });
    }

    // Si no autenticado, mostrar modal de login
    if (typeof Auth !== 'undefined' && !Auth.isAuthenticated()){
        // bloquear interacciones hasta login
        Auth.requireLogin();
        addMessage('Acceso bloqueado: por favor inicia sesión para usar Infinix AI', 'system');
    }
    
    // Event listeners
    elementos.userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // Shortcuts: Ctrl+L limpiar, Ctrl+H historial
    document.addEventListener('keydown', (e)=>{
        if (e.ctrlKey && e.key.toLowerCase() === 'l'){
            e.preventDefault(); limpiarChat();
        }
        if (e.ctrlKey && e.key.toLowerCase() === 'h'){
            e.preventDefault(); toggleHistory();
        }
    });

    // Theme toggle
    if (elementos.toggleTheme) elementos.toggleTheme.addEventListener('click', ()=>{ toggleTheme(); });
    if (elementos.openHistory) elementos.openHistory.addEventListener('click', ()=>{ toggleHistory(); });

    // Apply saved theme
    initTheme();

    // Render history panel container
    elementos.historyPanel = document.createElement('div');
    elementos.historyPanel.id = 'historyPanel';
    document.body.appendChild(elementos.historyPanel);
    renderHistory();

    // Handlers para modal de código (si CodeGenerator está disponible)
    const codeModal = document.getElementById('codeModal');
    const closeCodeBtn = document.getElementById('closeCode');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    if (closeCodeBtn) closeCodeBtn.addEventListener('click', ()=>{ codeModal.setAttribute('aria-hidden','true'); });
    if (copyCodeBtn) copyCodeBtn.addEventListener('click', ()=>{ 
        const code = document.getElementById('codeBlock').textContent;
        navigator.clipboard.writeText(code).then(()=>{ alert('Código copiado al portapapeles'); }).catch(e=> console.error(e));
    });
    // Escuchar si hay código generado y mostrar modal automáticamente
    const originalReveal = revealTyping;
    window.revealTyping = async function(typingDiv, text, analysis){
        // si contiene bloque de código, extraerlo y mostrar en modal
        const codeMatch = text.match(/```(\w+)\n([\s\S]*?)\n```/);
        if (codeMatch){
            const lang = codeMatch[1];
            const code = codeMatch[2];
            document.getElementById('codeLang').textContent = 'Código: ' + lang.toUpperCase();
            document.getElementById('codeBlock').textContent = code;
            codeModal.setAttribute('aria-hidden','false');
            // remover bloque de código del texto para no mostrar en chat
            text = text.replace(/```\w+\n[\s\S]*?\n```\n\n/, '');
        }
        return originalReveal.call(this, typingDiv, text, analysis);
    };

    // Mostrar interfaz después de cargar
    setTimeout(() => {
        elementos.loadingScreen.classList.add('hidden');
        elementos.mainInterface.classList.add('visible');
        
        const palabra = obtenerPalabraAleatoria();
        addMessage(
            `${palabra}! Soy Infinix-4, tu IA más avanzada.\n\n` +
            `📊 Matemáticas | ⚛️ Física | 🧪 Química | 💻 Programación\n\n` +
            `¿En qué puedo ayudarte?`,
            'ai'
        );
    }, CONFIG.LOADING_DURATION);
}

// ===== Funciones de utilidad =====
function obtenerPalabraAleatoria() {
    return diccionario[Math.floor(Math.random() * diccionario.length)];
}

function actualizarContador(tipo) {
    if (tipo === 'mensaje') {
        state.contadorMensajes++;
        elementos.messageCount.textContent = state.contadorMensajes;
    } else if (tipo === 'calculo') {
        state.contadorCalculos++;
        elementos.calcCount.textContent = state.contadorCalculos;
    }
}

// ===== Gestión de mensajes =====
/**
 * Añade un mensaje al contenedor de chat de forma segura (sin innerHTML)
 * @param {string} text
 * @param {'ai'|'user'|'system'} sender
 */
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;

    if (sender === 'ai') {
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.textContent = '🤖';
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = text;
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(bubble);
    } else {
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = text;
        messageDiv.appendChild(bubble);
    }

    elementos.chatContainer.appendChild(messageDiv);
    elementos.chatContainer.scrollTop = elementos.chatContainer.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Valida que la entrada sea una expresión matemática segura mínima.
 * @param {string} expr
 * @returns {boolean}
 */
function validarEntrada(expr){
    if (!expr || typeof expr !== 'string') return false;
    // permitir dígitos, operadores, paréntesis, punto, comas y letras para funciones
    if (/[^0-9+\-*/^()\.\, \tA-Za-zππ√]/.test(expr)) return false;
    // bloquear palabras peligrosas
    if (/(eval|Function|constructor|window|document|fetch|XMLHttpRequest|require|process)/i.test(expr)) return false;
    return expr.trim().length>0;
}

/** Tokeniza la expresión y aplica multiplicación implícita y detecta unarios.
 * @param {string} input
 * @returns {Array} tokens
 */
function tokenizeExpression(input){
    input = input.replace(/π/gi,'pi').replace(/√/g,'sqrt');
    const raw = [];
    for (let i=0;i<input.length;){
        const ch = input[i];
        if (/\s/.test(ch)){ i++; continue; }
        if (/[0-9.]/.test(ch)){
            let num = ch; i++; while(i<input.length && /[0-9.]/.test(input[i])) num+=input[i++]; raw.push({type:'num', value: parseFloat(num)}); continue;
        }
        if (/[a-zA-Z]/.test(ch)){
            let id = ch; i++; while(i<input.length && /[a-zA-Z0-9_]/.test(input[i])) id+=input[i++]; raw.push({type:'id', value:id}); continue;
        }
        if ('+-*/^(),'.includes(ch)){ raw.push({type:'op', value:ch}); i++; continue; }
        // si hay espacio u otro caracter, saltarlo
        i++;
    }
    // insertar multiplicación implícita: num/id/')' seguido de id/num/'(' => '*'
    const tokens = [];
    for (let i=0;i<raw.length;i++){
        const cur = raw[i];
        const prev = tokens.length? tokens[tokens.length-1] : null;
        // si prev es num/id/closeParen y cur is id/num/openParen -> insertar '*'
        if (prev && ((prev.type==='num') || (prev.type==='op' && prev.value===')') ) || (prev.type==='id')){
            if ((cur.type==='id') || (cur.type==='num') || (cur.type==='op' && cur.value==='(')){
                tokens.push({type:'op', value:'*'});
            }
        }
        tokens.push(cur);
    }
    // detectar signos unarios: '-' o '+' al inicio o después de operador/(' => marcar como 'u-' o 'u+'
    const finalTokens = [];
    for (let i=0;i<tokens.length;i++){
        const t = tokens[i];
        if (t.type==='op' && (t.value==='-' || t.value==='+' )){
            const prev = finalTokens.length? finalTokens[finalTokens.length-1] : null;
            if (!prev || (prev.type==='op' && prev.value!==')')){
                finalTokens.push({type:'op', value: t.value==='-' ? 'u-' : 'u+'});
                continue;
            }
        }
        finalTokens.push(t);
    }
    return finalTokens;
}

/** Convierte tokens a RPN y opcionalmente devuelve pasos para explicación.
 * @param {Array} tokens
 * @returns {{rpn:Array, steps?:Array}}
 */
function toRPN(tokens){
    const out = [], ops = [];
    const prec = {'u-':4,'u+':4,'^':3,'*':2,'/':2,'+':1,'-':1};
    const rightAssoc = {'^':true,'u-':true,'u+':true};
    tokens.forEach(t=>{
        if (t.type==='num') out.push(t);
        else if (t.type==='id') ops.push(t);
        else if (t.type==='op'){
            const v = t.value;
            if (v===','){
                while(ops.length && ops[ops.length-1].value!=='(') out.push(ops.pop());
            } else if (v==='(') ops.push(t);
            else if (v===')'){
                while(ops.length && ops[ops.length-1].value!=='(') out.push(ops.pop());
                if (!ops.length) throw new Error('Paréntesis mismatch');
                ops.pop();
                if (ops.length && ops[ops.length-1].type==='id') out.push(ops.pop());
            } else {
                while(ops.length){
                    const top = ops[ops.length-1].value;
                    if (top==='(') break;
                    const topP = prec[top]||0, curP = prec[v]||0;
                    if ((rightAssoc[v] ? curP < topP : curP <= topP)) out.push(ops.pop());
                    else break;
                }
                ops.push(t);
            }
        }
    });
    while(ops.length){ const op = ops.pop(); if (op.value==='('||op.value===')') throw new Error('Paréntesis mismatch'); out.push(op); }
    return {rpn: out};
}

/** Evalúa RPN y opcionalmente genera pasos de evaluación.
 * @param {Array} rpn
 * @param {boolean} explain
 * @returns {{result:number, steps?:Array}}
 */
function evalRPN(rpn, explain=false){
    const funcs = { sin: Math.sin, cos: Math.cos, tan: Math.tan, log: (x)=>Math.log10(x), ln: Math.log, sqrt: Math.sqrt, abs: Math.abs };
    const stack = [];
    const steps = [];
    for (const tok of rpn){
        if (tok.type==='num') { stack.push(tok.value); if (explain) steps.push({op:'push', value:tok.value, stack: stack.slice()}); }
        else if (tok.type==='id'){
            const fn = funcs[tok.value.toLowerCase()]; if (!fn) throw new Error('Función desconocida: '+tok.value);
            const a = stack.pop(); const res = fn(a); stack.push(res); if (explain) steps.push({op:'fn', name:tok.value, arg:a, res, stack: stack.slice()});
        } else if (tok.type==='op'){
            if (tok.value==='u-' || tok.value==='u+'){
                const a = stack.pop(); const res = tok.value==='u-'? -a : +a; stack.push(res); if (explain) steps.push({op:tok.value, arg:a, res, stack: stack.slice()});
            } else {
                const b = stack.pop(), a = stack.pop(); let res;
                switch(tok.value){ case '+': res = a+b; break; case '-': res = a-b; break; case '*': res = a*b; break; case '/': res = a/b; break; case '^': res = Math.pow(a,b); break; default: throw new Error('Operador desconocido: '+tok.value); }
                stack.push(res); if (explain) steps.push({op:tok.value, a, b, res, stack: stack.slice()});
            }
        }
    }
    if (stack.length!==1) throw new Error('Expresión inválida');
    return {result: stack[0], steps: explain? steps : undefined};
}

/** Genera una explicación paso a paso para una expresión matemática.
 * @param {string} expr
 * @returns {string}
 */
function explainCalculation(expr){
    try{
        const rawInput = expr.replace(/\s+/g,'');
        const tokens = tokenizeExpression(rawInput);
        const {rpn} = toRPN(tokens);
        const evalRes = evalRPN(rpn, true);
        const lines = [];
        lines.push(`Expresión: ${expr}`);
        lines.push('Tokens: ' + tokens.map(t=> t.type==='num'? t.value : t.type==='id'? t.value : t.value).join(' '));
        lines.push('RPN: ' + rpn.map(t=> t.type==='num'? t.value : t.type==='id'? t.value : t.value).join(' '));
        lines.push('Evaluación paso a paso:');
        evalRes.steps.slice(0,50).forEach((s, i)=>{
            if (s.op==='push') lines.push(`${i+1}. push ${s.value} -> stack=${JSON.stringify(s.stack)}`);
            else if (s.op==='fn') lines.push(`${i+1}. ${s.name}(${s.arg}) = ${s.res} -> stack=${JSON.stringify(s.stack)}`);
            else if (s.op==='u-'||s.op==='u+') lines.push(`${i+1}. ${s.op} ${s.arg} = ${s.res} -> stack=${JSON.stringify(s.stack)}`);
            else lines.push(`${i+1}. ${s.a} ${s.op} ${s.b} = ${s.res} -> stack=${JSON.stringify(s.stack)}`);
        });
        lines.push('Resultado: ' + evalRes.result);
        return lines.join('\n');
    }catch(e){ return 'No se pudo generar explicación: ' + e.message; }
}

function sendMessage() {
    const mensaje = elementos.userInput.value.trim();
    
    if (mensaje === '') return;
    // Verificar autenticación
    if (typeof Auth !== 'undefined' && !Auth.isAuthenticated()){
        addMessage('Acceso BLOQUEADO: inicia sesión para enviar mensajes.', 'system');
        Auth.requireLogin();
        return;
    }
    
    // Verificar límite de Infinix 6
    if (state.versionActual === 6) {
        state.infinix6Mensajes++;
        if (state.infinix6Mensajes >= CONFIG.INFINIX6_MESSAGE_LIMIT) {
            addMessage(mensaje, 'user');
            elementos.userInput.value = '';
            setTimeout(() => {
                addMessage('Límite de 3 mensajes alcanzado 🔒', 'system');
                finalizarPruebaInfinix6();
            }, CONFIG.AI_RESPONSE_DELAY);
            return;
        }
    }
    
    // Añadir mensaje de usuario y limpiar input
    addMessage(mensaje, 'user');
    elementos.userInput.value = '';
    actualizarContador('mensaje');

    // Pipeline avanzado: analizar, pensar con delay dinámico, mostrar indicador y luego responder
    processUserMessage(mensaje);
}

// Cambiar versión y aplicar reglas de acceso Infinix
function cambiarVersion(v){
    // v = 3,4,6
    if (v === 4){
        // visible pero no usable
        addMessage('Infinix 4: Disponible próximamente. Redirigiendo a Infinix 3.', 'system');
        state.versionActual = 3;
        elementos.versionLabel.textContent = 'Infinix 3 (limitado)';
        return;
    }
    if (v === 6){
        addMessage('Infinix 6: Acceso restringido. Redirigiendo a Infinix 3.', 'system');
        state.versionActual = 3;
        elementos.versionLabel.textContent = 'Infinix 3 (limitado)';
        return;
    }
    // default: set to 3
    state.versionActual = 3;
    elementos.versionLabel.textContent = 'Infinix 3';
}

/** Procesa el mensaje del usuario con análisis y respuesta humana-simulada */
function processUserMessage(mensaje){
    // análisis semántico y de intención
    const analysis = analyzeMessage(mensaje);
    const langContext = {
        authUser: Auth?.getUser?.(),
        versionInfinix: state.versionActual,
        tokensDisponibles: state.tokensDisponibles || 0,
        complejidadPermitida: state.complejidadPermitida || 0.4,
        permisoAvanzado: Auth?.getUser?.()?.permisoAvanzado || false
    };
    const langEval = typeof LanguageAnalyzer !== 'undefined' ? LanguageAnalyzer.evaluate(mensaje, langContext) : null;
    if (langEval){
        state.idiomaDetectado = langEval.idiomaDetectado;
        state.intencionDetectada = langEval.intencionDetectada;
        state.estadoAcceso = langEval.estadoAcceso;
        // Si bloqueado, enviar respuesta fija y detener pipeline
        if (langEval.isBlocked){
            addMessage(langEval.fixedMessage || 'Acceso restringido.', 'system');
            return;
        }
        // Si requiere carga, enviar mensaje fijo
        if (langEval.requiereCarga){
            addMessage(langEval.fixedMessage || 'Esta función requiere carga adicional.', 'system');
            return;
        }
    }
    
    // Log el análisis del mensaje
    if (typeof Logger !== 'undefined'){
        Logger.logDecision('Message analyzed', {
            intent: analysis.intent,
            complexity: analysis.complexity,
            hasQuestion: analysis.hasQuestion
        });
    }
    
    updateStateFromAnalysis(analysis);
    
    // Ejecutar hooks antes de respuesta
    let hookData = {message: mensaje, analysis: analysis, isCode: false};
    if (typeof PluginSystem !== 'undefined'){
        PluginSystem.executeHook('before_response', hookData).then(data => hookData = data);
    }
    
    // actualizar AIEngine si existe (no obligatorio)
    if (window.AIEngine && typeof AIEngine.updateState === 'function'){
        AIEngine.updateState(state, analysis);
        // opcional: usar métricas para ajustar delay
        const metrics = AIEngine.computeDecisionMetrics(analysis);
        // ajustar profundidad y confianza según engine
        state.profundidadRespuesta = metrics.profundidadScore > 0.6 ? 'profunda' : state.profundidadRespuesta;
        state.confianzaRespuesta = Math.min(1, state.confianzaRespuesta + (1 - metrics.decisionEntropy)*0.1);
    }
    
    // Actualizar estadísticas del perfil
    if (typeof UserProfiles !== 'undefined'){
        UserProfiles.updateStats('messagesCount');
    }
    
    const delay = computeThinkingDelay(analysis);

    // Mostrar indicador "pensando..." como mensaje AI temporal
    const typingBubble = addTypingBubble();

    // timeout para "pensar"
    setTimeout(async ()=>{
        // decidir si pedir aclaración
        const shouldAsk = shouldAskClarifyingQuestion(analysis);
        let respuesta = '';
        if (shouldAsk) respuesta = generateClarifyingQuestion(mensaje, analysis);
        else respuesta = generarRespuesta(mensaje);

        // Ejecutar hooks después de respuesta
        hookData.response = respuesta;
        if (typeof PluginSystem !== 'undefined'){
            await PluginSystem.executeHook('after_response', hookData);
        }

        // Simular tipeo humano: revelar texto gradualmente
        await revealTyping(typingBubble, respuesta, analysis);
    }, delay);
}

/** Analiza el mensaje para extraer métricas y detectar intención */
function analyzeMessage(text){
    const cleaned = text.trim();
    const length = cleaned.length;
    const words = (cleaned.match(/\b[\wáéíóúñ]+\b/gi) || []);
    const wordCount = words.length;
    const avgWordLen = wordCount? words.join('').length / wordCount : 0;
    const unique = Array.from(new Set(words.map(w=>w.toLowerCase())));
    const keywordMatches = unique.filter(w=> Object.keys(conocimientoMatematico).includes(w.toLowerCase()));
    const conceptsCount = keywordMatches.length;
    const hasQuestion = /\?|^\s*¿/.test(cleaned) || /como|qué|por qué|cuando|dónde|quién/.test(cleaned.toLowerCase());
    // complexity heuristic: avg word length and punctuation
    const punctuationCount = (cleaned.match(/[.,;:\(\)]/g)||[]).length;
    const complexity = (avgWordLen/6) + Math.min(1, punctuationCount/5) + Math.min(1, conceptsCount/3);
    // intent detection simple
    let intent = 'casual';
    if (hasQuestion) intent = 'pregunta';
    else if (/^(por favor|porfa|haz|realiza|dime|explica|resuelve)\b/i.test(cleaned)) intent = 'orden';
    else if (/gracias|hola|buenos|buenas|hey/i.test(cleaned)) intent = 'saludo';

    return {text: text, length, wordCount, avgWordLen, unique, keywordMatches, conceptsCount, hasQuestion, complexity, intent};
}

/** Actualiza el estado interno de la IA basado en el análisis */
function updateStateFromAnalysis(analysis){
    // energía IA aleatoria ajustada por complejidad
    state.energiaIA = Math.max(0.2, Math.min(1, 1 - analysis.complexity*0.3 + (Math.random()-0.5)*0.2));
    // nivel de análisis según complejidad
    state.nivelAnalisis = analysis.complexity > 1.2 ? 'alto' : (analysis.complexity > 0.6 ? 'medio' : 'bajo');
    // estado mental simple mapping
    if (state.energiaIA < 0.35) state.estadoMental = 'confusion';
    else if (analysis.complexity > 1.2) state.estadoMental = 'enfoque';
    else state.estadoMental = 'calma';
    state.profundidadRespuesta = state.nivelAnalisis === 'alto' ? 'profunda' : (state.nivelAnalisis === 'medio' ? 'detallada' : 'superficial');
    state.confianzaRespuesta = Math.max(0, 1 - analysis.complexity*0.2 + Math.random()*0.2);
    state.historialContexto = memoryGetRecent(10).map(m=>m.text).join(' | ');
    state.intencionUsuario = analysis.intent;
    state.probabilidadPregunta = analysis.hasQuestion ? 0.9 : 0.1;
}

/** Calcula un delay "pensando" basado en longitud, complejidad y conceptos */
function computeThinkingDelay(analysis){
    const base = 350; // ms
    const perWord = 60; // ms por palabra
    const perComplex = Math.round(analysis.complexity * 400);
    const perConcept = analysis.conceptsCount * 220;
    const energyFactor = 1 + (0.6 - state.energiaIA); // menos energía -> más tiempo
    let delay = Math.max(300, base + perWord*analysis.wordCount + perComplex + perConcept);
    delay = Math.min(delay * energyFactor, 7000); // cap
    // añadir micro variaciones
    delay += Math.floor(Math.random()*300 - 150);
    return Math.max(200, Math.round(delay));
}

/** Añade un bubble temporal de "typing" y lo retorna */
function addTypingBubble(){
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai typing';
    const avatar = document.createElement('div'); avatar.className='avatar'; avatar.textContent='🤖';
    const bubble = document.createElement('div'); bubble.className='message-bubble'; bubble.textContent = 'pensando...';
    messageDiv.appendChild(avatar); messageDiv.appendChild(bubble);
    elementos.chatContainer.appendChild(messageDiv);
    elementos.chatContainer.scrollTop = elementos.chatContainer.scrollHeight;
    return messageDiv;
}

/** Revela texto en el bubble simulando tipeo humano; devuelve Promise cuando termina */
function revealTyping(typingDiv, text, analysis){
    return new Promise((resolve)=>{
        const bubble = typingDiv.querySelector('.message-bubble');
        bubble.textContent = '';
        const energy = state.energiaIA || 0.8;
        // velocidad en ms por carácter (menor = más rápido)
        const baseSpeed = 30; // ms per char
        const speed = Math.max(8, Math.round(baseSpeed * (1.2 - energy) + (Math.random()*20 -10)));
        let i = 0;
        // ocasionalmente introducir micro hesitaciones
        function step(){
            if (i >= text.length){ resolve(); return; }
            bubble.textContent += text[i++];
            elementos.chatContainer.scrollTop = elementos.chatContainer.scrollHeight;
            // small pause on punctuation
            const ch = text[i-1];
            let delay = speed;
            if (/[.,;:!?]/.test(ch)) delay += 80 + Math.random()*120;
            // occasional doubt insertion
            if (Math.random() < 0.005) delay += 200 + Math.random()*400;
            setTimeout(step, delay);
        }
        // start with short random initial pause to feel human
        setTimeout(step, 120 + Math.random()*240);
    });
}

/** Decide si conviene preguntar aclaración */
function shouldAskClarifyingQuestion(analysis){
    // si baja coincidencia de keywords y baja confianza, y no es explícita pregunta
    const lowKeywords = analysis.conceptsCount === 0;
    const ambiguous = analysis.wordCount < 6 && analysis.complexity < 0.5;
    const lowConfidence = state.confianzaRespuesta < 0.45;
    // preguntar si ambigüedad y baja confianza o si mensaje corto e impreciso
    if ((lowKeywords && lowConfidence) || (ambiguous && Math.random() < 0.6)) return true;
    return false;
}

/** Genera pregunta aclaratoria natural */
function generateClarifyingQuestion(message, analysis){
    const ques = [
        '¿Podrías dar un ejemplo o más contexto?',
        '¿Te refieres a esto en particular o a otra cosa?',
        '¿Quieres que lo resuelva ahora o prefieres una explicación general?'
    ];
    // elegir según intent
    if (analysis.intent === 'orden') return '¿Puedes especificar el formato o el objetivo del resultado?';
    if (analysis.intent === 'pregunta') return randomChoice(ques);
    return randomChoice(ques);
}

// ===== Evaluación matemática =====
/**
 * Parser matemático seguro usando shunting-yard y RPN evaluation.
 * Soporta funciones sencillas y operadores básicos.
 * @param {string} input
 * @returns {string|null}
 */
function evaluarMatematica(input){
    try {
        if (!validarEntrada(input)) return null;
        const exprOriginal = input;
        // Normalizar símbolos
        input = input.replace(/π/gi, 'pi');
        input = input.replace(/√/g, 'sqrt');
        input = input.replace(/\s+/g,'');

        // Tokenizador
        const funcs = {
            sin: Math.sin, cos: Math.cos, tan: Math.tan,
            log: (x)=>Math.log10(x), ln: Math.log, sqrt: Math.sqrt, abs: Math.abs
        };

        const tokens = [];
        for (let i=0;i<input.length;){
            const ch = input[i];
            if (/[0-9.]/.test(ch)){
                let num = ch; i++;
                while(i<input.length && /[0-9.]/.test(input[i])) num+=input[i++];
                tokens.push({type:'num', value: parseFloat(num)});
                continue;
            }
            if (/[a-zA-Z]/.test(ch)){
                let id = ch; i++;
                while(i<input.length && /[a-zA-Z0-9_]/.test(input[i])) id+=input[i++];
                tokens.push({type:'id', value:id});
                continue;
            }
            if ('+-*/^(),'.includes(ch)){
                tokens.push({type:'op', value:ch}); i++; continue;
            }
            // carácter no válido
            return null;
        }

        // Shunting-yard -> RPN
        const out = [], ops = [];
        const prec = {'+':1,'-':1,'*':2,'/':2,'^':3};
        const rightAssoc = {'^':true};
        tokens.forEach(t=>{
            if (t.type==='num') out.push(t);
            else if (t.type==='id') ops.push(t);
            else if (t.type==='op'){
                const v = t.value;
                if (v===','){
                    while(ops.length && ops[ops.length-1].value!=='(') out.push(ops.pop());
                } else if (v==='('){ ops.push(t); }
                else if (v===')'){
                    while(ops.length && ops[ops.length-1].value!=='(') out.push(ops.pop());
                    if (!ops.length) throw new Error('Mismatched parentheses');
                    ops.pop();
                    if (ops.length && ops[ops.length-1].type==='id') out.push(ops.pop());
                } else {
                    while(ops.length){
                        const top = ops[ops.length-1].value;
                        if (top==='(') break;
                        const topPrec = prec[top]||0, curPrec = prec[v]||0;
                        if ((rightAssoc[v] ? curPrec < topPrec : curPrec <= topPrec)) out.push(ops.pop());
                        else break;
                    }
                    ops.push(t);
                }
            }
        });
        while(ops.length){ const op = ops.pop(); if (op.value==='('||op.value===')') throw new Error('Mismatched parentheses'); out.push(op); }

        // Evaluar RPN
        const stack = [];
        out.forEach(tok=>{
            if (tok.type==='num') stack.push(tok.value);
            else if (tok.type==='id'){
                const fn = funcs[tok.value.toLowerCase()];
                if (!fn) throw new Error('Función desconocida: '+tok.value);
                const a = stack.pop();
                stack.push(fn(a));
            } else if (tok.type==='op'){
                const b = stack.pop(), a = stack.pop();
                switch(tok.value){
                    case '+': stack.push(a+b); break;
                    case '-': stack.push(a-b); break;
                    case '*': stack.push(a*b); break;
                    case '/': stack.push(a/b); break;
                    case '^': stack.push(Math.pow(a,b)); break;
                    default: throw new Error('Operador desconocido: '+tok.value);
                }
            }
        });
        if (stack.length!==1) return null;
        const resultado = stack[0];
        actualizarContador('calculo');
        try{ History.add({expr: exprOriginal, result: resultado}); } catch(e){}
        return `📊 "${exprOriginal}" = ${resultado}`;
    } catch (e){
        return null;
    }
}

// ===== Generación de respuestas =====
/** Sistema de respuesta avanzado: multi-estilo, personalidad y selección por palabras clave/estado */
function generarRespuesta(mensaje) {
    const ml = mensaje.toLowerCase();

    // registrar en memoria corta
    memoryAdd({type:'user', text:mensaje, when: Date.now()});
    
    // Registrar en logger del sistema
    if (typeof Logger !== 'undefined'){
        Logger.info('Generating response', {
            messageLength: mensaje.length,
            complexity: analyzeMessage(mensaje).complexity
        });
    }

    // 1) Casos especiales por versión y temas (mantener compatibilidad)
    if (state.versionActual === 6) {
        if (ml.includes('cuantica') || ml.includes('quantum')) return `🌌 Mecánica Cuántica:\n\n• Superposición de estados\n• Entrelazamiento cuántico\n• Heisenberg: Δx·Δp ≥ ħ/2\n• Schrödinger: iħ∂ψ/∂t = Ĥψ\n• Aplicaciones: computación cuántica, criptografía`;
        if (ml.includes('machine learning') || ml.includes('ml')) return `🧠 Machine Learning:\n\n• Deep Learning (CNN, RNN, Transformers)\n• Random Forest\n• SVM\n• Gradient Boosting\n• Frameworks: TensorFlow, PyTorch`;
    }
    if (state.versionActual === 5) {
        if (ml.includes('hola')) return '¡Hola! 👋 Soy Fanix-5. ¿Cómo te va hoy? 😊';
        if (ml.includes('triste')) return 'Lo siento 😔 Estoy aquí para ti. ¿Quieres hablar? 💙';
    }

    // temas rápidos
    if (ml.includes('fisica')) return '⚛️ Física:\n\n• F = ma\n• E = mc²\n• V = IR\n• PV = nRT\n\n¿Qué problema resolver?';
    if (ml.includes('quimica')) return '🧪 Química:\n\n• Estequiometría\n• Tabla periódica\n• pH = -log[H⁺]\n• 2H₂ + O₂ → 2H₂O';

    // saludos y cortesía
    if (ml.includes('hola')) return applyPersonality('¡Hola! 👋 ¿En qué puedo ayudarte?', state.personality);
    if (ml.includes('gracias')) return applyPersonality('¡De nada! 😊', state.personality);

    // 2) conocimiento matemático
    for (const concepto in conocimientoMatematico) if (ml.includes(concepto)) return applyPersonality(conocimientoMatematico[concepto], state.personality);

    // 2.5) Detectar si es petición de código (CodeGenerator)
    if (window.CodeGenerator && typeof CodeGenerator.analizarPeticion === 'function'){
        const analisisCode = CodeGenerator.analizarPeticion(mensaje);
        if (analisisCode.esCodigoReq){
            const codigoGen = CodeGenerator.generarCodigo(analisisCode);
            state.codigoGenerado = codigoGen; // guardar para mostrarlo en UI
            const respuesta = `\`\`\`${codigoGen.lenguaje}\n${codigoGen.codigo}\n\`\`\`\n\n${codigoGen.explicacion}`;
            return applyPersonality(respuesta, state.personality);
        }
    }

    // 3) Intentar evaluación matemática (prioritario)
    const resultadoMat = evaluarMatematica(mensaje);
    if (resultadoMat) {
        const explicacion = explainCalculation(mensaje);
        const base = resultadoMat + '\n\n' + explicacion;
        const style = chooseResponseStyle(mensaje);
        return applyPersonality(applyStyle(base, style), state.personality);
    }

    // 4) Generar varias formas de respuesta y seleccionar
    const candidates = produceBaseResponses(mensaje);
    // si no hay candidato útil, fallback
    if (!candidates || candidates.length===0) return applyPersonality(fallbackResponse(mensaje), state.personality);

    const style = chooseResponseStyle(mensaje);
    // elegir candidato por prioridad simple: prefer respuestas que contengan una keyword
    let chosen = candidates.find(c=> c.toLowerCase().includes(bestKeyword(mensaje))) || candidates[0];
    // aplicar estilo y personalidad
    const final = applyPersonality(applyStyle(chosen, style), state.personality);
    return final;
}

/** Memoria corta: añadir y obtener */
function memoryAdd(item){
    state.shortTermMemory.unshift(item);
    if (state.shortTermMemory.length > CONFIG.MAX_SHORT_TERM_MEMORY) state.shortTermMemory.pop();
}
function memoryGetRecent(n=5){ return state.shortTermMemory.slice(0,n); }

/** Extrae la mejor keyword del mensaje (simple heurística) */
function bestKeyword(text){
    const words = text.toLowerCase().match(/[a-zñáéíóú]+/g) || [];
    // preferir tokens largos o relevantes
    words.sort((a,b)=> b.length - a.length);
    return words[0] || '';
}

/** Produce un conjunto de respuestas base según heurísticas simples */
function produceBaseResponses(mensaje){
    const ml = mensaje.toLowerCase();
    const out = [];
    // si pregunta (interrogativos)
    if (/\?/.test(mensaje) || /como|qué|por qué|cuando|dónde/.test(ml)){
        out.push('Buena pregunta. Aquí tienes una explicación concisa:');
        out.push('Puedo explicarlo paso a paso. ¿Quieres que lo desgl ose?');
        out.push('Intento resumir: ' + mensaje);
    }
    // si es una petición de código o ayuda técnica
    if (ml.includes('codigo') || ml.includes('programacion') || ml.includes('js')){
        out.push('Puedo darte un ejemplo de código y explicarlo. ¿Qué lenguaje prefieres?');
        out.push('Resumen rápido: divide el problema en funciones pequeñas.');
    }
    // respuestas genéricas
    out.push('Puedo ayudarte con matemáticas, física, química o programación. ¿Cuál eliges?');
    out.push('Si quieres, muéstrame la expresión y la resuelvo paso a paso.');
    // añadir respuestas aleatorias leves
    out.push(randomChoice(['Interesante. Dime más.', 'Perfecto — vamos por partes.', 'Entendido. Preparando explicación...']));
    return out;
}

/** Fallback inteligente cuando no entiende */
function fallbackResponse(mensaje){
    const templates = [
        'Lo siento, no entendí exactamente. ¿Puedes reformularlo?',
        'No estoy seguro. ¿Quieres que lo intente paso a paso?',
        '¿Podrías dar más contexto o un ejemplo?'
    ];
    // usar memoria reciente para sugerir
    const recent = memoryGetRecent(3).map(m=>m.text).filter(Boolean);
    if (recent.length) return templates[0] + ' Recuerdo que hablamos de: ' + recent.join(' | ');
    return randomChoice(templates);
}

/** Selección de estilo de respuesta basada en heurística y pesos */
function chooseResponseStyle(mensaje){
    const ml = mensaje.toLowerCase();
    const weights = Object.assign({}, CONFIG.RESPONSE_STYLES);
    // favorecer versiones serias si contiene "error" o "importante"
    if (/error|importante|urgente/.test(ml)) weights.serious *= 1.5;
    // favorecer largo si hay muchas palabras
    if (mensaje.length > 120) weights.long *= 1.8;
    if (mensaje.length < 30) weights.short *= 1.5;
    // pequeñas probabilidades de caos o brainrot
    if (Math.random() < 0.02) weights.brainrot *= 3;
    if (Math.random() < 0.05) weights.chaotic *= 2;
    return weightedChoice(weights);
}

/** Aplicar estilo a un texto */
function applyStyle(text, style){
    if (!text) return text;
    switch(style){
        case 'short': return text.split('\n')[0];
        case 'long': return text + '\n\n' + 'Detalles: ' + generateLongExplanation(text);
        case 'chaotic': return chaoticify(text);
        case 'brainrot': return brainrotify(text);
        case 'serious': return seriousify(text);
        default: return text;
    }
}

function generateLongExplanation(base){ return base + ' (explicación ampliada con más contexto y ejemplos.)'; }
function chaoticify(s){ return s.split(' ').map(w=> Math.random()<0.15? w.toUpperCase() : w).join(' ') + ' 🤪'; }
function brainrotify(s){ return s + '\n' + s.split(' ').slice(0,4).join(' ') + '... ' + '¿ves?'; }
function seriousify(s){ return '📘 Respuesta técnica:\n' + s.replace(/🤖|😊|🤪/g,''); }

/** Aplicar transformaciones según personalidad */
function applyPersonality(text, personality){
    if (!text) return text;
    switch(personality){
        case 'friendly': return text + '\n\nEstoy aquí para ayudarte 💙';
        case 'sarcastic': return text + '\n\n(Esto es lo mejor que puedo hacer, aparentemente)';
        case 'academic': return 'Según la literatura:\n' + text;
        default: return text; // neutral
    }
}

/** Utilidades: elección ponderada y aleatoria */
function weightedChoice(weights){
    const entries = Object.entries(weights).filter(([k,v])=> v>0);
    const total = entries.reduce((s,[_k,v])=>s+v,0);
    let r = Math.random()*total; for (const [k,v] of entries){ if (r < v) return k; r -= v; } return entries[0][0];
}
function randomChoice(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

// ===== Gestión de versiones =====
// ===== Historial (localStorage) =====
const History = (function(){
    const KEY = 'infinix_history_v1';
    function load(){ try{ return JSON.parse(localStorage.getItem(KEY)||'[]'); } catch(e){ return []; } }
    function save(list){ localStorage.setItem(KEY, JSON.stringify(list)); }
    function add(item){
        const list = load();
        list.unshift({expr:item.expr, result:item.result, when: Date.now()});
        if (list.length>100) list.pop();
        save(list);
        renderHistory();
        return list;
    }
    function clear(){ localStorage.removeItem(KEY); renderHistory(); }
    return {load, add, clear};
})();

/** Mostrar/ocultar panel de historial */
function toggleHistory(){
    if (!elementos.historyPanel) return;
    elementos.historyPanel.classList.toggle('active');
}

/** Renderiza el historial en el panel */
function renderHistory(){
    if (!elementos.historyPanel) return;
    const list = History.load();
    elementos.historyPanel.innerHTML = '';
    const title = document.createElement('div');
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '8px';
    title.textContent = 'Historial';
    elementos.historyPanel.appendChild(title);
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Borrar';
    clearBtn.style.marginBottom = '8px';
    clearBtn.addEventListener('click', ()=>{ History.clear(); });
    elementos.historyPanel.appendChild(clearBtn);
    list.forEach(item=>{
        const div = document.createElement('div');
        div.className = 'history-item';
        const d = new Date(item.when);
        div.textContent = `${d.toLocaleString()}: ${item.expr} = ${item.result}`;
        elementos.historyPanel.appendChild(div);
    });
}

// ===== Tema (dark/light) =====
function toggleTheme(to){
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = to || (current === 'dark' ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('infinix_theme', next);
    if (elementos.toggleTheme) elementos.toggleTheme.setAttribute('aria-pressed', next==='dark' ? 'true' : 'false');
}

function initTheme(){
    const saved = localStorage.getItem('infinix_theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches) document.documentElement.setAttribute('data-theme','dark');
}
function cambiarVersion(version) {
    if (version === 6) {
        if (!state.infinix6Activo) {
            iniciarPruebaInfinix6();
        }
        return;
    }

    state.versionActual = version;
    
    // Actualizar botones
    elementos.versionButtons.forEach((btn, idx) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
        if (idx === (version === 4 ? 0 : 1)) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        }
    });

    // Actualizar interfaz según versión
    if (version === 4) {
        elementos.aiName.textContent = '⚡ Infinix-4';
        elementos.aiEngine.textContent = 'Infinix 4 Ultra AI Engine';
        elementos.versionLabel.textContent = 'Infinix 4';
        addMessage('Infinix 4 activado. Matemáticas | Física | Química | Programación 🚀', 'ai');
    } else {
        elementos.aiName.textContent = '💬 Fanix-5';
        elementos.aiEngine.textContent = 'Fanix 5 Social AI Engine';
        elementos.versionLabel.textContent = 'Fanix 5';
        addMessage('Fanix-5 activado! Conversación + todas las capacidades de Infinix 4 😊', 'ai');
    }
}

function iniciarPruebaInfinix6() {
    state.infinix6Activo = true;
    state.infinix6Mensajes = 0;
    state.tiempoRestante = CONFIG.INFINIX6_TIME_LIMIT;
    state.versionActual = 6;
    
    elementos.trialTimer.classList.add('active');
    elementos.aiName.textContent = '🔥 Infinix-6 TRIAL';
    elementos.aiEngine.textContent = 'Infinix 6 Quantum AI - Prueba';
    elementos.versionLabel.textContent = 'Infinix 6';
    
    elementos.versionButtons.forEach((btn, idx) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
        if (idx === 2) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        }
    });
    
    addMessage(
        `🔥 INFINIX 6 QUANTUM - MODO PRUEBA\n\n` +
        `3 mensajes o 10 minutos:\n\n` +
        `🧠 IA Cuántica\n` +
        `🌌 Problemas complejos\n` +
        `🔬 Simulaciones científicas\n` +
        `💡 Machine Learning\n` +
        `⚛️ Física cuántica\n\n` +
        `¡Aprovecha! ⏱️`,
        'ai'
    );

    state.infinix6Timer = setInterval(() => {
        state.tiempoRestante--;
        const min = Math.floor(state.tiempoRestante / 60);
        const seg = state.tiempoRestante % 60;
        elementos.timeRemaining.textContent = `${min}:${seg.toString().padStart(2, '0')}`;
        
        if (state.tiempoRestante <= 0) {
            finalizarPruebaInfinix6();
        }
    }, 1000);
}

function finalizarPruebaInfinix6() {
    clearInterval(state.infinix6Timer);
    state.infinix6Activo = false;
    elementos.trialTimer.classList.remove('active');
    addMessage(`⏰ Prueba finalizada. Volviendo a Infinix 4... 🚀`, 'system');
    cambiarVersion(4);
}

// ===== Herramientas matemáticas =====
function insertarFuncion(texto) {
    const pos = elementos.userInput.selectionStart;
    const before = elementos.userInput.value.substring(0, pos);
    const after = elementos.userInput.value.substring(pos);
    
    if (texto === '(') {
        elementos.userInput.value = before + '()' + after;
        elementos.userInput.selectionStart = elementos.userInput.selectionEnd = pos + 1;
    } else {
        elementos.userInput.value = before + texto + after;
        elementos.userInput.selectionStart = elementos.userInput.selectionEnd = pos + texto.length;
    }
    elementos.userInput.focus();
}

function mostrarFraccion() {
    addMessage(`📐 Fracciones:\n\nFormato: a/b\nEjemplos: 1/2, 3/4, 5/8`, 'ai');
}

function resolverEcuacion() {
    const ecuacion = prompt("Ecuación (ej: 2x + 5 = 13):");
    if (!ecuacion) return;
    
    const match = ecuacion.match(/(\d*)x\s*([+\-])\s*(\d+)\s*=\s*(\d+)/);
    if (match) {
        const a = match[1] ? parseInt(match[1]) : 1;
        const signo = match[2];
        const b = parseInt(match[3]) * (signo === '+' ? 1 : -1);
        const c = parseInt(match[4]);
        const x = (c - b) / a;
        addMessage(`🔧 Ecuación: ${ecuacion}\nResultado: x = ${x}`, 'ai');
    } else {
        addMessage(`Formato: ax + b = c`, 'ai');
    }
}

function generarGrafica() {
    // Abrir modal de gráfica y prellenar expresión
    const funcion = prompt("Función (ej: x^2, sin(x)):");
    if (!funcion) return;
    openGraphModal(funcion);
}

/**
 * Evalúa una expresión matemática en un valor x dado usando parser seguro.
 * Soporta variables `x` y funciones básicas.
 * @param {string} expr
 * @param {number} xVal
 * @returns {number|null}
 */
function evaluarFuncion(expr, xVal){
    try{
        if (!validarEntrada(expr)) return null;
        let input = expr.replace(/π/gi,'pi').replace(/√/g,'sqrt').replace(/\s+/g,'');
        const funcs = {
            sin: Math.sin, cos: Math.cos, tan: Math.tan,
            log: (v)=>Math.log10(v), ln: Math.log, sqrt: Math.sqrt, abs: Math.abs
        };
        const tokens = [];
        for (let i=0;i<input.length;){
            const ch = input[i];
            if (/[0-9.]/.test(ch)){
                let num = ch; i++; while(i<input.length && /[0-9.]/.test(input[i])) num+=input[i++]; tokens.push({type:'num', value: parseFloat(num)}); continue;
            }
            if (/[a-zA-Z]/.test(ch)){
                let id = ch; i++; while(i<input.length && /[a-zA-Z0-9_]/.test(input[i])) id+=input[i++];
                if (id.toLowerCase() === 'x') tokens.push({type:'num', value: Number(xVal)});
                else tokens.push({type:'id', value:id});
                continue;
            }
            if ('+-*/^(),'.includes(ch)){ tokens.push({type:'op', value:ch}); i++; continue; }
            return null;
        }
        // shunting-yard (reuse logic from evaluarMatematica)
        const out = [], ops = []; const prec = {'+':1,'-':1,'*':2,'/':2,'^':3}; const rightAssoc={'^':true};
        tokens.forEach(t=>{
            if (t.type==='num') out.push(t);
            else if (t.type==='id') ops.push(t);
            else if (t.type==='op'){
                const v = t.value;
                if (v===','){ while(ops.length && ops[ops.length-1].value!=='(') out.push(ops.pop()); }
                else if (v==='('){ ops.push(t); }
                else if (v===')'){ while(ops.length && ops[ops.length-1].value!=='(') out.push(ops.pop()); if (!ops.length) throw new Error('mismatched'); ops.pop(); if (ops.length && ops[ops.length-1].type==='id') out.push(ops.pop()); }
                else { while(ops.length){ const top=ops[ops.length-1].value; if (top==='(') break; const topP=prec[top]||0, curP=prec[v]||0; if ((rightAssoc[v]?curP<topP:curP<=topP)) out.push(ops.pop()); else break; } ops.push(t); }
            }
        });
        while(ops.length){ const op=ops.pop(); if (op.value==='('||op.value===')') throw new Error('mismatched'); out.push(op); }
        const stack = [];
        out.forEach(tok=>{
            if (tok.type==='num') stack.push(tok.value);
            else if (tok.type==='id'){ const fn = funcs[tok.value.toLowerCase()]; if (!fn) throw new Error('fn unknown'); const a=stack.pop(); stack.push(fn(a)); }
            else if (tok.type==='op'){ const b=stack.pop(), a=stack.pop(); switch(tok.value){ case '+': stack.push(a+b); break; case '-': stack.push(a-b); break; case '*': stack.push(a*b); break; case '/': stack.push(a/b); break; case '^': stack.push(Math.pow(a,b)); break; default: throw new Error('op unknown'); } }
        });
        if (stack.length!==1) return null; return stack[0];
    }catch(e){ return null; }
}

/** Abre modal de gráfico, prellena expresión y dibuja la gráfica */
function openGraphModal(expr){
    const modal = document.getElementById('graphModal');
    const canvas = document.getElementById('graphCanvas');
    const input = document.getElementById('graphExpr');
    const xMinEl = document.getElementById('xMin');
    const xMaxEl = document.getElementById('xMax');
    const plotBtn = document.getElementById('plotBtn');
    const closeBtn = document.getElementById('closeGraph');
    const autoBtn = document.getElementById('autoScale');
    if (!modal || !canvas || !input) return;
    input.value = expr;
    modal.setAttribute('aria-hidden','false');
    // handlers
    function plot(){
        const f = input.value.trim();
        const xmin = parseFloat(xMinEl.value); const xmax = parseFloat(xMaxEl.value);
        drawGraph(canvas, f, xmin, xmax);
    }
    plotBtn.onclick = plot;
    autoBtn.onclick = ()=>{ autoScaleAndPlot(canvas, input.value); };
    closeBtn.onclick = ()=>{ modal.setAttribute('aria-hidden','true'); };
    // plot initial
    plot();
}

/** Auto escala el eje Y según muestras y dibuja */
function autoScaleAndPlot(canvas, expr){
    const xmin = parseFloat(document.getElementById('xMin').value);
    const xmax = parseFloat(document.getElementById('xMax').value);
    const samples = 400; const ys = [];
    for (let i=0;i<samples;i++){ const t = xmin + (xmax - xmin)*(i/(samples-1)); const v = evaluarFuncion(expr, t); if (v===null || !isFinite(v)) continue; ys.push(v); }
    if (ys.length===0) return drawGraph(canvas, expr, xmin, xmax);
    const ymin = Math.min(...ys); const ymax = Math.max(...ys);
    // set a visual scale via transform in drawGraph by passing bounds
    drawGraph(canvas, expr, xmin, xmax, ymin, ymax);
}

/** Dibuja la función en canvas; opcionalmente recibir ymin,ymax para escala */
function drawGraph(canvas, expr, xmin=-10, xmax=10, ymin=null, ymax=null){
    const ctx = canvas.getContext('2d');
    const W = canvas.width = canvas.clientWidth * devicePixelRatio;
    const H = canvas.height = canvas.clientHeight * devicePixelRatio;
    ctx.setTransform(1,0,0,1,0,0); ctx.clearRect(0,0,W,H); ctx.scale(devicePixelRatio, devicePixelRatio);
    const width = canvas.clientWidth; const height = canvas.clientHeight;
    const samples = Math.max(200, Math.floor(width));
    const xs = new Array(samples);
    const ys = new Array(samples);
    for (let i=0;i<samples;i++){ const x = xmin + (xmax - xmin)*(i/(samples-1)); xs[i]=x; const v = evaluarFuncion(expr, x); ys[i]=v; }
    const finiteYs = ys.filter(v=>isFinite(v) && v!==null);
    if (finiteYs.length===0){ ctx.fillStyle='white'; ctx.fillText('No se pudo evaluar la función en el rango', 10,20); return; }
    if (ymin===null) ymin = Math.min(...finiteYs);
    if (ymax===null) ymax = Math.max(...finiteYs);
    if (ymin === ymax){ ymin -= 1; ymax += 1; }
    // padding
    const pad = (ymax - ymin)*0.1; ymin -= pad; ymax += pad;
    // dibujar grid
    ctx.save(); ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.lineWidth=1; for (let gx=Math.ceil(xmin); gx<=Math.floor(xmax); gx++){ const sx = ((gx - xmin)/(xmax - xmin))*width; ctx.beginPath(); ctx.moveTo(sx,0); ctx.lineTo(sx,height); ctx.stroke(); }
    for (let gy=Math.ceil(ymin); gy<=Math.floor(ymax); gy++){ const sy = height - ((gy - ymin)/(ymax - ymin))*height; ctx.beginPath(); ctx.moveTo(0,sy); ctx.lineTo(width,sy); ctx.stroke(); }
    ctx.restore();
    // ejes
    ctx.strokeStyle='rgba(255,255,255,0.4)'; ctx.lineWidth=1.5;
    // y axis (x=0)
    if (xmin <= 0 && xmax >=0){ const sx = ((0 - xmin)/(xmax - xmin))*width; ctx.beginPath(); ctx.moveTo(sx,0); ctx.lineTo(sx,height); ctx.stroke(); }
    // x axis (y=0)
    if (ymin <=0 && ymax >=0){ const sy = height - ((0 - ymin)/(ymax - ymin))*height; ctx.beginPath(); ctx.moveTo(0,sy); ctx.lineTo(width,sy); ctx.stroke(); }
    // dibujar curva
    ctx.beginPath(); ctx.lineWidth=2; ctx.strokeStyle='#66ccff';
    let started=false;
    for (let i=0;i<samples;i++){
        const v = ys[i]; if (!isFinite(v) || v===null) { started=false; continue; }
        const sx = ((xs[i]-xmin)/(xmax-xmin))*width; const sy = height - ((v - ymin)/(ymax - ymin))*height;
        if (!started) { ctx.moveTo(sx,sy); started=true; } else { ctx.lineTo(sx,sy); }
    }
    ctx.stroke();
    // pintar etiqueta
    ctx.fillStyle='rgba(255,255,255,0.9)'; ctx.font='12px sans-serif'; ctx.fillText(`f(x) = ${expr}`, 10,14);
}

function limpiarChat() {
    elementos.chatContainer.innerHTML = '';
    const palabra = obtenerPalabraAleatoria();
    addMessage(`${palabra}! Chat limpio. ¿En qué puedo ayudarte?`, 'ai');
}

// ===== Iniciar aplicación cuando el DOM esté listo =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarApp);
} else {
    inicializarApp();
}