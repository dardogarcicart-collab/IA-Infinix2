(function(global){
    /**
     * Auth module - simple client-side authentication for demo
     * Stores session in localStorage under `infinix_session_user`
     * Roles/levels: 'free' -> Infinix 3, 'pro' -> access to advanced (not used yet)
     */
    const KEY = 'infinix_session_user_v1';

    const defaultUsers = {
        demo: { username: 'demo', password: 'demo', level: 'free', permisoAvanzado: false }
    };

    const Auth = {
        user: null,

        init(){
            try {
                const raw = localStorage.getItem(KEY);
                if (raw){ this.user = JSON.parse(raw); }
            } catch(e){ this.user = null; }
        },

        login(username, password){
            // simple check against built-in users for demo purposes
            const u = defaultUsers[username];
            if (u && u.password === password){
                this.user = Object.assign({}, u);
                this.user.lastLogin = new Date().toISOString();
                localStorage.setItem(KEY, JSON.stringify(this.user));
                Logger?.info('User logged in', {user: username});
                return true;
            }
            // allow any username with password 'demo' as quick access
            if (password === 'demo'){
                this.user = { username, level: 'free', permisoAvanzado: false, lastLogin: new Date().toISOString() };
                localStorage.setItem(KEY, JSON.stringify(this.user));
                Logger?.info('User logged in (generic)', {user: username});
                return true;
            }
            return false;
        },

        logout(){
            localStorage.removeItem(KEY);
            Logger?.info('User logged out', {user: this.user?.username});
            this.user = null;
        },

        isAuthenticated(){
            return !!this.user;
        },

        getUser(){
            return this.user;
        },

        requireLogin(){
            // show modal if exists
            const modal = document.getElementById('loginModal');
            if (modal) modal.setAttribute('aria-hidden','false');
        }
    };

    // Initialize on load
    try { Auth.init(); } catch(e){}

    global.Auth = Auth;
})(window);
