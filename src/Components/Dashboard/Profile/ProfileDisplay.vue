<template>
	<Profile>
		<template #image>
			<figure class="image profile__image-display is-128x128">
				<img :src="imageSrc">
			</figure>
		</template>
		<template #content>
			<p class="profile__content-text" v-text="user.description"></p>
		</template>
	</Profile>
</template>

<script>
	import globe from '../../../assets/images/globe-icon.png';
	import Profile from "@/Components/Dashboard/Profile";

	export default {
		name: "ProfileDisplay",
		components: {Profile},

		computed: {
			user() {
				return this.$store.state.Profile.user;
			},
			imageSrc() {
				return this.user.path ? `/api${this.user.path}` : globe;
			}
		}
	}
</script>
