<template>
	<div class="map__user-marker-accuracy"/>
</template>

<script>
	import MapObjectMixin from '@/Components/Map/MapObjectMixin.vue';
	import UserMarkerMixin from '@/Components/Map/Markers/MapUserMarkerMixin.vue';

	export default {
		name: "MapUserAccuracyMarker",
		mixins: [MapObjectMixin, UserMarkerMixin],
        emits:['user-marker-click'],
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
				iconSize: Math.min(750, this.accuracy / 2),
                event: 'user-marker-click'
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
				const size = Math.min(750, this.accuracy / 2);
				icon.options.iconSize = [size, size];
				this.setIcon(icon);
			},
		},
	}
</script>
