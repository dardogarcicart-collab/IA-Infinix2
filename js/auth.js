/**
 * AUTH.JS - Sistema de Autenticación Simple
 */

(function(global){
    const Auth = {
        usuarios: {
            demo: { password: 'demo', nivel: 3, activo: true },
            admin: { password: 'admin123', nivel: 6, activo: true }
        },
        
        usuarioActual: null,
        autenticado: false,
        nivelAcceso: 0,

        // Intentar login
        login(usuario, password) {
            if (this.usuarios[usuario] && this.usuarios[usuario].password === password) {
                this.usuarioActual = usuario;
                this.autenticado = true;
                this.nivelAcceso = this.usuarios[usuario].nivel;
                Logger?.info(`Login exitoso: ${usuario}`, { nivel: this.nivelAcceso });
                return true;
            }
            Logger?.warn(`Login fallido: ${usuario}`);
            return false;
        },

        // Logout
        logout() {
            this.usuarioActual = null;
            this.autenticado = false;
            this.nivelAcceso = 0;
            Logger?.info('Logout realizado');
        },

        // Verificar autenticación
        isAuthenticated() {
            return this.autenticado;
        },

        // Obtener usuario actual
        getUser() {
            return this.usuarioActual;
        },

        // Obtener nivel
        getNivel() {
            return this.nivelAcceso;
        },

        // Requerir login (mostrar modal)
        requireLogin() {
            const modal = document.getElementById('loginModal');
            if (modal) {
                modal.setAttribute('aria-hidden', 'false');
            }
        }
    };

    global.Auth = Auth;
})(window);
