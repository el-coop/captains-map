<template>
	<div class="media" :class="className" @click="showMarker">
		<figure class="media-left">
			<p class="image">
				<img :src="src" :alt="`${marker.user ? marker.user.username : ''} ${this.marker.type}`.trim()">
			</p>
		</figure>
		<div class="media-content">
			<div class="content">
				<small class="has-text-weight-semibold is-block is-size-7" v-text="dateDisplay(marker.time)"></small>
				<small>Type:&nbsp;</small>
				<strong v-text="marker.type"></strong>
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
		name: "marker-entry",
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
				className: this.marker.type,
			}
		},

		methods: {
			calculateImage() {
				return this.calculateVerifiedImage(this.marker);
			},
			showMarker() {
				this.$bus.$emit('moving-map');
				map.move([this.marker.lat, this.marker.lng], 16);
			},

		},
	}
</script>

<style lang="scss" scoped>
	@import "~$scss/variables";

	.media {
		width: 100%;
		cursor: pointer;
		padding: 0.5rem;

		&:hover {
			&.Plan {
				background-color: $cyan;
			}

			&.Visited {
				background-color: $turquoise;
			}

			&.Suggestion {
				background-color: $red;
			}

			background-color: $grey-light;
		}

		.image {
			max-width: 64px;
			max-height: 100px;
			overflow: hidden;
		}

		&.error, &.queued {
			.image {
				position: relative;
				overflow: hidden;

				&:after {
					width: 100%;
					height: 100%;
					text-align: center;
					position: absolute;
					left: 0;
					top: 0;
					font-size: $size-7;
				}
			}
		}

		&.error {
			.image:after {
				content: 'ERROR';
				background-color: transparentize($red, 0.4);
			}
		}


		&.queued {
			filter: grayscale(100);

			.image:after {
				content: 'QUEUE';
				background-color: transparentize($black, 0.4);
			}
		}

		&.uploading {
			filter: grayscale(100);

			.image:after {
				animation: spinAround 500ms infinite linear;
				border: 0.25em solid $grey-lighter;
				border-radius: $radius-rounded;
				border-right-color: transparent;
				border-top-color: transparent;
				content: "";
				display: block;
				top: calc(50% - 1em);
				left: calc(50% - 1em);
				width: 2em;
				height: 2em;
				position: absolute;
			}
		}


	}


	strong {
		color: $white;
	}
</style>
