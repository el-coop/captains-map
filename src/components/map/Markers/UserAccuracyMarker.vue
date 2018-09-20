<template>
	<div></div>
</template>

<script>
	import leaflet from 'leaflet';
	import MarkerMixin from './MarkerMixin';
	import UserMarkerMixin from './UserMarkerMixin';

	export default {
		name: "UserAccuracyMarker",
		mixins: [MarkerMixin, UserMarkerMixin],
		props: {
			lat: {
				type: Number,
				required: true
			},
			lng: {
				type: Number,
				required: true
			},
			accuracy: {
				type: Number,
				required: true
			}
		},

		methods: {
			prepareMapObject() {
				this.mapObject = leaflet.marker([this.lat, this.lng], {
					icon: leaflet.divIcon({
						html: `<div class="map__user-accuracy-marker"></div>`,
						iconSize: [this.accuracy / 2, this.accuracy / 2]
					})
				}).on('click', this.onClick.bind(this));
			}
		},

		watch: {
			lat() {
				this.mapObject.setLatLng([this.lat, this.lng]);
			},
			lng() {
				this.mapObject.setLatLng([this.lat, this.lng]);
			},
			accuracy() {
				let icon = this.mapObject.options.icon;
				icon.options.iconSize = [this.accuracy / 2, this.accuracy / 2];
				this.mapObject.setIcon(icon);
			}
		},
	}
</script>