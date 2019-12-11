<template>
	<div class="map__user-marker-accuracy"/>
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
				iconSize: Math.min(750, this.accuracy / 2)
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
				console.log('change');
				let icon = this.mapObject.options.icon;
				const size = Math.min(750, this.accuracy / 2);
				icon.options.iconSize = [size, size];
				this.setIcon(icon);
			},
		},
	}
</script>
