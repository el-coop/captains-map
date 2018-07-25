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
				return this.$store.state.Markers.markers;
			}
		},
	}
</script>

<style scoped>
    .media + .media {
        margin-top: 0;
        padding-top: 0;
    }
</style>