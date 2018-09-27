<template>
	<div class="map__marker">
		<slot></slot>
	</div>
</template>

<script>
	import leaflet from 'leaflet';
	import MapObjectMixin from '../MapObjectMixin';

	if (process.env.NODE_ENV !== 'test') {
		require('leaflet.markercluster');
	}

	export default {
		name: "MarkerCluster",
		mixins: [MapObjectMixin],

		data() {
			return {
				mapObject: null,
				queue: []
			}
		},

		methods: {
			prepareMapObject() {
				this.mapObject = new leaflet.markerClusterGroup({
					iconCreateFunction: this.createIcon.bind(this)
				});
				while (this.queue.length) {
					const marker = this.queue.pop();
					this.addObject(marker);

				}
			},

			createIcon(cluster) {
				const icon = this.getIcon(cluster.getAllChildMarkers());

				return leaflet.divIcon({
					html: `<div class="map__cluster-wrapper">${icon}` +
						`<span class="map__cluster-wrapper-counter">${cluster.getChildCount()}</span>` +
						`</div>`,
					iconSize: [this.iconSize, this.iconSize]
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
				if (this.mapObject) {
					this.mapObject.addLayer(marker);
				} else {
					this.queue.push(marker)
				}
			},

			removeObject(marker) {
				this.mapObject.removeLayer(marker);
			}
		}
	}
</script>

<style scoped>

</style>