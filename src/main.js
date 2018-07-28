import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import VModal from 'vue-js-modal'
import { installer as HttpService } from './services/http.service';
import vueMoment from 'vue-moment';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUpload, faTimesCircle, faFileImage, faCameraRetro } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faUpload, faTimesCircle, faFileImage, faCameraRetro);

Vue.use(VModal);
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(HttpService);
Vue.use(vueMoment);
Vue.config.productionTip = false;
let bus = new Vue();
Vue.prototype.$bus = bus;


new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');
