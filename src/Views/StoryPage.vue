<template>
	<div class="layout">
		<TheDashboard/>
		<CreateMarker v-if="isEdit"/>
	</div>
</template>

<script>
	import TheDashboard from "@/Components/Dashboard/TheDashboard";
	import CreateMarker from "@/Components/Modals/CreateMarker";
	import map from "@/Services/LeafletMapService";

	export default {
		name: "StoryPage",
		metaInfo() {
			return {
				title: this.$route.params.username
			}
		},

		components: {
			TheDashboard,
			CreateMarker
		},

		mounted() {
			this.$bus.$emit('env-setup');
			this.loadStory();
		},

		computed: {
			isEdit() {
				const user = this.$store.state.User.user;
				return this.$store.state.Stories.story && user && this.$store.state.Stories.story.user_id === user.id;
			}
		},

		methods: {
			async loadStory() {
				const responseStatus = await this.$store.dispatch('Stories/load', this.$route.params.story);

				if (responseStatus === 404) {
					return this.$bus.$emit(404);
				}
				if (responseStatus === 'cached') {
					this.$toast.info('Markers loaded from cache', '');
				}

				const markers = this.$store.state.Stories.markers;

				if (!markers.length) {
					return;
				}

				let marker;
				if (this.$route.params.marker) {
					marker = markers.find(({id}) => {
						return id == this.$route.params.marker;
					});
				} else {
					marker = markers[0];
				}

				if (!marker) {
					return this.$bus.$emit('404');
				}
				return map.setView([marker.lat, marker.lng]);
			}
		},
	}
</script>
