<template>
	<div class="map__user-marker map__marker" @click="onClick">
		<user-accuracy-marker v-if="accuracy !== null && lat !== null && lng !== null" :accuracy="accuracy" :lat="lat"
							  :lng="lng"/>
	</div>
</template>

<script>
	import MapObjectMixin from '@/Components/Map/MapObjectMixin';
	import UserMarkerMixin from '@/Components/Map/Markers/UserMarkerMixin';
	import Map from '@/Services/LeafletMapService';
	import UserAccuracyMarker from "@/Components/Map/Markers/UserAccuracyMarker";

	export default {
		name: "UserMarker",
		components: {UserAccuracyMarker},
		mixins: [MapObjectMixin, UserMarkerMixin],

		data() {
			return {
				lat: null,
				lng: null,
				accuracy: 100,
				iconSize: 20
			}
		},

		mounted() {
			this.$bus.$on('goToUserMarker', this.goToMarker);
		},

		beforeDestroy() {
			this.$bus.$off('goToUserMarker', this.goToMarker);
			Map.stopLocate();
		},

		methods: {
			setUp() {
				Map.watchLocation(this.setLocation.bind(this));

			},

			setLocation(location) {
				this.accuracy = location.accuracy;

				if (!location.latlng || (this.lat === location.latlng.lat && this.lng === location.latlng.lng)) {
					return;
				}

				this.lat = location.latlng.lat;
				this.lng = location.latlng.lng;

				if (!this.mapObject) {
					this.$toast.hide('#geolocation-notification');
					this.$toast.info('You can now go to your location by holding the location icon. (right click on desktop)', '');
					this.prepareMapObject(location.latlng.lat, location.latlng.lng);
					this.addToMap();
				}
				this.mapObject.setLatLng(location.latlng);
			},
			addObject(marker) {
				this.$parent.addObject(marker);
			},

			removeObject(marker) {
				this.$parent.removeObject(marker);
			},

			goToMarker() {
				Map.setView([this.lat, this.lng]);
			}
		},
	}
</script>

<style lang="scss" scoped>
	.map__user-marker {
		box-shadow: inset 0 0 5px #06f, inset 0 0 5px #06f, inset 0 0 5px #06f, 0 0 5px #06f, 0 0 5px #06f, 0 0 5px #06f;
		background-color: darken(#06f, 0.1);
		border-radius: 50%;
		border: 1px solid #fff;
		width: 100%;
		height: 100%;
	}
</style>