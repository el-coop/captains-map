import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import VModal from 'vue-js-modal'
import HttpService from './services/http.service';

Vue.use(VModal);
Vue.use(HttpService);
Vue.config.productionTip = false;
Vue.prototype.$bus = new Vue();

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
