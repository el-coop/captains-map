<template>
	<div class="layout">
		<TheDashboard/>
		<CreateMarker/>
	</div>
</template>

<script>
	import TheDashboard from '@/Components/Dashboard/TheDashboard';
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
				const username = this.$store.state.User.user.username;
				this.$store.commit('Markers/setUser', username);
				this.$store.dispatch('Profile/load', username);
			},

			async markersLoaded() {
				map.goToCurrentLocation();
			},
		},

	}
</script>
