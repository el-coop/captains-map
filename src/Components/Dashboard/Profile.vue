<template>
	<div class="dashboard__control profile" :class="{'profile--open': isOpen}">
		<div class="profile__image">
			<slot name="image"></slot>
		</div>
		<div class="profile__content">
			<h4 class="title is-4" v-text="user.username"></h4>
			<slot name="content"></slot>
			<span class="icon profile__close is-hidden-touch" @click="$store.commit('Profile/toggle')">
				<FontAwesomeIcon icon="times-circle"/>
			</span>
		</div>
	</div>
</template>

<script>

	export default {
		name: "Profile",

		computed: {
			isOpen() {
				return this.$store.state.Profile.open;
			},
			user() {
				return this.$store.state.Profile.user;
			},
		},
	}
</script>
