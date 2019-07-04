import Vue from 'vue';
import VModal from 'vue-js-modal';
import { installer as HttpService } from '@/Services/HttpService';
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
	faChevronDown,
	faSignInAlt,
	faExternalLinkSquareAlt,
	faSearchLocation,
	faShareAlt
} from '@fortawesome/free-solid-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import Meta from 'vue-meta';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueIziToast from 'vue-izitoast';

library.add(faUpload, faTimesCircle, faFileImage, faCameraRetro, faCopy, faSignOutAlt, faGlobe, faFacebook, faSearch, faUsers, faAddressCard, faList, faMapMarked, faGlobeAsia, faUserAlt, faChevronDown, faSignInAlt, faExternalLinkSquareAlt, faSearchLocation, faShareAlt);

Vue.use(VModal, {componentName: "VModal"});
Vue.use(Meta);
Vue.component('FontAwesomeIcon', FontAwesomeIcon);
Vue.use(HttpService);
Vue.use(VueIziToast, {
	position: 'bottomCenter',
	timeout: 2500
});
Vue.config.productionTip = false;
Vue.prototype.$bus = new Vue();
