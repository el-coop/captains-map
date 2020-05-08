<template>
	<div class="stories">
		<a class="story" @click="createModal = true">
			New
		</a>

		<a class="story" v-for="story in stories" :key="`story_${story.id}`" v-text="story.name"
		   @click="chooseStory(story.id)"/>

		<StoryEditModal :active.sync="createModal" @saved="chooseStory"/>
	</div>
</template>

<script>
	import StoryEditModal from "@/Components/Modals/StoryEditModal";

	export default {
		name: "Stories",
		components: {StoryEditModal},

		data() {
			return {
				createModal: false
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

