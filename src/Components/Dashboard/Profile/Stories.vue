<template>
	<div class="stories">
		<div class="story" v-if="edit">
			<a class="story__link" @click="createModal = true">
				New
			</a>
		</div>

		<div class="story" v-for="story in stories" :key="`story_${story.id}`">
			<a class="story__link"
			   @click="chooseStory(story.id)">
				<StoryCoverImage :cover="story.cover"/>
			</a>

			<span class="story__name" v-text="story.name"/>
		</div>

		<StoryEditModal v-if="edit" v-model:active="createModal" @saved="chooseStory"/>
	</div>
</template>

<script>
	import StoryEditModal from "@/Components/Modals/StoryEditModal.vue";
	import StoryCoverImage from "@/Components/Dashboard/Profile/StoryCoverImage.vue";

	export default {
		name: "Stories",
		components: {StoryCoverImage, StoryEditModal},

		data() {
			return {
				createModal: false,
			}
		},

		computed: {
			stories() {
				return this.$store.state.Profile.stories;
			},
			edit() {
				return !!(this.$store.state.User.user && this.$store.state.Profile.user.username === this.$store.state.User.user.username);

			}
		},

		methods: {
			chooseStory(storyId) {
				this.$store.commit('Profile/toggle');
				const username = this.$store.state.Profile.user.username;
				this.$router.push(`${username}/story/${storyId}`);
			}
		}
	}
</script>

