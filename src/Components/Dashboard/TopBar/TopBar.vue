<template>
	<div class="top-bar">
		<div class="top-bar__left">
			<profile-open v-if="$router.currentRoute.name === 'edit' || this.$route.params.username"
						  class="is-hidden-mobile"/>
			<figure class="image is-32x32 is-hidden-mobile" v-else>
				<img class="is-rounded" :src="logo">
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
		name: "TopBar",
		components: {ProfileOpen},
		data() {
			return {
				logo: globe
			}
		},
	}
</script>

<style scoped lang="scss">
	@import "~$scss/variables";

	.top-bar {
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		@media (min-width: $tablet) {
			margin: 0 20vw 0 10vw;
		}

		&__left {
			display: flex;
			flex-direction: row;
			align-items: center;
		}
	}
</style>