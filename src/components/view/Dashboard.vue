<template>
    <div class="dashboard">
        <top-bar></top-bar>
        <div class="dashboard__body">
            <profile/>
            <div class="dashboard__control dashboard__body-sidebar" :class="{open: openSidebar}">
                <marker-list/>

                <div class="content copyright">
                    Map data available thanks to © OpenStreetMap contributors.
                    <a href="https://www.openstreetmap.org/copyright" target="_blank">Copyright info</a>
                </div>
            </div>
        </div>
        <div class="dashboard__control is-hidden-tablet">
            <button class="button is-fullwidth is-dark is-medium" @click="openSidebar = !openSidebar">
                Show {{ openSidebar ? 'Map' : 'List'}}
            </button>
        </div>
        <view-marker :marker="selectedMarker"/>
    </div>
</template>

<script>
	import MarkerList from "@/components/global/MarkerList";
	import TopBar from "./TopBar";
	import ViewMarker from "../global/ViewMarker";
	import Profile from "../edit/Profile";
	import map from '@/services/leaflet.service';

	export default {
		name: "view-dashboard",

		components: {
			Profile,
			ViewMarker,
			TopBar,
			MarkerList,
		},

		data() {
			return {
				selectedMarker: null,
				openSidebar: false
			}
		},

		async created() {
			this.$bus.$on('moving-map', this.closeSidebar);
			this.$bus.$on('marker-click', this.showMarker);
			try {
				let markersRoute = 'marker';
				if (this.$route.params.username !== undefined) {
					markersRoute += `/${this.$route.params.username}`;
				}
				const markersRequest = await this.$http.get(markersRoute);

				if (markersRequest.data !== undefined) {
					this.$store.commit('replaceMarkers', markersRequest.data);
					if (markersRequest.data.length) {
						map.setView([markersRequest.data[0].lat, markersRequest.data[0].lng]);
						return;
					}
				}
				map.goToCurrentLocation();

			} catch (error) {
				// TODO: add loading error
				console.log(error);
			}
		},
		beforeDestroy() {
			this.$bus.$off('marker-click');
		},

		methods: {

			showMarker(marker) {
				this.selectedMarker = marker;
				this.$modal.show('view-marker');
			},

			closeSidebar() {
				this.openSidebar = false;
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>