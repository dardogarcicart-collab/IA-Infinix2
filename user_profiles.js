/**
 * USER_PROFILES.JS - Sistema de perfiles y preferencias de usuario
 * Gestiona múltiples perfiles con sus propias configuraciones
 */
(function(global){
    const UserProfiles = {
        profiles: {},
        currentProfile: null,
        
        // Crear nuevo perfil
        createProfile(name, settings = {}){
            if (this.profiles[name]){
                Logger?.warn(`Profile ${name} already exists`);
                return false;
            }
            
            this.profiles[name] = {
                name,
                created: new Date().toISOString(),
                theme: settings.theme || 'dark',
                responseStyle: settings.responseStyle || 'normal',
                personality: settings.personality || 'neutral',
                language: settings.language || 'es',
                preferredTopics: settings.preferredTopics || [],
                responseLength: settings.responseLength || 'medium',
                aiAggression: settings.aiAggression || 0.5,
                learningMode: settings.learningMode || false,
                notifications: settings.notifications !== false,
                customRules: settings.customRules || [],
                stats: {
                    messagesCount: 0,
                    calculationsCount: 0,
                    codeGenCount: 0,
                    lastActive: new Date().toISOString()
                }
            };
            
            Logger?.info(`Profile created: ${name}`, this.profiles[name]);
            return true;
        },
        
        // Seleccionar perfil
        selectProfile(name){
            if (!this.profiles[name]){
                Logger?.error(`Profile not found: ${name}`);
                return false;
            }
            this.currentProfile = name;
            Logger?.info(`Profile selected: ${name}`);
            this.applyProfile();
            return true;
        },
        
        // Aplicar configuración del perfil
        applyProfile(){
            if (!this.currentProfile) return;
            const profile = this.profiles[this.currentProfile];
            
            // Aplicar tema
            document.documentElement.setAttribute('data-theme', profile.theme);
            
            // Aplicar estado global
            if (state){
                state.personality = profile.personality;
                state.responseLength = profile.responseLength;
                state.mood = profile.responseStyle === 'chaotic' ? 'excited' : 'calm';
            }
            
            Logger?.info(`Profile applied: ${this.currentProfile}`);
        },
        
        // Obtener perfil actual
        getCurrentProfile(){
            return this.profiles[this.currentProfile];
        },
        
        // Actualizar estadísticas
        updateStats(statName, increment = 1){
            if (!this.currentProfile) return;
            const profile = this.profiles[this.currentProfile];
            if (profile.stats[statName] !== undefined){
                profile.stats[statName] += increment;
            }
            profile.stats.lastActive = new Date().toISOString();
            this.saveProfile();
        },
        
        // Guardar perfil en localStorage
        saveProfile(){
            if (!this.currentProfile) return;
            const key = `infinix_profile_${this.currentProfile}`;
            localStorage.setItem(key, JSON.stringify(this.profiles[this.currentProfile]));
        },
        
        // Cargar perfil de localStorage
        loadProfile(name){
            const key = `infinix_profile_${name}`;
            const data = localStorage.getItem(key);
            if (data){
                try {
                    this.profiles[name] = JSON.parse(data);
                    Logger?.info(`Profile loaded: ${name}`);
                    return true;
                } catch (e){
                    Logger?.error(`Failed to load profile ${name}: ${e.message}`);
                }
            }
            return false;
        },
        
        // Listar perfiles
        listProfiles(){
            return Object.keys(this.profiles);
        },
        
        // Eliminar perfil
        deleteProfile(name){
            if (this.currentProfile === name){
                Logger?.warn(`Cannot delete active profile: ${name}`);
                return false;
            }
            delete this.profiles[name];
            localStorage.removeItem(`infinix_profile_${name}`);
            Logger?.info(`Profile deleted: ${name}`);
            return true;
        }
    };
    
    // Crear perfil por defecto
    UserProfiles.createProfile('Default', {
        theme: 'dark',
        personality: 'neutral',
        responseLength: 'medium'
    });
    UserProfiles.selectProfile('Default');
    
    global.UserProfiles = UserProfiles;
})(window);
