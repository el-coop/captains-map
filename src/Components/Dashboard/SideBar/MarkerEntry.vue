<template>
	<div class="media" :class="marker.type" @click="showMarker">
		<figure class="media-left">
			<p class="image">
				<img :src="src" :alt="`${marker.user.username} ${marker.type}`">
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

	export default {
		name: "marker-entry",

		props: {
			marker: {
				type: Object,
				required: true
			}
		},

		data() {
			return {
				image: null,
				src: null,
				observer: null
			}
		},

		mounted() {
			if (this.marker.media.type == 'instagram') {
				this.src = `https://instagram.com/p/${this.marker.media.path}/media/`;
			} else {
				this.src = `/api${this.marker.media.path.replace('images', 'thumbnails')}`;
			}

		},


		methods: {
			showMarker() {
				this.$bus.$emit('moving-map');
				map.move([this.marker.lat, this.marker.lng], 16);
			},
			dateDisplay(value) {
				const date = new Date(value);

				let hour = date.getUTCHours();
				if (hour < 10) {
					hour = `0${hour}`;
				}

				return `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()} ${hour}:${date.getUTCMinutes()}`;
			}
		},

		filters: {
			truncate(text, length) {
				let hasEnters = false;
				if (text.indexOf('\n') > 0) {
					text = text.substring(0, text.indexOf('\n'));
					hasEnters = true;
				}
				if (text.length <= length - 4) {
					return text + (hasEnters ? ' ...' : '');
				}
				let tcText = text.slice(0, length - 3);
				let last = tcText.length;


				while (last > 0 && tcText[last] !== ' ' && tcText[last] !== '.') {
					last--;
				}

				last = last || length - 3;

				tcText = tcText.slice(0, last);

				return tcText + '...';
			},
		}
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
	}

	.image {
		max-width: 64px;
	}

	strong {
		color: $white;
	}
</style>