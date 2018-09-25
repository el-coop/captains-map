<template>
	<div class="map__icon-wrapper map__marker">
		<img :src="path" :class="`map__icon-${marker.type}`">
	</div>
</template>

<script>
	import MapObjectMixin from '../MapObjectMixin';
	import leaflet from 'leaflet';

	export default {
		name: "map-marker",
		mixins: [MapObjectMixin],

		props: {
			marker: {
				type: Object,
				required: true,
			}
		},

		data() {
			return {
				event: 'marker-click',
				payload: this.marker,
				lat: this.marker.lat,
				lng: this.marker.lng,
			}
		},

		methods: {
			prepareMapObject(lat, lng) {
				lat = this.lat;
				lng = this.lng;
				this.mapObject = leaflet.marker([lat, lng], {
					icon: leaflet.divIcon({
						html: this.$el.outerHTML,
						iconSize: [this.iconSize, this.iconSize]
					})
				}).on('click', this.onClick.bind(this));
				this.mapObject.id = this.marker.id;
			},
		},

		computed: {
			path() {
				if (this.marker.media.type === 'instagram') {
					return `https://instagram.com/p/${this.marker.media.path}/media/`;
				}
				return `/api${this.marker.media.path.replace('images', 'thumbnails')}`;
			}
		},
	}
</script>