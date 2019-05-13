<template>
	<div>
		<UploadsList v-if="$store.getters['Uploads/allFiles'].length && $router.currentRoute.name === 'edit'"/>
		<MarkerBordersFilter class="is-hidden-touch"/>
		<div class="loader marker-list__loader" v-if="loading"></div>
		<ul v-if="! loading">
			<li v-for="marker in markers" class="media marker-list__media" :key="marker.id">
				<MarkerEntry :marker="marker"/>
			</li>
		</ul>
		<div class="buttons marker-list__buttons has-addons" v-if="(hasNext || hasPrev) && ! loading">
			<button class="button is-light is-flex-1" @click="previousPage" :disabled="! hasPrev">< Previous</button>
			<button class="button is-light is-flex-1" @click="nextPage" :disabled="! hasNext">Next ></button>
		</div>
	</div>
</template>

<script>
	import MarkerEntry from "@/Components/Dashboard/SideBar/MarkerEntry";
	import MarkerBordersFilter from "@/Components/Utilities/MarkerBordersFilter";
	import UploadsList from "@/Components/Dashboard/SideBar/UploadsList";

	const pageSize = parseInt(process.env.VUE_APP_PAGE_SIZE);

	export default {
		name: "MarkerList",
		components: {MarkerBordersFilter, MarkerEntry, UploadsList},

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
			hasPrev() {
				return this.$store.state.Markers.page > 0 || this.$store.state.Markers.serverPage > 0;
			},
			loading() {
				return this.$store.state.Markers.loading;
			},
		},


		methods: {
			async previousPage() {
				await this.$store.dispatch('Markers/previousPage');
			},
			async nextPage() {
				await this.$store.dispatch('Markers/nextPage');
			},
		}
	}
</script>
