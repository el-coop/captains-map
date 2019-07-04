<template>
	<div class="layout">
		<TheDashboard/>
		<CreateMarker :latLng="latLng" :marker="editedMarker"/>
	</div>
</template>

<script>
	import TheDashboard from '@/Components/Dashboard/TheDashboard';
	import auth from '@/Services/AuthenticationService';
	import map from '@/Services/LeafletMapService';
	import LoadsMarkersMixin from "@/Views/LoadsMarkersMixin";
	import CreateMarker from "@/Components/Modals/CreateMarker";

	export default {
		name: "EditPage",
		metaInfo: {
			title: 'Edit'
		},

		mixins: [LoadsMarkersMixin],

		components: {
			TheDashboard, CreateMarker
		},

		created() {
			this.$bus.$on('map-create-marker', this.createMarker);
			this.$bus.$on('user-marker-click', this.createMarker);
		},
		beforeDestroy() {
			this.$bus.$off('map-create-marker', this.createMarker);
			this.$bus.$off('user-marker-click', this.createMarker);
		},

		data() {
			return {
				latLng: {},
				editedMarker: null
			}
		},

		methods: {

			envSetup() {
				this.$store.commit('Markers/setUser', auth.getUserDetails().username);
				this.$store.dispatch('Profile/load', auth.getUserDetails().username);
			},

			async markersLoaded() {
				map.goToCurrentLocation();
			},

			createMarker(data) {
				if (data.lat && data.lng) {
					this.latLng = data;
				} else {
					this.latLng = data.event.latlng;
				}
				this.editedMarker = data.marker || null;
				this.$modal.show('create-marker');
			},
		},

	}
</script>
