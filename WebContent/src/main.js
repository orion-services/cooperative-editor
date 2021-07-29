import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import api from './api.js';

Vue.config.productionTip = false

new Vue({
    router,
    vuetify,
    render: h => h(App),
    data: {
        loginChecked: false,
        isLoggedIn: false,
    },
    created() {
        //Start the app by performing an API request to check if the user is
        //logged in

        api.doPost('/CooperativeEditor/login-api', { checkLogin: true }, (ok, status, data, error) => {
            if (ok) {
                this.loginChecked = true;
                this.isLoggedIn = data.isLoggedIn;

                //If the user is not logged in, redirect to /login
                if (!this.isLoggedIn) {
                    router.push('/login');
                } else {
                    router.push('/');
                }
            } else {
                //TODO: improve error handling
                alert('Erro: ' + (error ? error : status));
	    }
        });
    }
}).$mount('#app')

