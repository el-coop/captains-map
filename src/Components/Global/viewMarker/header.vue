<template>
	<div slot="header" class="card-header-title">
		<div class="media">
			<div class="media-left">
				<img class="profile-image" :src="profile.image"/>
			</div>
			<div class="media-content">
				<p class="is-4" v-text="marker.user.username"/>
				<p class="is-7 has-text-weight-normal" v-text="marker.type"/>
				<p class="is-7 has-text-weight-light has-text-grey-lighter">{{ marker.time | moment("calendar",
					null, {
					sameElse: 'DD/MM/YYYY HH:mm'
					}) }}</p>
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