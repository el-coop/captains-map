<template>
	<div>
		<div class="loader" v-if="loading"></div>
		<ul v-if="! loading">
			<li v-for="marker in markers" class="media" :key="marker.id">
				<marker-entry :marker="marker"></marker-entry>
			</li>
		</ul>
		<div class="buttons has-addons" v-if="(hasNext || hasPrev) && ! loading">
			<button class="button" @click="previousPage" :disabled="! hasPrev">< Previous</button>
			<button class="button" @click="nextPage" :disabled="! hasNext">Next ></button>
		</div>
	</div>
</template>

<script>
	import MarkerEntry from "./MarkerEntry";
	const pageSize = parseInt(process.env.VUE_APP_PAGE_SIZE);

	export default {
		components: {MarkerEntry},
		name: "marker-list",

		computed: {
			markers() {
				const start = this.$store.state.Markers.page * pageSize;
				const end = this.$store.state.Markers.page * pageSize + pageSize;
				return this.$store.state.Markers.markers.slice(start, end);
			},
			hasNext() {
				const pageEnd = this.$store.state.Markers.page * pageSize + pageSize;
				return this.$store.state.Markers.hasNext || pageEnd < this.$store.state.Markers.markers.length;
			},
			hasPrev(){
				return this.$store.state.Markers.page > 0;
			},
			loading(){
				return this.$store.state.Markers.loading;
			}
		},


		methods: {
			previousPage() {
				return this.$store.dispatch('Markers/previousPage');
			},
			nextPage() {
				return this.$store.dispatch('Markers/nextPage');
			}
		}
	}
</script>

<style scoped lang="scss">
	.media {
		+ .media {
			margin-top: 0;
			padding-top: 0;
		}
	}

	.buttons {
		margin: 7px;
		> .button {
			flex: 1;
		}
	}

	.loader {
		margin: 1em auto;
	}
</style>