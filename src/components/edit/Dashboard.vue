<template>
    <div class="dashboard">
        <search-bar class="dashboard__header"/>
        <div class="dashboard__body">
            <profile/>
            <div class="dashboard__control  dashboard__body-sidebar" :class="{open: openSidebar}">
                <marker-list/>
            </div>
        </div>
        <div class="dashboard__control is-hidden-tablet">
            <button class="button is-fullwidth is-dark is-medium" @click="openSidebar = !openSidebar">
                Show {{ openSidebar ? 'Map' : 'List'}}
            </button>
        </div>
        <modal name="create-marker" :adaptive="true" :height="'auto'">
            <create-marker :latLng="latLng" @close-modal="$modal.hide('create-marker')"/>
        </modal>
        <modal name="edit-marker" :adaptive="true" :height="'auto'">
            <edit-marker :marker="selectedMarker"></edit-marker>
        </modal>
    </div>
</template>

<script>
	import Profile from '@/components/edit/Profile';
	import SearchBar from '@/components/edit/SearchBar';
	import CreateMarker from '@/components/edit/CreateMarker';
	import MarkerList from "@/components/global/MarkerList";
	import EditMarker from "@/components/edit/EditMarker";
	import auth from "@/services/authentication.service";
	import map from "@/services/leaflet.service";

	export default {
		name: "edit-dashboard",

		components: {
			EditMarker,
			MarkerList,
			Profile,
			SearchBar,
			CreateMarker,
		},

		data() {
			return {
				latLng: null,
				selectedMarker: null,
				openSidebar: false
			}
		},

		async created() {
			this.$bus.$on('map-right-click', this.createMarker);
			this.$bus.$on('marker-click', this.showMarker);
			try {
				let userDetails = auth.getUserDetails();
				const markersRequest = await this.$http.get(`marker/${userDetails.username}`);
				if (markersRequest.data !== undefined) {
					this.$store.commit('replaceMarkers', markersRequest.data);
					map.goToCurrentLocation();
				}
			} catch (error) {
				// TODO: add loading error
				console.log(error);
			}
		},
		beforeDestroy() {
			this.$bus.$off('map-right-click');
			this.$bus.$off('marker-click');
		},

		methods: {
			createMarker(data) {
				this.latLng = data.event.latlng;
				this.$modal.show('create-marker');
			},

			showMarker(marker) {
				this.selectedMarker = marker;
				this.$modal.show('edit-marker');
			}
		}
	}
</script>

<style scoped>

</style>