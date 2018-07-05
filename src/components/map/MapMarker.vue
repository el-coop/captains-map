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

		async mounted() {
			let file = await this.readFile(this.marker.file);
			let icon = leaflet.divIcon({
				html: `<div class="map-icon-wrapper"><img src="${file.target.result}" class="map-icon"></div>`,
				iconSize: ['auto', 50]
			});
			this.mapObject = leaflet.marker(this.marker.latLng, {icon: icon});
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
				//	Map.removeMarker(this.mapObject);
			},

			readFile(file) {
				return new Promise((resolve, reject) => {
					let reader = new FileReader();
					reader.onload = resolve;
					reader.onerror = reject;
					reader.readAsDataURL(file);
				});
			}
		}
	}
</script>

<style scoped>

</style>