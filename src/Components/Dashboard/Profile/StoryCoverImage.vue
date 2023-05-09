<template>
	<figure class="story__figure" :class="{'image is-32x32': isSmall}">
		<img class="story__figure-image is-rounded" :src="src">
	</figure>
</template>

<script>
	import globe from '@/assets/images/globe-icon.png';

	export default {
		name: "StoryCoverImage",

		props: {
			cover: {
				required: true
			},
			isSmall: {
				type: Boolean,
				default: false
			}
		},

		computed: {
			src() {
				if (!this.cover || !this.cover.path) {
					return globe;
				}

				if (this.cover.type === 'image') {
					return `/api${this.cover.path}`;
				}

				return `/api/marker/instagram/${this.cover.instagram_type || 'p'}/${this.cover.path}`;

			}
		}
	}
</script>
