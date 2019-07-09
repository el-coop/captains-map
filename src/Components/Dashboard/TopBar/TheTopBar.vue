<template>
	<div class="top-bar">
		<div class="top-bar__left">
			<ProfileOpen v-if="hasUsername" class="top-bar__profile"/>
			<figure class="image is-32x32 is-hidden-mobile" v-else>
				<picture>
					<source srcset="data:image/gif;base64,"
							media="(max-width: 768px)">
					<img class="is-rounded" :src="logo">
				</picture>
			</figure>
			<slot name="left"></slot>
		</div>
		<slot name="right"></slot>
	</div>
</template>

<script>
	import globe from '@/assets/images/globe-icon.png';
	import ProfileOpen from "@/Components/Dashboard/TopBar/ProfileOpen";

	export default {
		name: "TheTopBar",
		components: {ProfileOpen},

		data() {
			return {
				logo: globe
			}
		},

		computed: {
			hasUsername() {
				return this.$store.state.Markers.username;
			},
		}
	}
</script>
