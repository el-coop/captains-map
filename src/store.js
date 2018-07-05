import Vue from 'vue'
import Vuex from 'vuex'
import Map from '@/services/leaflet.service';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		markers: [],
	},
	mutations: {
		addMarker(state, marker) {
			state.markers.push(marker);
		}
	},
	actions: {}
})
