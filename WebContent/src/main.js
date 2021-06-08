import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App),
  data: {
    loginChecked: false,
    isLoggedIn: false,
  },
  created: function() {
    //Start the app by performing an AJAX request to check if the user is
    //logged in

    let options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify({
        checkLogin: true
      })
    };

    fetch('/CooperativeEditor/login', options).then(async res => {
      let response = await res.json();

      this.loginChecked = true;
      this.isLoggedIn = response.isLoggedIn;

      //If the user is not logged in, redirect to /login
      if (!this.isLoggedIn) {
        router.push('/login');
      }
    });
  }
}).$mount('#app')

