<template>
	<div class="layout">
		<dashboard/>
	</div>
</template>

<script>
	import Dashboard from "@/Components/Dashboard/Dashboard";
	import map from '@/Services/LeafletMapService';

	export default {
		name: "view-layout",

		components: {
			Dashboard,
		},

		created() {
			this.loadMarkers();
		},

		methods: {
			envSetup() {
				this.$modal.hide('404');

				this.$store.commit('Markers/setUser', this.$route.params.username || '');
			},

			async loadMarkers() {
				this.envSetup();

				const response = await this.$store.dispatch('Markers/load', {
					startingId: this.$route.params.marker || false,
					pageIncluding: true
				});

				if (response.status === 404) {
					return this.$modal.show('404');
				}

				this.handleResponse(response);

			},

			handleResponse(response) {
				if (response.status === 'cached') {
					this.$toast.info('Markers loaded from cache', '');
				}
				const markers = this.$store.state.Markers.markers;
				if (markers.length) {
					if (this.$route.params.marker) {
						let marker = markers.find(({id}) => {
							return id == this.$route.params.marker;
						});
						if (marker) {
							return map.setView([marker.lat, marker.lng], 16);
						} else {
							return this.$modal.show('404');
						}
					}

					return map.setView([markers[0].lat, markers[0].lng]);
				}

				return map.goToCurrentLocation();

			}
		},

		metaInfo() {
			return {
				title: this.$route.params.username || 'Home'
			}
		},

		watch: {
			$route() {
				this.loadMarkers();
			}
		}
	}
</script>