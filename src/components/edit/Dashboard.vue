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
		<create-marker :latLng="latLng"/>
		<view-marker v-if="mountModal" :marker="selectedMarker"/>
	</div>
</template>

<script>
	import Profile from '@/components/edit/Profile';
	import SearchBar from '@/components/edit/SearchBar';
	import CreateMarker from '@/components/edit/CreateMarker';
	import MarkerList from "@/components/global/MarkerList";
	import map from "@/services/leaflet.service";
	import ViewMarker from '@/components/global/ViewMarker';
	import Auth from '@/services/authentication.service';

	export default {
		name: "edit-dashboard",

		components: {
			MarkerList,
			Profile,
			SearchBar,
			CreateMarker,
			ViewMarker
		},

		metaInfo: {
			title: 'Edit'
		},

		data() {
			return {
				latLng: {},
				selectedMarker: null,
				openSidebar: false,
				mountModal: false
			}
		},

		mounted() {
			this.mountModal = true;
		},

		async created() {

			this.$bus.$on('map-right-click', this.createMarker);
			this.$bus.$on('user-marker-click', this.createMarker);
			this.$bus.$on('marker-click', this.showMarker);

			const response = await this.$store.dispatch('Markers/load', Auth.getUserDetails().username);
			if (response.status === 'cached') {
				this.$toast.info('Markers loaded from cache', '', {
					position: 'bottomCenter'
				});
			}
			map.goToCurrentLocation();
		},
		beforeDestroy() {
			this.$bus.$off('map-right-click', this.createMarker);
			this.$bus.$off('marker-click', this.showMarker);
		},

		methods: {
			createMarker(data) {
				if (data.lat && data.lng) {
					this.latLng = data;
				} else {
					this.latLng = data.event.latlng;
				}
				this.$modal.show('create-marker');
			},

			showMarker(marker) {
				this.selectedMarker = marker;
				this.$modal.show('view-marker');
			}
		}
	}
</script>

<style lang="scss" scoped>

	@import "~$scss/variables";

	.dashboard {
		grid-template-rows: [header] 2*$gap/1.5 [body] calc(100% - #{3 * $gap / 1.5}) [footer] $gap/1.5;

		@media #{$above-tablet} {
			grid-template-rows: [header] $gap/1.5 [body] calc(100% - #{$gap / 1.5});
		}
	}
</style>