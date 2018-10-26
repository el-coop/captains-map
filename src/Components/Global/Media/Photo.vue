<template>
	<figure class="image">
		<img :src="`/api${path}`" :alt="alt">
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
		}
	}
</script>

<style lang="scss" scoped>
	.image {
		background-color: black;

		> img {
			max-width: 100%;
			width: auto;
			margin: auto;
		}
	}

</style>