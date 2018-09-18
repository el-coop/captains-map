<template>
	<figure class="image">
		<img :src="`/api${path}`">
	</figure>
</template>

<script>
	export default {
		name: "photo",

		props: {
			path: {
				required: true,
				type: String
			}
		}
	}
</script>

<style scoped>
	.image {
		background-color: black;
	}

	img {
		max-width: 100%;
		width: auto;
		margin: auto;
	}
</style>