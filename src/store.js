import Vue from 'vue';
import Vuex from 'vuex';
import User from '@/store/user';
import Markers from '@/store/markers';
import Profile from '@/store/profile';
import Uploads from '@/store/uploads';

Vue.use(Vuex);

export const actions = {
	CSRFReady({dispatch, state}) {
		if (!state.hasCsrf) {
			state.hasCsrf = true;
			dispatch('Uploads/processQueue');
		}
	}
}

const store = new Vuex.Store({
	modules: {
		User,
		Markers,
		Profile,
		Uploads
	},
	state: {
		hasCsrf: false
	},
	actions
});

export default store;
