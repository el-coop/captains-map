<template>
	<div class="card-header-title">
		<div class="media">
			<div class="media-left">
				<figure class="image is-64x64">
					<img class="profile-image is-rounded" :src="imageSrc"/>
				</figure>
			</div>
			<div class="media-content">
				<a @click.stop.prevent="linkClicked"
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
			async linkClicked() {
				this.$emit('view-user-page');
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
			},

			imageSrc() {
				if (!this.marker.user.bio) {
					return globe;
				}
				return this.marker.user.bio.path ? `/api${this.marker.user.bio.path}` : globe;
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
