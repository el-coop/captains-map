<template>
	<div class="dashboard__control profile" :class="{'profile--open': isOpen}">
		<div class="media h-100	">
			<div class="media-left">
				<figure class="image is-128x128">
					<img :src="user.path || logo">
				</figure>
			</div>
			<div class="media-content is-flex-1">
				<div class="is-flex-column h-100">
					<h4 class="title is-4" v-text="user.username"></h4>
					<ajax-form v-if="isEdit" method="post" :action="`bio/${user.username}`"
							   @submitting="loading = true"
							   @submitted="displaySuccess" class="is-flex-1 is-flex-column">
						<div class="field is-flex-1">
							<textarea v-model="description" name="description" class="textarea h-100"></textarea>

						</div>
						<button class="button is-primary is-fullwidth" :class="{'is-loading': loading}">Save</button>
					</ajax-form>
					<p class="is-flex-1" v-else v-text="user.description"></p>
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
	import AjaxForm from "@/Components/Utilities/AjaxForm";
	import Auth from '@/Services/authentication.service';

	export default {
		name: "profile",
		components: {AjaxForm},
		data() {
			return {
				logo: globe,
				description: '',
				loading: false,
			}
		},

		methods: {
			displaySuccess(response) {
				this.loading = false;
				if (response.status === 200) {
					this.$toast.success(' ', 'Profile updated.');
				} else {
					this.$toast.error('Please try again at a later time', 'Update failed.');
				}
			}
		},

		computed: {
			isEdit() {
				if (!Auth.getUserDetails() || !this.user.username) {
					return false;
				}
				return Auth.getUserDetails().username === this.user.username;
			},
			isOpen() {
				return this.$store.state.Profile.open;
			},
			user() {
				if (this.$store.state.Profile.user) {
					this.description = this.$store.state.Profile.user.description;
				}
				return this.$store.state.Profile.user;
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import "~$scss/variables";

	.media {
		padding: 1em;
		display: flex;
		flex-direction: column;
		align-items: stretch;

		.image {
			margin: auto;
		}

		@media #{$above-tablet} {
			flex-direction: row;
		}

		textarea {
			max-height: unset;
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