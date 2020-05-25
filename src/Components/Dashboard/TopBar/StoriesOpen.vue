<template>
	<div class="profile-open">
		<button class="profile-open__button button" @click="edit = true">
			<FontAwesomeIcon icon="edit" class="icon"/>
			<StoryCoverImage :cover="story.cover" :is-small="true"/>
			{{ story.name }}
		</button>
		<button @click="exitStory" class="webpush button is-wide">
			<FontAwesomeIcon icon="times-circle" class="icon"/>
		</button>

		<StoryEditModal :active.sync="edit" :story="story" @saved="storySaved"/>
	</div>
</template>

<script>
	import StoryEditModal from "@/Components/Modals/StoryEditModal";
	import StoryCoverImage from "@/Components/Dashboard/Profile/StoryCoverImage";

	export default {
		name: "StoriesOpen",
		components: {StoryCoverImage, StoryEditModal},

		data() {
			return {
				edit: false
			}
		},

		computed: {
			story() {
				return this.$store.state.Stories.story;
			},
		},

		methods: {
			storySaved() {
				this.edit = false;
			},
			exitStory() {
				this.$store.commit('Profile/trackStory', this.$store.state.Stories.story);
				this.$router.push(`/${this.$route.params.username}`);
			},
		}
	}
</script>
