import Vue from 'vue';
import VModal from 'vue-js-modal';
import { installer as HttpService } from '@/Services/http.service';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
	faUpload,
	faTimesCircle,
	faFileImage,
	faCameraRetro,
	faCopy,
	faGlobe,
	faSearch,
	faUsers,
	faAddressCard,
	faList,
	faMapMarked,
	faGlobeAsia,
	faSignOutAlt,
	faUserAlt,
	faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import Meta from 'vue-meta';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueClipboard from 'vue-clipboard2';
import VueIziToast from 'vue-izitoast';

library.add(faUpload, faTimesCircle, faFileImage, faCameraRetro, faCopy, faSignOutAlt, faGlobe, faFacebook, faSearch, faUsers, faAddressCard, faList, faMapMarked, faGlobeAsia, faUserAlt, faChevronDown);

Vue.use(VModal);
Vue.use(Meta);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(HttpService);
Vue.use(VueClipboard);
Vue.use(VueIziToast, {
	position: 'bottomCenter',
	timeout: 2500
});
Vue.config.productionTip = false;
Vue.prototype.$bus = new Vue();
