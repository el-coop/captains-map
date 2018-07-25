<template>
    <div class="map">
        <map-marker v-for="(marker, index) in markers" :marker="marker" :key="index"></map-marker>
    </div>
</template>

<script>

	import Map from '@/services/leaflet.service';
	import MapMarker from '@/components/map/MapMarker';

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
			MapMarker
		},

		methods: {
			rightClick(event) {
				this.$bus.$emit('map-right-click', {
					event
				});
			}
		},

		data() {
			return {
				Map
			}
		},

		computed: {
			markers() {
				return this.$store.state.Markers.markers;
			}
		},

		mounted() {
			this.Map.init(this.$el, this.center, this.zoom);

			this.Map.map.on('contextmenu', this.rightClick);
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