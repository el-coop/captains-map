<template>
	<div class="profile-open">
		<button class="button is-light is-outlined is-borderless is-light-hover">
			<figure class="image is-32x32 icon">
				<img class="is-rounded" :src="logo">
			</figure>&nbsp;
			<span class="is-size-7-tablet button-text"
				  v-text="$store.state.Markers.username"></span>
			<span class="is-hidden-tablet icon is-small">
				<!--<font-awesome-icon icon="chevron-down" size="sm"/>-->
			</span>
		</button>
	</div>
</template>

<script>
	import globe from '@/assets/images/globe-icon.png';

	export default {
		name: "ProfileOpen",
		data() {
			return {
				logo: globe
			}
		},
	}
</script>

<style scoped lang="scss">
	@import "~$scss/variables";

	.profile-open {
		z-index: 10;
		width: 100%;
		background-color: transparentize(whitesmoke, 0.05);

		& > .button {
			height: 100%;
			width: 100%;
			border-radius: 0;
			color: invert($text, 100) !important;
			padding: calc(0.375em - 1px) 5vw;
			> .icon:last-child {
				margin-left: auto;
			}

			> .button-text {
				padding-bottom: 0.1em;
			}

		}

		@media (min-width: $tablet) {
			width: auto;
			background-color: transparent;

			& > .button {
				width: auto;
				border-radius: 4px;
				color: $text !important;
				padding: calc(0.375em - 1px) 0.75em;
				> .button-text {
					padding-bottom: 0;
				}

			}
		}

	}
</style>