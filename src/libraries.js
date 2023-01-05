import {library} from '@fortawesome/fontawesome-svg-core';
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
	faRss,
	faEdit,
	faUndo
} from '@fortawesome/free-solid-svg-icons';
import {faFacebook} from '@fortawesome/free-brands-svg-icons';
import errorLogger from '@/Services/ErrorLogger';

library.add(faUndo, faUpload, faTimesCircle, faFileImage, faCameraRetro, faCopy, faSignOutAlt, faGlobe, faFacebook, faSearch, faUsers, faAddressCard, faList, faMapMarked, faGlobeAsia, faUserAlt, faChevronDown, faSignInAlt, faExternalLinkSquareAlt, faSearchLocation, faShareAlt, faImages, faSlidersH, faRss, faEdit);

if (import.meta.env.NODE_ENV === 'production') {
	// window.onerror = (message, source, lineno, colno, error) => {
	// 	errorLogger.handle(error);
	// };
	//
	// Vue.config.errorHandler = (error, vm) => {
	// 	errorLogger.handle(error, vm);
	// };
}