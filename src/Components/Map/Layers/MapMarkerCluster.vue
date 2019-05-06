<template>
	<div class="map__marker">
		<slot></slot>
	</div>
</template>

<script>
	import leaflet from 'leaflet';
	import MapObjectMixin from '@/Components/Map/MapObjectMixin';

	if (process.env.NODE_ENV !== 'test') {
		require('leaflet.markercluster');
	}

	export default {
		name: "MapMarkerCluster",
		mixins: [MapObjectMixin],

		data() {
			return {
				mapObject: null,
			}
		},

		methods: {
			prepareMapObject() {
				this.mapObject = new leaflet.markerClusterGroup({
					iconCreateFunction: this.createIcon.bind(this)
				});
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
					this.queuedActions.push(['addObject', [marker]])
				}
			},

			removeObject(marker) {
				this.mapObject.removeLayer(marker);
			}
		}
	}
</script>
