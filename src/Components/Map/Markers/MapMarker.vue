<template>
	<div class="map__icon-wrapper map__marker" :class="extraClass">
		<img :src="src" :class="`map__icon-${marker.type}`"
			 :alt="`${marker.user ? marker.user.username : ''} ${marker.type}`.trim()">
	</div>
</template>

<script>
	import MapObjectMixin from '@/Components/Map/MapObjectMixin';
	import leaflet from 'leaflet';
	import HandlesDataDisplayMixin from "@/Components/Utilities/HandlesDataDisplayMixin";

	export default {
		name: "map-marker",
		mixins: [MapObjectMixin, HandlesDataDisplayMixin],

		props: {
			marker: {
				type: Object,
				required: true,
			}
		},

		data() {
			return {
				src: this.calculateSrc(),
				event: 'marker-click',
				payload: this.marker,
				extraClass: '',
				lat: this.marker.lat,
				lng: this.marker.lng,
			}
		},

		methods: {
			calculateSrc() {
				return this.calculateVerifiedImage(this.marker)
			},

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
	}
</script>
