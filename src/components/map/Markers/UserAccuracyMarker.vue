<template>
	<div></div>
</template>

<script>
	import leaflet from 'leaflet';
	import MarkerMixin from './MarkerMixin';

	export default {
		name: "UserAccuracyMarker",
		mixins: [MarkerMixin],
		props: {
			lat: {
				type: Number,
				required: true
			},
			lng: {
				type: Number,
				required: true
			}
		},

		methods: {
			prepareMapObject() {
				this.mapObject = leaflet.marker([this.lat, this.lng], {
					icon: leaflet.divIcon({
						html: `<div class="map__user-accuracy-marker"></div>`,
						iconSize: ['auto', 'auto']
					})
				});
			}
		},

		watch: {
			lat() {
				this.mapObject.setLatLng([this.lat, this.lng]);
			},
			lng() {
				this.mapObject.setLatLng([this.lat, this.lng]);
			}
		}

	}
</script>