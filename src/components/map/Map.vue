<template>
	<div :class="`zoom-${zoomStatus}`">
		<div class="map" ref="map">
			<user-marker/>
			<map-marker v-for="marker in markers" :marker="marker" :key="marker.id"/>
		</div>
	</div>
</template>

<script>

	import Map from '@/services/leaflet.service';
	import MapMarker from './Markers/MapMarker';
	import UserMarker from './Markers/UserMarker';

	export default {
		name: "map-view",
		props: {
			center: {
				type: Array,
			},
			zoom: {
				type: Number,
				default: 10
			},
		},

		components: {
			MapMarker,
			UserMarker
		},

		methods: {
			rightClick(event) {
				this.$bus.$emit('map-right-click', {
					event
				});
			},

			handleZoom(event) {
				let zoomLevel = event.target._animateToZoom;
				if (zoomLevel < 5) {
					return this.zoomStatus = 'far';
				}
				if (zoomLevel < 10) {
					return this.zoomStatus = 'medium';
				}
				if (zoomLevel < 15) {
					return this.zoomStatus = 'normal';
				}
				return this.zoomStatus = 'close';
			}
		},

		data() {
			return {
				Map,
				zoomStatus: 'normal'
			}
		},

		computed: {
			markers() {
				return this.$store.state.Markers.markers;
			}
		},

		mounted() {
			this.Map.init(this.$refs.map, this.center, this.zoom);

			this.Map.map.on('contextmenu', this.rightClick);
			this.Map.map.on('zoomend', this.handleZoom);
		}
	}
</script>

<style scoped>
	.map {
		position: absolute;
		height: 100%;
		width: 100vw;
		top: 0;
		left: 0;
		z-index: 1;
	}
</style>