<template>
	<figure class="image">
		<img :src="`/api${path}`" :alt="alt">
		<button class="button is-light" @click="openImage">
			<font-awesome-icon icon="external-link-square-alt"></font-awesome-icon>
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

<style lang="scss" scoped>
	.image {
		background-color: black;
		position: relative;

		> img {
			max-width: 100%;
			width: auto;
			margin: auto;
		}

		> .button {
			opacity: 0.25;
			position: absolute;
			right: 1em;
			bottom: 1em;

			&:hover {
				opacity: 0.6;
			}
		}
	}

</style>
