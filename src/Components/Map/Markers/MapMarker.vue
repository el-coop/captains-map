<template>
	<div class="map__icon-wrapper map__marker">
		<img :src="src" class="map__icon" :class="markerClass"
			 :alt="alt">
	</div>
</template>

<script>
	import MapObjectMixin from '@/Components/Map/MapObjectMixin';
	import HandlesDataDisplayMixin from "@/Components/Utilities/HandlesDataDisplayMixin";

	export default {
		name: "MapMarker",
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

		computed: {
			alt() {
				let alt = '';
				if (this.marker.user) {
					alt = this.marker.user.username;
				}
				return `${alt} ${this.marker.type}`.trim();
			},

			markerClass() {
				return `map__icon-${this.marker.type}`;
			}
		},

		methods: {
			calculateSrc() {
				return this.calculateVerifiedImage(this.marker)
			},
		},
	}
</script>
