<template>
	<div class="map__icon-wrapper map__marker">
		<img :src="src" :class="`map__icon-${marker.type}`"
			 :alt="`${marker.user ? marker.user.username : ''} ${marker.type}`.trim()">
	</div>
</template>

<script>
	import MapObjectMixin from '@/Components/Map/MapObjectMixin';
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
				lat: this.marker.lat,
				lng: this.marker.lng,
			}
		},

		methods: {
			calculateSrc() {
				return this.calculateVerifiedImage(this.marker)
			},
		},
	}
</script>
