<template>
	<div class="dashboard__control profile" :class="{'profile--open': isOpen}">
		<div class="media">
			<div class="media-left">
				<figure class="image is-128x128">
					<img :src="user.image || logo">
				</figure>
			</div>
			<div class="media-content">
				<div>
					<h4 class="title is-4" v-text="user.name"></h4>
					<p v-text="user.bio"></p>
				</div>
			</div>
			<div class="media-right is-hidden-touch">
				<span class="icon profile-close" @click="$store.commit('Profile/toggle')">
					<font-awesome-icon icon="times-circle"/>
				</span>
			</div>
		</div>
	</div>
</template>

<script>
	import globe from '../../assets/images/globe-icon.png';

	export default {
		name: "profile",

		data() {
			return {
				logo: globe
			}
		},

		computed: {
			isOpen() {
				return this.$store.state.Profile.open;
			},
			user() {
				return this.$store.state.Profile.user;
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import "~$scss/variables";

	.media {
		display: block;
		padding: 1em;

		.image {
			margin: auto;
		}

		@media #{$above-tablet} {
			display: flex;
		}
	}

	.profile {
		overflow: hidden;
		box-shadow: 5px 5px 20px 10px rgba(0, 0, 0, 0.3);
		flex: 1;
		height: 0;
		transition: height $animation-speed;
		align-self: start;

		&--open {
			height: 100%;
			overflow: auto;
		}
	}

	.profile-close {
		cursor: pointer;
	}
</style>