<template>
	<div :class="`zoom-${zoomStatus}`">
		<div class="map" ref="map">
			<MapUserMarkerControl/>
			<MapUserMarker v-if="userMarker"/>

			<upload-marker v-for="marker in uploadMarkers" :marker="marker"
						   :key="`uploads_${Date.now()}_${marker.uploadTime}`"
						   v-if="$router.currentRoute.name === 'edit'"/>

			<upload-marker v-for="marker in erroredMarkers" :marker="marker"
						   :key="`errors_${Date.now()}_${marker.uploadTime}`" status="error"
						   v-if="$router.currentRoute.name === 'edit'"/>
			<marker-cluster ref="markerCluster">
				<map-marker v-for="marker in markers" :layer="$refs.markerCluster" :marker="marker"
							:key="`${Date.now()}_${marker.id}`"/>
			</marker-cluster>
		</div>
	</div>
</template>

<script>

	import Map from '@/Services/LeafletMapService';
	import MapUserMarkerControl from "@/Components/Map/Controls/MapUserMarkerControl";
	import MapUserMarker from '@/Components/Map/Markers/MapUserMarker';

	import MapMarker from '@/Components/Map/Markers/MapMarker';
	import MarkerCluster from "@/Components/Map/Layers/MarkerCluster";
	import UploadMarker from "@/Components/Map/Markers/UploadMarker";

	export default {
		name: "TheMap",

		components: {
			MapUserMarkerControl,
			UploadMarker,
			MarkerCluster,
			MapMarker,
			MapUserMarker
		},

		props: {
			center: {
				type: Array,
				default() {
					return [0, 0];
				}
			},
			zoom: {
				type: Number,
				default: 10
			},
		},

		data() {
			return {
				zoomStatus: 'normal'
			}
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


		computed: {
			markers() {
				const start = this.$store.state.Markers.page * process.env.VUE_APP_PAGE_SIZE;
				const end = this.$store.state.Markers.page * process.env.VUE_APP_PAGE_SIZE + process.env.VUE_APP_PAGE_SIZE;
				return this.$store.state.Markers.markers.slice(start, end);
			},
			userMarker() {
				return this.$store.state.Markers.userMarker;
			},
			uploadMarkers() {
				return this.$store.state.Uploads.queue;
			},
			erroredMarkers() {
				return this.$store.state.Uploads.errored;
			},
		},

		mounted() {
			Map.init(this.$refs.map, this.center, this.zoom);
			Map.on('contextmenu', this.rightClick);
			Map.on('zoomend', this.handleZoom);
		},

		beforeDestroy() {
			Map.off();
		}
	}
</script>
