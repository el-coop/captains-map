<template>
	<div :class="zoomStatus">
		<div class="map" ref="map">
			<MapUserMarkerControl key="userMarkerController" @goToUserMarker="goToUserMarker" @marker-click/>
			<MapUserMarker v-if="userMarker" key="userMarker" ref="userMarker"/>

			<template v-if="$router.currentRoute.name === 'edit'">
				<MapUploadMarker v-for="marker in uploadMarkers" :marker="marker"
								 :key="`uploads_${marker.uploadTime}`"/>
			</template>
			<MapMarkerCluster key="cluster">
				<MapMarker v-for="marker in markers" :marker="marker"
						   :key="`marker_${marker.id}`" @marker-click="$emit('marker-click', $event)"/>
			</MapMarkerCluster>
		</div>
	</div>
</template>

<script>

	import Map from '@/Services/LeafletMapService';
	import MapUserMarkerControl from "@/Components/Map/Controls/MapUserMarkerControl";
	import MapUserMarker from '@/Components/Map/Markers/MapUserMarker';
	import MapUploadMarker from "@/Components/Map/Markers/MapUploadMarker";

	import MapMarker from '@/Components/Map/Markers/MapMarker';
	import MapMarkerCluster from "@/Components/Map/Layers/MapMarkerCluster";

	export default {
		name: "TheMap",

		components: {
			MapUserMarkerControl,
			MapUploadMarker,
			MapMarkerCluster,
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
				zoomStatus: 'map--zoom-normal',
				initialized: false
			}
		},

		methods: {
		    goToUserMarker(){
		        this.$refs.userMarker.goToMarker();
            },
			rightClick(event) {
				this.$emit('map-create-marker', {
					event
				});
			},

			handleZoom(event) {
				let zoomLevel = event.target._animateToZoom;
				if (zoomLevel < 5) {
					return this.zoomStatus = 'map--zoom-far';
				}
				if (zoomLevel < 10) {
					return this.zoomStatus = 'map--zoom-medium';
				}
				if (zoomLevel < 15) {
					return this.zoomStatus = 'map--zoom-normal';
				}
				return this.zoomStatus = 'map--zoom-close';
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
				if (this.$store.state.Stories.story) {
					return this.$store.state.Stories.markers;
				}
				const start = this.$store.state.Markers.page * process.env.VUE_APP_PAGE_SIZE;
				const end = this.$store.state.Markers.page * process.env.VUE_APP_PAGE_SIZE + process.env.VUE_APP_PAGE_SIZE;
				return this.$store.state.Markers.markers.slice(start, end);
			},
			userMarker() {
				return this.$store.state.Markers.userMarker;
			},
			uploadMarkers() {
				return this.$store.getters['Uploads/allFiles'];
			},
		},

		mounted() {
			Map.init(this.$refs.map, this.center, this.zoom);
			Map.on('contextmenu', this.rightClick);
			Map.on('zoomend', this.handleZoom);
		},

		beforeUnmount() {
			Map.off();
		},
	}
</script>
