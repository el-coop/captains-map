import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import VModal from 'vue-js-modal';
import { installer as HttpService } from './services/http.service';
import VueMoment from 'vue-moment';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUpload, faTimesCircle, faFileImage, faCameraRetro, faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueClipboard from 'vue-clipboard2';
import VueIziToast from 'vue-izitoast';
import MapView from './components/map/Map';
import Router from 'vue-router';


library.add(faUpload, faTimesCircle, faFileImage, faCameraRetro, faCopy);

Vue.use(VModal);
Vue.use(Router);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('map-view', MapView);
Vue.use(HttpService);
Vue.use(VueMoment);
Vue.use(VueClipboard);
Vue.use(VueIziToast);
Vue.config.productionTip = false;
let bus = new Vue();
Vue.prototype.$bus = bus;


new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');
