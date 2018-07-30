import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import VModal from 'vue-js-modal'
import { installer as HttpService } from './services/http.service';
import VueMoment from 'vue-moment';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUpload, faTimesCircle, faFileImage, faCameraRetro, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueClipboard from 'vue-clipboard2';
import Snotify from 'vue-snotify';

library.add(faUpload, faTimesCircle, faFileImage, faCameraRetro, faCopy);

Vue.use(VModal);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(HttpService);
Vue.use(VueMoment);
Vue.use(VueClipboard);
Vue.use(Snotify);
Vue.config.productionTip = false;
let bus = new Vue();
Vue.prototype.$bus = bus;


new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');
