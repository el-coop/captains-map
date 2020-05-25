<template>
	<div class="stories">
		<div class="story">
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

		<StoryEditModal :active.sync="createModal" @saved="chooseStory"/>
	</div>
</template>

<script>
	import StoryEditModal from "@/Components/Modals/StoryEditModal";
	import StoryCoverImage from "@/Components/Dashboard/Profile/StoryCoverImage";

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

