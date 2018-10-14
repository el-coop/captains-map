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
		<view-marker v-if="mountModal" :marker="selectedMarker"/>
		<not-found/>
	</div>
</template>

<script>
	import MarkerList from "@/Components/global/MarkerList";
	import TopBar from "./TopBar";
	import ViewMarker from "../global/ViewMarker";
	import Profile from "../edit/Profile";
	import map from '@/Services/LeafletMapService';
	import NotFound from "../global/404";

	export default {
		name: "view-dashboard",

		components: {
			NotFound,
			Profile,
			ViewMarker,
			TopBar,
			MarkerList,
		},

		metaInfo() {
			return {
				title: this.$route.params.username || 'Home'
			}
		},

		data() {
			return {
				selectedMarker: null,
				openSidebar: false,
				mountModal: false
			}
		},

		mounted() {
			this.mountModal = true;
		},

		created() {
			this.$bus.$on('moving-map', this.closeSidebar);
			this.$bus.$on('marker-click', this.showMarker);

			this.loadMarkers();
		},
		beforeDestroy() {
			this.$bus.$off('marker-click', this.showMarker);
			this.$bus.$off('moving-map', this.closeSidebar);
		},

		methods: {

			async loadMarkers() {
				this.$modal.hide('404');
				let markers = [];

				this.$store.commit('Markers/setUser', this.$route.params.username || '');

				const response = await this.$store.dispatch('Markers/load', {
					startingId: this.$route.params.marker || false,
					pageIncluding: true
				});
				if (response.status !== 404) {
					if (response.status === 'cached') {
						this.$toast.info('Markers loaded from cache', '', {
							position: 'bottomCenter'
						});
					}
					markers = this.$store.state.Markers.markers;
					if (markers.length) {
						if (this.$route.params.marker) {
							let marker = markers.find(({id}) => {
								return id == this.$route.params.marker;
							});
							if (marker) {
								return map.setView([marker.lat, marker.lng], 16);
							} else {
								this.$modal.show('404');
							}
						}
						return map.setView([markers[0].lat, markers[0].lng]);
					}

					return map.goToCurrentLocation();
				}

				this.$modal.show('404');
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