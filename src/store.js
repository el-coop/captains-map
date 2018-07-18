import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		markers: [],
	},
	mutations: {
		addMarker(state, marker) {
			state.markers.push(marker);
		},

		deleteMarker(state, marker) {
			state.markers = state.markers.filter((obj) => {
				return obj.id !== marker.id;
			});
		},

		replaceMarkers(state, markers) {
			state.markers = markers;
		}
	},
	actions: {}
})
