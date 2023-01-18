<template>
	<div class="profile-open">
		<button class="profile-open__button button"
				@click="$store.commit('Profile/toggle')"
				:class="{'is-loading': !user.username}">
			<figure class="image profile-open__button-img is-32x32 icon">
				<img class="is-rounded" :src="imageSrc">
			</figure>
			<span class="is-size-7-tablet profile-open__button-text"
				  v-text="user.username"/>
			<span class="is-hidden-tablet icon">
				<FontAwesomeIcon :icon="isOpen ? 'times-circle' : 'chevron-down'" size="sm"/>
			</span>
		</button>
		<FollowButton v-if="$store.state.Webpush.hasPush && user.username" :user="user.username"/>
	</div>
</template>

<script>
	import globe from '@/assets/images/globe-icon.png';
	import FollowButton from "@/Components/Dashboard/TopBar/FollowButton.vue";

	export default {
		name: "ProfileOpen",
		components: {FollowButton},
		computed: {
			isOpen() {
				return this.$store.state.Profile.open;
			},

			imageSrc() {
				return this.user.path ? `/api${this.user.path}` : globe;
			},
			user() {
				return this.$store.state.Profile.user;
			}
		}
	}
</script>
