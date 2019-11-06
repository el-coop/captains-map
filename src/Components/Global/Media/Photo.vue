<template>
	<figure class="image view-marker__image">
		<img :src="`/api${path}`" :alt="alt" class="view-marker__image-img">
		<button class="button is-light-background view-marker__image-button" @click="openImage">
			<FontAwesomeIcon icon="external-link-square-alt" fixed-width></FontAwesomeIcon>
		</button>
	</figure>
</template>

<script>
	export default {
		name: "Photo",

		props: {
			path: {
				required: true,
				type: String
			},
			alt: {
				type: String,
				default: ''
			}
		},

		methods: {
			openImage(){
				window.open(`/api${this.path}`);
			}
		}
	}
</script>
