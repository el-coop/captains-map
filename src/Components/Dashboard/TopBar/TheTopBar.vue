<template>
	<div class="top-bar">
		<div class="top-bar__left">
			<ProfileOpen v-if="hasUsername && hasStory === false"/>
			<StoriesOpen v-else-if="hasStory !== false"/>
			<figure v-else class="image is-32x32 is-hidden-mobile">
				<picture>
					<source :srcset="'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='"
							media="(max-width: 768px)">
					<img class="is-rounded" :src="logo">
				</picture>
			</figure>
			<slot name="left"></slot>
		</div>
		<slot name="right"></slot>
	</div>
</template>

<script>
	import globe from '@/assets/images/globe-icon.png';
	import ProfileOpen from "@/Components/Dashboard/TopBar/ProfileOpen";
	import StoriesOpen from "@/Components/Dashboard/TopBar/StoriesOpen";

	export default {
		name: "TheTopBar",
		components: {StoriesOpen, ProfileOpen},

		data() {
			return {
				logo: globe
			}
		},

		computed: {
			hasUsername() {
				return this.$store.state.Markers.username;
			},

			hasStory() {
				return !! this.$store.state.Stories.story;
			}
		}
	}
</script>
