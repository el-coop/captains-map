import Vue from 'vue';
import http, { installer as HttpService } from '@/Services/HttpService';
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
	faShareAlt,
	faImages,
	faSlidersH,
	faRss
} from '@fortawesome/free-solid-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import Meta from 'vue-meta';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueIziToast from 'vue-izitoast';
import errorLogger from '@/Services/ErrorLogger';

library.add(faUpload, faTimesCircle, faFileImage, faCameraRetro, faCopy, faSignOutAlt, faGlobe, faFacebook, faSearch, faUsers, faAddressCard, faList, faMapMarked, faGlobeAsia, faUserAlt, faChevronDown, faSignInAlt, faExternalLinkSquareAlt, faSearchLocation, faShareAlt, faImages, faSlidersH, faRss);

Vue.use(Meta);
Vue.component('FontAwesomeIcon', FontAwesomeIcon);
Vue.use(HttpService);
Vue.use(VueIziToast, {
	position: 'bottomCenter',
	timeout: 2500
});
Vue.config.productionTip = false;
Vue.prototype.$bus = new Vue();


window.onerror = (message, source, lineno, colno, error) => {
	errorLogger.handle(error);
};

Vue.config.errorHandler = (error, vm) => {
	errorLogger.handle(error, vm);
};
