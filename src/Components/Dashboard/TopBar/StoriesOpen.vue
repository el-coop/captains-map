<template>
	<div class="profile-open">
		<button class="profile-open__button button" @click="edit = true">
			<span>
				<FontAwesomeIcon icon="edit" class="icon"/>
				{{ story.name }}
			</span>
		</button>
		<button @click="exitStory" class="webpush button is-wide">
			<FontAwesomeIcon icon="times-circle" class="icon"/>
		</button>

		<StoryEditModal :active.sync="edit" :story="story" @saved="storySaved"/>
	</div>
</template>

<script>
	import StoryEditModal from "@/Components/Modals/StoryEditModal";

	export default {
		name: "StoriesOpen",
		components: {StoryEditModal},
		computed: {
			story() {
				return this.$store.state.Stories.story;
			},
		},

		data() {
			return {
				edit: false
			}
		},

		methods: {
			storySaved(){
				this.edit = false;
				this.$toast.success(' ', 'Story updated.');
			},
			exitStory() {
				this.$router.push(`/${this.$route.params.username}`);
			},
		}
	}
</script>
