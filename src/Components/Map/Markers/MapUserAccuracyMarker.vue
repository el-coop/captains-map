<template>
	<div class="map__user-marker-accuracy"></div>
</template>

<script>
	import MapObjectMixin from '@/Components/Map/MapObjectMixin';
	import UserMarkerMixin from '@/Components/Map/Markers/MapUserMarkerMixin';

	export default {
		name: "MapUserAccuracyMarker",
		mixins: [MapObjectMixin, UserMarkerMixin],
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

		data() {
			return {
				iconSize: this.accuracy / 2
			}
		},

		watch: {
			lat() {
				this.setLatLng(this.lat, this.lng);
			},
			lng() {
				this.setLatLng(this.lat, this.lng);
			},
			accuracy() {
				let icon = this.mapObject.options.icon;
				icon.options.iconSize = [this.accuracy / 2, this.accuracy / 2];
				this.setIcon(icon);
			},
		},
	}
</script>
