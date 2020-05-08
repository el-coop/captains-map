<template>
	<div class="layout">
		<TheDashboard/>
		<CreateMarker v-if="isEdit"/>
	</div>
</template>

<script>
	import TheDashboard from "@/Components/Dashboard/TheDashboard";
	import CreateMarker from "@/Components/Modals/CreateMarker";

	export default {
		name: "ViewPage",
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
			loadStory() {
				this.$store.dispatch('Stories/load', this.$route.params.story);
			}
		},
	}
</script>
