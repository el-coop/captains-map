<template>
	<div :class="`zoom-${zoomStatus}`">
		<div class="map" ref="map">
			<user-marker-control/>
			<user-marker v-if="userMarker"/>
			<map-marker v-for="marker in markers" :marker="marker" :key="`${Date.now()}_${marker.id}`"/>
		</div>
	</div>
</template>

<script>

	import map from '@/services/leaflet.service';
	import MapMarker from './Markers/MapMarker';
	import UserMarker from './Markers/UserMarker';
	import UserMarkerControl from "@/components/map/Controls/UserMarkerControl";

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
			UserMarkerControl,
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
				zoomStatus: 'normal'
			}
		},

		computed: {
			markers() {
				return this.$store.state.Markers.markers;
			},
			userMarker() {
				return this.$store.state.Markers.userMarker;
			}
		},

		mounted() {
			map.init(this.$refs.map, this.center, this.zoom);
			map.on('contextmenu', this.rightClick);
			map.on('zoomend', this.handleZoom);
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