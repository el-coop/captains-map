import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import VModal from 'vue-js-modal'
import HttpService from './services/http.service';
import vueMoment from 'vue-moment';

Vue.use(VModal);
Vue.use(HttpService);
Vue.use(vueMoment);
Vue.config.productionTip = false;
Vue.prototype.$bus = new Vue();

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
