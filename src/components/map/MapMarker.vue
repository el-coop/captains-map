<template>
    <div>

    </div>
</template>

<script>
	import leaflet from 'leaflet';
	import Map from '@/services/leaflet.service';

	export default {
		name: "map-marker",

		props: {
			marker: {
				type: Object,
				required: true
			}
		},

		data() {
			return {
				ready: false,
				mapObject: null
			}
		},

		mounted() {
			let icon = leaflet.divIcon({
				html: `<div class="map-icon-wrapper"><img src="/api${this.marker.media.path}" class="map-icon"></div>`,
				iconSize: ['auto', 50]
			});
			this.mapObject = leaflet.marker([this.marker.lat, this.marker.lng], {icon: icon}).on('click', this.onClick.bind(this));
			leaflet.DomEvent.on(this.mapObject, this.$listeners);
			this.addToMap();

		},

		beforeDestroy() {
			this.removeFromMap();
		},

		methods: {
			addToMap() {
				Map.addMarker(this.mapObject);
			},
			removeFromMap() {
				Map.removeMarker(this.mapObject);
			},
			onClick() {
				this.$bus.$emit('marker-click', this.marker);
			}
		}
	}
</script>

<style scoped>

</style>