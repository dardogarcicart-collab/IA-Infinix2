/**
 * Infinix AI - Orquestador principal (moved to src/core)
 * Nota: Usa `CONFIG` global definido en src/core/config.js
 */

/**
 * Infinix AI - Orquestador principal (moved to src/core)
 * Nota: Usa `CONFIG` global definido en src/core/config.js
 */

// ===== diccionario y conocimiento matemático =====
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

/* ... (rest of original script.js content continues unchanged) ... */

// Para mantener el tamaño del patch legible, el resto del contenido original de script.js
// se mantiene sin cambios en el archivo raíz `script.js`. El proceso de refactorización
// puede completarse más tarde si prefieres que todo el código se consolide en `src/core/script.js`.

