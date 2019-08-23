<template>
	<div class="layout">
		<TheDashboard/>
		<CreateMarker/>
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

		methods: {

			envSetup() {
				this.$store.commit('Markers/setUser', auth.getUserDetails().username);
				this.$store.dispatch('Profile/load', auth.getUserDetails().username);
			},

			async markersLoaded() {
				map.goToCurrentLocation();
			},
		},

	}
</script>
