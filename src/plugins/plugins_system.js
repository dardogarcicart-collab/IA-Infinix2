// Copiado desde root/plugins_system.js
(function(global){
    const PluginSystem = {
        plugins: {},
        activePlugins: {},
        hooks: {},
        register(name, plugin){
            if (this.plugins[name]){ Logger?.warn(`Plugin ${name} already registered`); return false; }
            this.plugins[name] = plugin; Logger?.info(`Plugin registered: ${name}`, {version: plugin.version}); return true;
        },
        activate(name){
            const plugin = this.plugins[name]; if (!plugin){ Logger?.error(`Plugin not found: ${name}`); return false; }
            if (this.activePlugins[name]){ Logger?.warn(`Plugin already active: ${name}`); return true; }
            try { if (plugin.init && typeof plugin.init === 'function'){ plugin.init(); } this.activePlugins[name] = plugin; Logger?.info(`Plugin activated: ${name}`); return true; } catch (e){ Logger?.error(`Failed to activate ${name}: ${e.message}`); return false; }
        },
        deactivate(name){ if (!this.activePlugins[name]){ Logger?.warn(`Plugin not active: ${name}`); return false; } try { const plugin = this.activePlugins[name]; if (plugin.cleanup && typeof plugin.cleanup === 'function'){ plugin.cleanup(); } delete this.activePlugins[name]; Logger?.info(`Plugin deactivated: ${name}`); return true; } catch (e){ Logger?.error(`Failed to deactivate ${name}: ${e.message}`); return false; } },
        registerHook(hookName, callback){ if (!this.hooks[hookName]) this.hooks[hookName] = []; this.hooks[hookName].push(callback); },
        async executeHook(hookName, data){ if (!this.hooks[hookName]) return data; for (const hook of this.hooks[hookName]){ try { data = await Promise.resolve(hook(data)); } catch (e){ Logger?.error(`Hook error in ${hookName}: ${e.message}`); } } return data; },
        status(){ return { registered: Object.keys(this.plugins), active: Object.keys(this.activePlugins) }; }
    };
    const CorePlugins = {
        math: { version: '1.0.0', init: function(){ Logger?.info('Math plugin loaded'); }, cleanup: function(){ Logger?.info('Math plugin unloaded'); } },
        code: { version: '1.0.0', init: function(){ Logger?.info('Code plugin loaded'); }, cleanup: function(){ Logger?.info('Code plugin unloaded'); } },
        chat: { version: '1.0.0', init: function(){ Logger?.info('Chat plugin loaded'); }, cleanup: function(){ Logger?.info('Chat plugin unloaded'); } },
        graphics: { version: '1.0.0', init: function(){ Logger?.info('Graphics plugin loaded'); }, cleanup: function(){ Logger?.info('Graphics plugin unloaded'); } }
    };
    for (const [name, plugin] of Object.entries(CorePlugins)){ PluginSystem.register(name, plugin); }
    global.PluginSystem = PluginSystem;
})(window);
