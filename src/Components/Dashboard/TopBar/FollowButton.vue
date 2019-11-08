<template>
	<button class="webpush button" :class="{'is-loading': loading}" @click="toggleFollow">
		<FontAwesomeIcon icon="rss" class="icon"/>
		<span v-text="buttonText"/>
	</button>
</template>

<script>

	export default {
		name: "FollowButton",

		props: {
			user: {
				type: String,
				required: true
			}
		},

		data() {
			return {
				loading: false,
				following: false
			}
		},

		computed: {
			buttonText() {
				if (this.$store.state.Webpush.following.includes(this.user)) {
					return 'Unfollow';
				}
				return 'Follow';
			}
		},

		methods: {
			async toggleFollow() {
				this.loading = true;
				const success = await this.$store.dispatch('Webpush/toggleFollow', this.user);

				if (!success) {
					this.$toast.error('Please try again at a later time', 'Following failed.');
				} else if (success === 201) {
					this.following = true;
				} else {
					this.following = false;
				}

				this.loading = false;
			}
		},
	}
</script>
