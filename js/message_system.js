/*
  MessageSystem v1.0
  - generarMensaje(usuario, contexto)
  - analizarMensaje(mensaje)
  - generarIdeas(mensaje, historial)
  - seleccionarRespuesta(ideas, options)
  - memoria temporal, logging y configuración
  - integración segura con generarRespuesta() si existe

  Diseñado para integrarse con el chat existente y con IdeasSystem cuando esté disponible.
*/

(function (global) {
  'use strict';

  const DEFAULT_CONFIG = {
    tono: 'neutral', // neutral, formal, casual, divertido, tecnico, sarcastico, educativo
    estilo: 'equilibrado', // corto, medio, largo, equilibrado
    idioma: 'es',
    maxMemory: 20,
    avoidRepeats: true,
    showInternalIdeas: false
  };

  // Internal state
  const state = {
    config: Object.assign({}, DEFAULT_CONFIG),
    memory: {
      mensajes: [], // últimos mensajes entrantes
      respuestas: [] // últimos mensajes generados
    },
    logs: [],
    ideasCache: [],
    ideasHistory: []
  };

  // Default predeterminados
  const DEFAULT_MESSAGES = {
    noTokens: 'Lo siento, parece que no tienes tokens suficientes para esta acción. ¿Quieres que intente una versión más corta?',
    error: 'Ha ocurrido un error interno. Estoy intentando recuperarme — inténtalo de nuevo en un momento.',
    loading: 'Estoy escribiendo una respuesta... un momento, por favor.',
    repeated: 'Parece que ya recibiste una respuesta similar antes; puedo reformularla si quieres.'
  };

  // Helper: simple keyword extraction
  function _extractKeywords(text) {
    if (!text) return [];
    return text
      .toLowerCase()
      .replace(/["'`\-_/\\\(\)\[\],;:\.!\?\n]/g, ' ')
      .split(/\s+/)
      .filter(w => w && w.length > 2)
      .slice(0, 40);
  }

  // Helper: determine intent naive
  function _detectIntent(text) {
    if (!text) return 'unknown';
    const t = text.trim();
    const lower = t.toLowerCase();
    if (lower.includes('error') || lower.includes('no funciona') || lower.includes('bug')) return 'error';
    if (t.endsWith('?')) return 'pregunta';
    if (/^(por favor|porfa|por favor,?)/i.test(t) || /^(por|puedes|ayuda)/i.test(lower)) return 'solicitud';
    if (/^(haz|hazme|muestr|dame|explica)/i.test(t)) return 'orden';
    if (lower.match(/jaj|jajaja|lol|haha/)) return 'humor';
    return 'afirmacion';
  }

  // Helper: detect tone/emotion naive
  function _detectTone(text) {
    if (!text) return 'neutral';
    const lower = text.toLowerCase();
    if (/[!¡]{2,}/.test(text)) return 'emocionado';
    if (lower.includes('triste') || lower.includes('deprim')) return 'triste';
    if (lower.includes('enoj') || lower.includes('molest')) return 'molesto';
    if (lower.includes('gracias') || lower.includes('genial') || lower.includes('excelente')) return 'positivo';
    if (lower.includes('¿') || text.endsWith('?')) return 'curioso';
    return 'neutral';
  }

  function _shorten(text, lengthPref) {
    if (!text) return '';
    if (lengthPref === 'corto') return text.split('.').slice(0, 1).join('.').trim();
    if (lengthPref === 'medio') return text.split('.').slice(0, 2).join('.').trim();
    if (lengthPref === 'largo') return text;
    // equilibrado
    const parts = text.split('.');
    return parts.slice(0, Math.max(1, Math.min(2, parts.length))).join('.').trim();
  }

  // Analysis function
  function analizarMensaje(texto) {
    try {
      const palabrasClave = _extractKeywords(texto);
      const intencion = _detectIntent(texto);
      const tono = _detectTone(texto);
      const ambiguedad = palabrasClave.length === 0 || intencion === 'afirmacion' && palabrasClave.length < 2;

      // maintain memory
      state.memory.mensajes.push({ texto, palabrasClave, intencion, tono, fecha: Date.now() });
      if (state.memory.mensajes.length > state.config.maxMemory) state.memory.mensajes.shift();

      return {
        textoOriginal: texto,
        palabrasClave,
        intencion,
        tono,
        contexto: null,
        posiblesTemas: palabrasClave.slice(0, 6),
        ambiguedad
      };
    } catch (err) {
      _log('analizarMensaje error', err);
      return { textoOriginal: texto, palabrasClave: [], intencion: 'unknown', tono: 'neutral', contexto: null, posiblesTemas: [], ambiguedad: true };
    }
  }

  // Attempt to use IdeasSystem if available
  function _fetchIdeasFromIdeasSystem(palabras) {
    try {
      if (typeof global.IdeasSystem !== 'undefined' && typeof global.IdeasSystem.obtenerTodasLasIdeas === 'function') {
        const all = global.IdeasSystem.obtenerTodasLasIdeas();
        const matches = [];
        palabras.forEach(p => {
          all.forEach(idea => {
            if (idea.keywords && idea.keywords.some(k => k.toLowerCase().includes(p))) {
              matches.push(Object.assign({ match: p }, idea));
            }
          });
        });
        return matches;
      }
    } catch (e) {
      _log('fetchIdeas error', e);
    }
    return [];
  }

  // generarIdeas: produce array de ideas internas (no UI) con prioridad
  function generarIdeas(mensaje, historial) {
    const analysis = typeof mensaje === 'string' ? analizarMensaje(mensaje) : (mensaje && mensaje.textoOriginal ? mensaje : analizarMensaje(''));
    const keys = analysis.palabrasClave || [];
    const ideas = [];

    // 1) Try to enrich from IdeasSystem database
    const external = _fetchIdeasFromIdeasSystem(keys);
    external.forEach((e, idx) => {
      ideas.push({
        id: 'ext_' + idx,
        tema: e.tema || 'externo',
        subtema: e.subtema || keys[0] || null,
        estilo: e.tipoRespuesta || 'educativo',
        prioridad: 0.9,
        sugerencias: e.sugerencias || [],
        ejemplo: e.ejemplo || null
      });
    });

    // 2) Generate template ideas based on intent and tone
    const baseTemplates = [];
    const intent = analysis.intencion;
    const tone = analysis.tono;

    // Formal
    baseTemplates.push({ tema: 'respuesta_formal', estilo: 'formal', prioridad: 0.6, template: (ctx) => `Estimado/a ${ctx.usuario || ''}. ${ctx.nucleo} Agradezco su consulta.` });
    // Casual
    baseTemplates.push({ tema: 'respuesta_casual', estilo: 'casual', prioridad: 0.7, template: (ctx) => `Hola ${ctx.usuario || ''}! ${ctx.nucleo} ¿Te sirve así?` });
    // Divertido
    baseTemplates.push({ tema: 'respuesta_divertida', estilo: 'divertido', prioridad: 0.5, template: (ctx) => `¡Genial! ${ctx.nucleo} 😄` });
    // Técnico
    baseTemplates.push({ tema: 'respuesta_tecnica', estilo: 'tecnico', prioridad: 0.8, template: (ctx) => `${ctx.nucleo} (Detalles técnicos: ${ctx.detalles || 'N/D'})` });

    // Build nucleus text
    const nucleo = keys.length ? `Sobre ${keys.slice(0, 3).join(', ')}:` : (analysis.ambiguedad ? 'Puedo ayudarte con varias opciones.' : 'Aquí tienes una respuesta.');

    baseTemplates.forEach((t, i) => {
      const priorityAdj = t.prioridad * (analysis.ambiguedad ? 0.8 : 1);
      ideas.push({
        id: 'tpl_' + i,
        tema: t.tema,
        subtema: keys[0] || null,
        estilo: t.estilo,
        prioridad: priorityAdj,
        sugerencias: [typeof t.template === 'function' ? t.template({ usuario: null, nucleo, detalles: keys.join(', ') }) : t.template]
      });
    });

    // 3) Predeterminadas para casos especiales
    if (analysis.intencion === 'error') {
      ideas.push({ id: 'pred_error', tema: 'pred_error', estilo: 'soporte', prioridad: 1.0, sugerencias: [DEFAULT_MESSAGES.error] });
    }
    if (analysis.ambiguedad) {
      ideas.push({ id: 'pred_amb', tema: 'pred_amb', estilo: 'educativo', prioridad: 0.7, sugerencias: ['¿Puedes darme más detalles? Puedo sugerir opciones.'] });
    }

    // store into cache and history
    state.ideasCache = ideas;
    state.ideasHistory.push({ fecha: Date.now(), analysis, ideas: ideas.map(i => i.id) });
    if (state.ideasHistory.length > 200) state.ideasHistory.shift();

    return ideas.sort((a, b) => b.prioridad - a.prioridad);
  }

  // Unique variation generator: produces text variations
  function _renderVariation(idea, options) {
    const usuario = options && options.usuario ? options.usuario : '';
    const lang = state.config.idioma || 'es';
    const lengthPref = options.length || state.config.estilo;

    let base = (idea.sugerencias && idea.sugerencias.length) ? idea.sugerencias[0] : '';
    if (typeof base === 'function') base = base({ usuario });
    // style tweaks
    switch (idea.estilo) {
      case 'formal':
        base = `Estimado/a ${usuario}. ${base}`;
        break;
      case 'casual':
        base = `${usuario ? usuario + ',' : ''} ${base} 👍`;
        break;
      case 'divertido':
        base = `${base} 😄`;
        break;
      case 'tecnico':
        base = `${base} (Detalles técnicos: ${idea.subtema || 'N/D'})`;
        break;
      default:
        base = `${base}`;
    }

    return _shorten(base, lengthPref);
  }

  // generar posibles variaciones como strings
  function generarVariaciones(ideas, opciones) {
    const vars = [];
    const seen = new Set();
    for (let i = 0; i < Math.min(6, ideas.length); i++) {
      const v = _renderVariation(ideas[i], opciones || {});
      if (state.config.avoidRepeats && state.memory.respuestas.length) {
        const last = state.memory.respuestas[state.memory.respuestas.length - 1];
        if (last && v.trim() === last.trim()) continue;
      }
      if (!seen.has(v)) {
        seen.add(v);
        vars.push({ texto: v, ideaId: ideas[i].id, estilo: ideas[i].estilo });
      }
    }
    return vars;
  }

  // seleccionarRespuesta: elegir la más adecuada
  function seleccionarRespuesta(ideas, opciones) {
    opciones = opciones || {};
    if (!ideas || ideas.length === 0) return { mensajeFinal: DEFAULT_MESSAGES.error, chosenIdea: null };

    // Score by style preference and prioridad
    const prefStyle = opciones.style || state.config.tono;
    let best = null;
    let bestScore = -Infinity;
    ideas.forEach(idea => {
      let score = idea.prioridad || 0.5;
      if (prefStyle && idea.estilo && prefStyle === idea.estilo) score += 0.2;
      // minor boost for technical when keywords include code-like tokens
      if (idea.estilo === 'tecnico' && opciones.palabrasClave && opciones.palabrasClave.some(k => /\b(code|js|python|function|var)\b/.test(k))) score += 0.15;
      if (!best || score > bestScore) {
        best = idea; bestScore = score;
      }
    });

    const variation = _renderVariation(best, opciones);
    return { mensajeFinal: variation, chosenIdea: best };
  }

  // Main API: generarMensaje
  function generarMensaje(usuario, contexto) {
    try {
      const texto = (contexto && contexto.texto) || usuario && usuario.mensaje || '';
      const analysis = analizarMensaje(texto);
      const ideas = generarIdeas(analysis, state.memory.mensajes);
      const posibles = generarVariaciones(ideas, { usuario: usuario && usuario.nombre, length: state.config.estilo, palabrasClave: analysis.palabrasClave });

      // Choose final according to config or contexto.style
      const selection = seleccionarRespuesta(ideas, { style: (contexto && contexto.style) || state.config.tono, palabrasClave: analysis.palabrasClave });

      // Avoid exact repeats
      let finalText = selection.mensajeFinal;
      if (state.config.avoidRepeats && state.memory.respuestas.length) {
        const last = state.memory.respuestas[state.memory.respuestas.length - 1];
        if (last && last.texto === finalText) {
          // try to pick alternative
          const alt = posibles.find(p => p.texto !== finalText);
          if (alt) finalText = alt.texto;
          else finalText = finalText + '\n\n' + (Math.random() > 0.5 ? 'Puedo explicarlo de otra forma si quieres.' : '¿Quieres que lo aclare?');
        }
      }

      // register response
      const record = { fecha: Date.now(), entrada: texto, final: finalText, ideas: selection.chosenIdea ? [selection.chosenIdea.id] : ideas.map(i => i.id) };
      state.memory.respuestas.push(record);
      if (state.memory.respuestas.length > state.config.maxMemory) state.memory.respuestas.shift();
      state.logs.push({ type: 'respuesta', record });

      // Persist minimal memory to localStorage (non-blocking)
      try { localStorage && localStorage.setItem('MessageSystem_memory', JSON.stringify(state.memory)); } catch (e) { /* ignore */ }

      return { mensajeFinal: finalText, posiblesVariaciones: posibles.map(p => p.texto), metadata: { analysis, chosenIdea: selection.chosenIdea } };
    } catch (err) {
      _log('generarMensaje error', err);
      return { mensajeFinal: DEFAULT_MESSAGES.error, posiblesVariaciones: [], metadata: { error: err } };
    }
  }

  // Logging helper
  function _log(tag, data) {
    try {
      const entry = { fecha: Date.now(), tag, data };
      state.logs.push(entry);
      // keep logs bounded
      if (state.logs.length > 1000) state.logs.shift();
      if (typeof console !== 'undefined' && state.config.debug) console.log('[MessageSystem]', tag, data);
    } catch (e) { /* noop */ }
  }

  // Public utilities
  function setConfig(cfg) { Object.assign(state.config, cfg); }
  function getConfig() { return Object.assign({}, state.config); }
  function obtenerMemoria() { return JSON.parse(JSON.stringify(state.memory)); }
  function obtenerLogs() { return JSON.parse(JSON.stringify(state.logs)); }
  function resetMemoria() { state.memory = { mensajes: [], respuestas: [] }; }

  // Integration: patch existing generarRespuesta if present
  function _attemptPatchGlobal() {
    try {
      if (typeof global.generarRespuesta === 'function') {
        const original = global.generarRespuesta;
        global.generarRespuesta = function wrappedGenerarRespuesta(mensaje) {
          // call original to get baseline
          let out;
          try { out = original.apply(this, arguments); } catch (e) { _log('originalGenerarRespuesta_error', e); }
          // If original returned a string or object, we can try to enrich
          try {
            const usuario = (typeof mensaje === 'string') ? { mensaje } : (mensaje || {});
            const result = generarMensaje({ nombre: usuario.nombre || '' , mensaje: usuario.mensaje || mensaje }, { style: state.config.tono });
            // prefer original if it looks good, else use our final
            const final = (out && out.mensajeFinal) ? out.mensajeFinal : (typeof out === 'string' ? out : null);
            const chosen = final && final.length > 20 ? final : result.mensajeFinal;
            // Optionally log
            _log('patched_generarRespuesta', { original: final, patched: chosen });
            // Return in same shape as original where possible
            if (out && typeof out === 'object') { out.mensajeFinal = chosen; return out; }
            return chosen;
          } catch (err) {
            _log('wrap error', err);
            return out || DEFAULT_MESSAGES.error;
          }
        };
        _log('patch', 'generarRespuesta patched');
      }
    } catch (e) { _log('attemptPatchGlobal', e); }
  }

  // Virtual environment skeleton (simplified)
  const VirtualWorld = (function () {
    function World(width = 8, height = 6) {
      this.width = width; this.height = height;
      this.entities = []; this.tick = 0;
    }
    World.prototype.addEntity = function (entity) { this.entities.push(entity); };
    World.prototype.step = function () { this.tick++; this.entities.forEach(e => e.tick && e.tick()); };

    function Agent(name) {
      this.name = name; this.energy = 100; this.money = 0; this.inventory = {};
      this.behavior = { epsilon: 0.2 };
    }
    Agent.prototype.act = function () { /* decide action placeholder */ };
    Agent.prototype.applyReward = function (r) { this.energy = Math.max(0, this.energy + (r || 0)); };

    return { World, Agent };
  })();

  // Expose public API
  const MessageSystem = {
    analizarMensaje,
    generarIdeas,
    seleccionarRespuesta,
    generarMensaje,
    setConfig,
    getConfig,
    obtenerMemoria,
    obtenerLogs,
    resetMemoria,
    DEFAULT_MESSAGES,
    _internal: state,
    VirtualWorld
  };

  // auto-patch after a tick
  setTimeout(_attemptPatchGlobal, 200);

  // attach to global
  global.MessageSystem = MessageSystem;

})(typeof window !== 'undefined' ? window : global);
