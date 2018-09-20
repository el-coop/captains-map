<template>
	<div>
		<user-accuracy-marker v-if="accuracy > 50 && lat !== null && lng !== null" :lat="lat" :lng="lng"/>
	</div>
</template>

<script>
	import leaflet from 'leaflet';
	import MarkerMixin from './MarkerMixin';
	import UserMarkerMixin from './UserMarkerMixin';
	import Map from '@/services/leaflet.service';
	import UserAccuracyMarker from "./UserAccuracyMarker";

	export default {
		name: "UserMarker",
		components: {UserAccuracyMarker},
		mixins: [MarkerMixin, UserMarkerMixin],

		data() {
			return {
				lat: null,
				lng: null,
				accuracy: 0,
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
				}).on('click', this.onClick.bind(this));
				this.addToMap();
			}
		},
	}
</script>