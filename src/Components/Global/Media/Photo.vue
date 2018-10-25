<template>
	<figure class="image">
		<img :src="`/api${path}`">
	</figure>
</template>

<script>
	export default {
		name: "Photo",

		props: {
			path: {
				required: true,
				type: String
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