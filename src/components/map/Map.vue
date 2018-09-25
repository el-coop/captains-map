<template>
	<div :class="`zoom-${zoomStatus}`">
		<div class="map" ref="map">
			<user-marker-control/>
			<user-marker v-if="userMarker"/>
			<marker-cluster ref="userMarker">
				<map-marker v-for="marker in markers" :layer="$refs.userMarker" :marker="marker"
							:key="`${Date.now()}_${marker.id}`"/>
			</marker-cluster>
		</div>
	</div>
</template>

<script>

	import Map from '@/services/leaflet.service';
	import MapMarker from './Markers/MapMarker';
	import UserMarker from './Markers/UserMarker';
	import UserMarkerControl from "@/components/map/Controls/UserMarkerControl";
	import MarkerCluster from "@/components/map/Layers/MarkerCluster";

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
			MarkerCluster,
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
			},

			addObject(object) {
				Map.addObject(object);
			},
			removeObject(object) {
				Map.removeObject(object);
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
			},
		},

		mounted() {
			Map.init(this.$refs.map, this.center, this.zoom);
			Map.on('contextmenu', this.rightClick);
			Map.on('zoomend', this.handleZoom);
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