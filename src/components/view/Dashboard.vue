<template>
    <div class="dashboard">
        <top-bar/>
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
				openSidebar: false,
				currentUser: ''
			}
		},

		created() {
			this.$bus.$on('moving-map', this.closeSidebar);
			this.$bus.$on('marker-click', this.showMarker);

			this.loadMarkers();
		},
		beforeDestroy() {
			this.$bus.$off('marker-click');
		},

		methods: {

			async loadMarkers() {
				let markersRoute = '';
				let markers = [];

				if (this.currentUser !== this.$route.params.username) {
					if (this.currentUser = this.$route.params.username) {
						markersRoute = this.currentUser;
					}
					await this.$store.dispatch('Markers/load', markersRoute);
				}
				if (markers = this.$store.state.Markers.markers) {
					if (this.$route.params.marker) {
						let marker = markers.find(({id}) => {
							return id == this.$route.params.marker;
						});
						return map.setView([marker.lat, marker.lng], 16);
					}
					return map.setView([markers[0].lat, markers[0].lng]);
				}

				map.goToCurrentLocation()
			},

			showMarker(marker) {
				this.selectedMarker = marker;
				this.$modal.show('view-marker');
			},

			closeSidebar() {
				this.openSidebar = false;
			}
		},

		watch: {
			$route() {
				this.loadMarkers();
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>