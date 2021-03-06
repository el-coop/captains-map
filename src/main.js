import Vue from 'vue';
import App from './App.vue';
import Router from "vue-router";
import router from './router';
import store from './store';
import './registerServiceWorker';
import './libraries';

Vue.use(Router);

new Vue({
	router,
	store,
	beforeCreate() {
		this.$store.dispatch('Uploads/init');
		this.$store.dispatch('initSettings');
	},
	render: h => h(App)
}).$mount('#app');

