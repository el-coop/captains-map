<template>
	<div class="top-bar">
		<div class="top-bar__left">
			<profile-open v-if="hasUsername" class="top-bar__profile"/>
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

		computed: {
			hasUsername() {
				return this.$store.state.Markers.username;
			}
		}
	}
</script>

<style scoped lang="scss">
	@import "~$scss/variables";

	.top-bar {
		height: 100%;
		display: flex;
		justify-content: stretch;
		flex-direction: column-reverse;
		align-items: start;
		@media (min-width: $tablet) {
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			margin: 0 20vw 0 10vw;
		}

		&__left {
			display: flex;
			flex-direction: row;
			align-items: center;
			width: 100%;
			@media (min-width: $tablet) {
				width: auto;
			}
		}

		.buttons {
			width: 100%;
			height: 100%;

			@media (min-width: $tablet) {
				width: auto;
			}

			> .button {
				flex: 1;
				height: 100%;
				position: relative;

				&:not(:last-child):after {
					position: absolute;
					right: 0;
					content: ' ';
					border: lighten($background, 3) solid 1px;
					height: 50%;
				}
			}
		}
	}

</style>