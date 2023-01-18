<template>
	<div class="map__icon-wrapper map__marker">
		<img :src="src" class="map__icon" :class="markerClass"
			 :alt="alt">
		<FontAwesomeIcon icon="images" v-if="marker.media.length > 1" class="map__icon-album"/>
	</div>
</template>

<script>
	import MapObjectMixin from '@/Components/Map/MapObjectMixin.vue';
	import HandlesDataDisplayMixin from "@/Components/Utilities/HandlesDataDisplayMixin.vue";

	export default {
		name: "MapMarker",
		mixins: [MapObjectMixin, HandlesDataDisplayMixin],
        emits:['marker-click'],
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
				if (!this.marker.media || !this.marker.media.length) {
					return '';
				}

				return this.calculateVerifiedImage(this.marker.media[0]);
			},
		},
	}
</script>
