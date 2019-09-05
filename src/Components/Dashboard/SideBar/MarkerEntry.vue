<template>
	<div class="media marker-entry" :class="className" @click="showMarker">
		<figure class="media-left">
			<p class="image marker-entry__image">
				<img :src="src" :alt="imageAlt">
				<FontAwesomeIcon icon="images" v-if="marker.media.length > 1" class="marker-entry__image-album"/>
			</p>
		</figure>
		<div class="media-content">
			<div class="content">
				<small class="has-text-weight-semibold is-block is-size-7" v-text="dateDisplay(marker.time)"></small>
				<small>Type:&nbsp;</small>
				<strong class="has-text-white" v-text="marker.type"></strong>
				<br>
				<p>{{ marker.description | truncate(45) }}</p>
			</div>
		</div>
	</div>
</template>

<script>
	import map from '@/Services/LeafletMapService';
	import HandlesDataDisplayMixin from "@/Components/Utilities/HandlesDataDisplayMixin";

	export default {
		name: "MarkerEntry",
		mixins: [HandlesDataDisplayMixin],

		props: {
			marker: {
				type: Object,
				required: true
			}
		},

		data() {
			return {
				src: this.calculateImage(),
				className: `marker-entry--${this.marker.type}`,
			}
		},

		computed: {
			imageAlt() {
				let text = '';
				if (this.marker.user) {
					text = `${this.marker.user.username} `;
				}
				return text + this.marker.type;
			}
		},

		methods: {
			calculateImage() {
				if (!this.marker.media || !this.marker.media.length) {
					return '';
				}

				return this.calculateVerifiedImage(this.marker.media[0]);
			},
			showMarker() {
				this.$bus.$emit('moving-map');
				map.move([this.marker.lat, this.marker.lng], 16);
			},

		},
	}
</script>
