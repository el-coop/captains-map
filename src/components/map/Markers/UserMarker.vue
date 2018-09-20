<template>
	<div>
		<user-accuracy-marker v-if="accuracy > 50" :lat="lat" :lng="lng"/>
	</div>
</template>

<script>
	import leaflet from 'leaflet';
	import MarkerMixin from './MarkerMixin';
	import Map from '@/services/leaflet.service';
	import UserAccuracyMarker from "./UserAccuracyMarker";

	export default {
		name: "UserMarker",
		components: {UserAccuracyMarker},
		mixins: [MarkerMixin],

		data() {
			return {
				event: 'user-marker-click',
				lat: null,
				lng: null,
				accuracy: 0
			}
		},

		beforeDestroy() {
			if (this.radiusObject) {
				Map.removeMarker(this.radiusObject);
			}
		},


		methods: {
			prepareMapObject() {
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
					this.createObject(location.latlng);
				}
				this.mapObject.setLatLng(location.latlng);
			},

			createObject(latLng) {
				this.mapObject = leaflet.marker(latLng, {
					icon: leaflet.divIcon({
						html: `<div class="map__user-marker"></div>`,
						iconSize: ['auto', 'auto']
					})
				});
				this.addToMap();
			}
		}

	}
</script>