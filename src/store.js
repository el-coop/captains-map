import Vue from 'vue';
import Vuex from 'vuex';
import User from '@/store/user';
import Markers from '@/store/markers';
import Profile from '@/store/profile';
import Uploads from '@/store/uploads';

Vue.use(Vuex);

const store = new Vuex.Store({
	modules: {
		User,
		Markers,
		Profile,
		Uploads
	},
	actions: {
		CSRFReady({dispatch}) {
			dispatch('Uploads/processQueue');
		}
	}
});

export default store;
