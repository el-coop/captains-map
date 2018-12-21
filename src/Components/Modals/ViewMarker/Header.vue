<template>
	<div slot="header" class="card-header-title">
		<div class="media">
			<div class="media-left">
				<img class="profile-image" :src="profile.image"/>
			</div>
			<div class="media-content">
				<a @click="linkClicked"
				   class="has-text-white is-4" v-text="marker.user.username"/>
				<p class="is-7 has-text-weight-normal" v-text="marker.type"/>
				<p class="is-7 has-text-weight-light has-text-grey-lighter"
				   v-text="dateDisplay"></p>
			</div>
		</div>
	</div>
</template>

<script>
	import globe from '@/assets/images/globe-icon.png';

	export default {
		name: "view-marker-header",
		props: {
			marker: {
				type: Object
			},
			profile: {
				type: Object,
				default() {
					return {
						image: globe
					}
				}
			}
		},

		methods: {
			linkClicked() {
				this.$modal.hide('view-marker');
				this.$router.push(`/${this.marker.user.username}`);
			}
		},

		computed: {
			dateDisplay() {
				const date = new Date(this.marker.time);

				let hour = date.getUTCHours();
				if (hour < 10) {
					hour = `0${hour}`;
				}

				return `${date.getUTCDate()}/${date.getUTCMonth() + 1}/${date.getUTCFullYear()} ${hour}:${date.getUTCMinutes()}`;
			}

		}

	}
</script>

<style scoped>
	.profile-image {
		max-height: 50px;
		max-width: 50px;
	}

	.image > img {
		max-height: 400px;
		height: auto;
		max-width: 100%;
	}

</style>