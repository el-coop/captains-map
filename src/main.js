import {createApp} from 'vue';
import Root from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import VueIzitoast from './Classes/VueIzitoast';
import {createMetaManager, plugin as vueMetaPlugin} from 'vue-meta'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import {installer as HttpService} from '@/Services/HttpService';
import './libraries';

const app = createApp(Root)
	.use(router)
	.use(createMetaManager())
	.use(vueMetaPlugin)
	.use(store)
	.use(VueIzitoast)
	.use(HttpService)
	.component('FontAwesomeIcon', FontAwesomeIcon);

app.mount('#app');


