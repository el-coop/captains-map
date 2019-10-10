<template>
	<div class="marker-list__wrapper">
		<UploadsList v-if="! loading && $store.getters['Uploads/allFiles'].length && $router.currentRoute.name === 'edit'"/>
		<div v-if="loading" class="marker-list__loader">
			<div class="loader"></div>
		</div>
		<ul v-if="!loading" class="marker-list">
			<li v-if="hasPrev && !loading">
				<button class="marker-list__button marker-list__button--prev button is-outlined is-faded is-light" @click="previousPage">
					Load Previous
				</button>
			</li>
			<li v-for="marker in markers" class="marker-list__entry" :key="marker.id">
				<MarkerEntry :marker="marker"/>
			</li>
			<li v-if="hasNext && !loading">
				<button class="marker-list__button marker-list__button--next button is-outlined is-faded is-light" @click="nextPage">
					Load Next
				</button>
			</li>
		</ul>
		<slot v-if="!loading"/>
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
				this.$el.scrollLeft = 0;
			},
			async nextPage() {
				await this.$store.dispatch('Markers/nextPage');
				this.$el.scrollLeft = 0;
			},
		}
	}
</script>
