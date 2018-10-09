import Vue from 'vue';
import VModal from 'vue-js-modal';
import { installer as HttpService } from '@/services/http.service';
import VueMoment from 'vue-moment';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
	faUpload,
	faTimesCircle,
	faFileImage,
	faCameraRetro,
	faCopy,
	faPowerOff,
	faGlobe
} from '@fortawesome/free-solid-svg-icons';
import Meta from 'vue-meta';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueClipboard from 'vue-clipboard2';
import VueIziToast from 'vue-izitoast';

library.add(faUpload, faTimesCircle, faFileImage, faCameraRetro, faCopy, faPowerOff, faGlobe);

Vue.use(VModal);
Vue.use(Meta);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(HttpService);
Vue.use(VueMoment);
Vue.use(VueClipboard);
Vue.use(VueIziToast, {
	position: 'bottomCenter'
});
Vue.config.productionTip = false;
Vue.prototype.$bus = new Vue();
