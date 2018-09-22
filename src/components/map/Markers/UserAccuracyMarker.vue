<template>
	<div class="map__user-accuracy-marker"></div>
</template>

<script>
	import MapObjectMixin from '../MapObjectMixin';
	import UserMarkerMixin from './UserMarkerMixin';

	export default {
		name: "UserAccuracyMarker",
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
			},
		},

		data() {
			return {
				iconSize: this.accuracy / 2
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

<style lang="scss" scoped>
	.map__user-marker {
		background-color: darken(#06f, 0.1);
		border-radius: 50%;
		width: 100%;
		height: 100%;
		opacity: 0.4;
		border: 1px solid darken(#06f, 0.1);
	}
</style>