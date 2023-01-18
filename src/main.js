import {createApp} from 'vue';
import Root from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import VueIzitoast from './Classes/VueIzitoast';
import {createMetaManager, plugin as vueMetaPlugin} from 'vue-meta'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {installer as HttpService} from './Services/HttpService';
import {vueErrorLogger, jsErrorLoggr} from "@/libraries";

if (import.meta.env.PROD) {
	window.onerror = jsErrorLoggr;
}

const app = createApp(Root)
	.use(router)
	.use(createMetaManager())
	.use(vueMetaPlugin)
	.use(store)
	.use(VueIzitoast)
	.use(HttpService)
	.component('FontAwesomeIcon', FontAwesomeIcon);

if (import.meta.env.PROD) {
	app.config.errorHandler = vueErrorLogger;
}

app.mount('#app');


