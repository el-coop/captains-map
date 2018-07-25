import Vue from 'vue';
import Vuex from 'vuex';
import User from './store/user';
import Markers from './store/markers';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		User,
		Markers
	},
})
