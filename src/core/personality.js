(function(global){
    /**
     * Personality Manager
     * - Maneja personalidades configurables
     * - Gestiona apodos de usuario y memoria (localStorage)
     */
    const KEY = 'infinix_persona_v1';

    const DEFAULT = {
        personalidadActual: 'neutral',
        apodoUsuario: null,
        usaApodo: false,
        idiomaPreferido: null,
        memoriaPersistente: {}
    };

    const PERSONALITIES = {
        neutral: { tone: 'neutral', informalidad: 0.3, emojis: false, length: 'medium' },
        amigable: { tone: 'friendly', informalidad: 0.7, emojis: true, length: 'medium' },
        seria: { tone: 'serious', informalidad: 0.1, emojis: false, length: 'short' },
        caotica: { tone: 'chaotic', informalidad: 0.9, emojis: true, length: 'long' },
        brainrot: { tone: 'brainrot', informalidad: 0.95, emojis: true, length: 'long' },
        tecnica: { tone: 'technical', informalidad: 0.2, emojis: false, length: 'detailed' }
    };

    const Personality = {
        state: Object.assign({}, DEFAULT),

        init(){
            try {
                const raw = localStorage.getItem(KEY);
                if (raw) {
                    this.state = Object.assign({}, DEFAULT, JSON.parse(raw));
                }
            } catch(e){ this.state = Object.assign({}, DEFAULT); }
        },

        save(){
            try { localStorage.setItem(KEY, JSON.stringify(this.state)); } catch(e){}
        },

        setPersonality(name){
            if (!PERSONALITIES[name]) return false;
            this.state.personalidadActual = name;
            this.save();
            Logger?.info('Personality changed', {to: name});
            return true;
        },

        getPersonality(){
            return PERSONALITIES[this.state.personalidadActual] || PERSONALITIES['neutral'];
        },

        listPersonalities(){ return Object.keys(PERSONALITIES); },

        setNickname(nick){
            if (!nick) return false;
            this.state.apodoUsuario = nick;
            this.state.usaApodo = true;
            this.save();
            Logger?.info('Nickname set', {nick});
            return true;
        },

        getNickname(){ return this.state.usaApodo ? this.state.apodoUsuario : null; },

        forgetNickname(){ this.state.apodoUsuario = null; this.state.usaApodo = false; this.save(); Logger?.info('Nickname forgotten'); },

        setIdiomaPreferido(lang){ this.state.idiomaPreferido = lang; this.save(); },

        getMemory(){
            // Exponer copia segura
            return Object.assign({}, this.state);
        },

        editMemory(updates){
            Object.assign(this.state.memoriaPersistente, updates);
            this.save();
        },

        clearMemory(){ this.state = Object.assign({}, DEFAULT); this.save(); }
    };

    try { Personality.init(); } catch(e){}
    global.Personality = Personality;
    global.Personality.PERSONALITIES = PERSONALITIES;
})(window);
