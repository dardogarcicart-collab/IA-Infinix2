// Copiado desde root/debug_panel.js
(function(global){
    const DebugPanel = {
        visible: false,
        metrics: {},
        updateFrequency: 1000,
        updateInterval: null,
        init(){ this.createUI(); this.startMonitoring(); Logger?.info('Debug Panel initialized'); },
        createUI(){ const html = `
            <div id="debug-panel" style="display:none; position:fixed; bottom:20px; right:20px; background:#1a1a1a; border:2px solid #00ff00; border-radius:8px; font-family:monospace; font-size:11px; color:#00ff00; max-width:400px; max-height:500px; overflow:auto; padding:10px; z-index:10000; box-shadow: 0 0 20px rgba(0,255,0,0.3);">
                <div style="margin-bottom:10px; border-bottom:1px solid #00ff00; padding-bottom:5px;">
                    <strong>🔧 DEBUG PANEL</strong>
                    <button id="debug-close" style="float:right; background:transparent; border:none; color:#00ff00; cursor:pointer; font-weight:bold;">✕</button>
                </div>
                <div id="debug-content"></div>
            </div>`;
            document.body.insertAdjacentHTML('beforeend', html);
            document.getElementById('debug-close').addEventListener('click', () => { this.toggle(); });
        },
        startMonitoring(){ this.updateInterval = setInterval(() => { this.updateMetrics(); this.render(); }, this.updateFrequency); },
        updateMetrics(){ if (typeof state === 'undefined') return; this.metrics = { messages: state.contadorMensajes, calculations: state.contadorCalculos, mood: state.mood, personality: state.personality, energy: state.energiaIA?.toFixed(2), memory: state.shortTermMemory?.length || 0, timestamp: new Date().toLocaleTimeString(), plugins: PluginSystem?.status?.(), profile: UserProfiles?.currentProfile, experience: LearningSystem?.experience || 0 }; },
        render(){ if (!this.visible) return; const content = document.getElementById('debug-content'); if (!content) return; let html = `
            <div>
                <div style="margin:5px 0; color:#ffff00;">STATE:</div>
                <div style="margin-left:10px; font-size:10px;">
                    Messages: ${this.metrics.messages}<br>
                    Calculations: ${this.metrics.calculations}<br>
                    Mood: ${this.metrics.mood}<br>
                    Personality: ${this.metrics.personality}<br>
                    Energy: ${this.metrics.energy}<br>
                    Memory: ${this.metrics.memory} items
                </div>
                <div style="margin:10px 0; color:#ffff00;">SYSTEM:</div>
                <div style="margin-left:10px; font-size:10px;">
                    Time: ${this.metrics.timestamp}<br>
                    Profile: ${this.metrics.profile}<br>
                    Experience: ${this.metrics.experience}
                </div>
            `;
            if (this.metrics.plugins){ html += `
                <div style="margin:10px 0; color:#ffff00;">PLUGINS:</div>
                <div style="margin-left:10px; font-size:10px;">
                    Active: ${this.metrics.plugins.active?.join(', ') || 'None'}<br>
                    Available: ${this.metrics.plugins.registered?.length || 0}
                </div>
                `; }
            html += `
                <div style="margin-top:10px; padding-top:10px; border-top:1px solid #00ff00;">
                    <button id="debug-clear-log" style="background:#00ff00; color:#000; border:none; padding:3px 6px; cursor:pointer; font-size:10px; margin:3px;">Clear Log</button>
                    <button id="debug-export" style="background:#00ff00; color:#000; border:none; padding:3px 6px; cursor:pointer; font-size:10px; margin:3px;">Export</button>
                </div>
            `;
            content.innerHTML = html;
            document.getElementById('debug-clear-log')?.addEventListener('click', () => { Logger?.clear(); });
            document.getElementById('debug-export')?.addEventListener('click', () => { const data = Logger?.export?.(); if (data){ console.log('Exported logs:', data); } });
        },
        toggle(){ this.visible = !this.visible; const panel = document.getElementById('debug-panel'); if (panel){ panel.style.display = this.visible ? 'block' : 'none'; if (this.visible) this.updateMetrics(); } },
        commands: { state: () => console.log('Global state:', state), logs: () => console.log('Recent logs:', Logger?.getRecent?.(10)), plugins: () => console.log('Plugin status:', PluginSystem?.status?.()), profile: () => console.log('Current profile:', UserProfiles?.getCurrentProfile?.()), clear: () => Logger?.clear?.() }
    };
    global.DebugPanel = DebugPanel;
    if (document.readyState === 'loading'){ document.addEventListener('DOMContentLoaded', () => DebugPanel.init()); } else { DebugPanel.init(); }
})(window);
