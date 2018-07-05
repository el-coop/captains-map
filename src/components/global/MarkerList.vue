<template>
    <ul>
        <li v-for="marker in markers" class="media">
            <marker-entry :marker="marker"></marker-entry>
        </li>
    </ul>
</template>

<script>
	import MarkerEntry from "./MarkerEntry";

	export default {
		components: {MarkerEntry},
		name: "marker-list",

		computed: {
			markers() {
				return this.$store.state.markers;
			}
		},
	}
</script>

<style scoped>
</style>