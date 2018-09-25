<template>
	<div class="map__marker">
		<slot></slot>
	</div>
</template>

<script>
	import leaflet from 'leaflet';
	import Map from '@/services/leaflet.service';
	import MapObjectMixin from '../MapObjectMixin';

	export default {
		name: "MarkerCluster",
		mixins: [MapObjectMixin],

		data() {
			return {
				mapObject: null
			}
		},

		methods: {
			prepareMapObject() {
				this.mapObject = leaflet.markerClusterGroup({
					iconCreateFunction: this.createIcon.bind(this)
				});
			},

			createIcon(cluster) {
				const icon = this.getIcon(cluster.getAllChildMarkers());

				return leaflet.divIcon({
					html: '<div class="map__cluster-wrapper">' +
						`${icon}<span class="map__cluster-wrapper-counter">${cluster.getChildCount()}</span>` +
						'</div>'
				});
			},

			getIcon(cluster) {
				let marker = cluster.reduce((prev, current) => {
					if (prev.id > current.id) {
						return prev;
					}
					return current;
				});
				return marker.options.icon.options.html;
			},

			addObject(marker) {
				this.mapObject.addLayer(marker);
			},

			removeObject(marker) {
				this.mapObject.removeLayer(marker);
			}
		}
	}
</script>

<style scoped>

</style>