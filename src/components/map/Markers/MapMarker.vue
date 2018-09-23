<template>
	<div class="map__icon-wrapper map__marker">
		<img :src="path" :class="`map__icon-${marker.type}`">
	</div>
</template>

<script>
	import MapObjectMixin from '../MapObjectMixin';


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

		computed: {
			path() {
				if (this.marker.media.type === 'instagram') {
					return `https://instagram.com/p/${this.marker.media.path}/media/`;
				}
				return `/api${this.marker.media.path.replace('images', 'thumbnails')}`;
			}
		}
	}
</script>