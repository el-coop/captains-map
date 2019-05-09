<template>
	<div class="profile-open" @click="$store.commit('Profile/toggle')">
		<button class="profile-open__button button is-light is-outlined is-borderless is-light-hover"
				:class="{'is-loading': ! user.username}">
			<figure class="image profile-open__button-img is-32x32 icon">
				<img class="is-rounded image profile-open__button-img-src" :src="imageSrc">
			</figure>
			&nbsp;
			<span class="is-size-7-tablet profile-open__button-text"
				  v-text="user.username"></span>
			<span class="is-hidden-tablet icon is-small">
				<FontAwesomeIcon :icon="isOpen ? 'times-circle' : 'chevron-down'" size="sm"/>
			</span>
		</button>
	</div>
</template>

<script>
	import globe from '@/assets/images/globe-icon.png';

	export default {
		name: "ProfileOpen",
		computed: {
			isOpen() {
				return this.$store.state.Profile.open
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
