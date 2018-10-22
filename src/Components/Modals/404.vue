<template>
	<slide-up-modal name="404" @before-close="navigateHome" @before-open="beforeOpen" route-name="404">
		<p slot="header" class="card-header-title">404</p>
		<template slot="content">
			<div class="content">
				<h5 class="has-text-centered is-size-5 ">You uncovered Atlantis! Unfortunately it's not on our map.</h5>
			</div>
			<div class="tear-wrapper">
				<img :src="atlantis" class="atlantis">
				<img :src="tear" class="tear">
			</div>
		</template>
		<template slot="footer">
			<p class="card-footer-item">
				<span>
					<a @click="$modal.hide('404')">Take me out of here!</a>
				</span>
			</p>
		</template>
	</slide-up-modal>
</template>

<script>
	import SlideUpModal from "@/Components/Utilities/SlideUpModal";
	import atlantis from '@/assets/images/atlantis.jpg';
	import tear from '@/assets/images/tear.png';

	export default {
		name: "not-found",
		components: {SlideUpModal},

		data() {
			return {
				atlantis,
				tear,
				openRoute: ''
			}
		},

		methods: {
			beforeOpen() {
				this.openRoute = this.$router.currentRoute.fullPath;
			},
			navigateHome() {
				if (this.openRoute === this.$router.currentRoute.fullPath) {
					this.$router.push('/');
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "~$scss/variables";

	.content > h5 {
		color: $text;
	}

	.tear-wrapper {
		position: relative;
		& > .tear {
			position: absolute;
			height: 100%;
			width: 100%;
			top: 0;
			left: 0;
		}
	}

	.atlantis {
		margin-top: 10px;
		clip-path: polygon(22.02% 15.16%, 3.26% 51.73%, 30.44% 78.79%, 82.6% 59.14%, 78.81% 26.57%, 46.38% 6.55%);
	}
</style>