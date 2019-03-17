<template>
	<div class="media">
		<div class="media-content">
			<div class="content">
				<p v-if="marker.location" v-text="marker.location" class="is-size-6 has-text-grey-light has-text-weight-light"></p>
				<p v-text="marker.description"></p>
			</div>
		</div>
		<div class="media-right">
			<button class="button is-dark is-medium" @click="copyLink">
				<span class="icon">
					<font-awesome-icon icon="copy"/>
				</span>
			</button>
			<br class="is-hidden-desktop">
			<button class="button is-dark is-medium" @click="facebookShare">
				<span class="icon">
					<font-awesome-icon :icon="['fab','facebook']"/>
				</span>
			</button>
		</div>
	</div>
</template>

<script>
	export default {
		name: "view-marker-content",
		props: {
			marker: {
				type: Object
			},
		},

		data() {
			return {
				link: this.$router.resolve(`/${this.marker.user.username}/${this.marker.id}`).href
			}
		},

		methods: {
			async copyLink() {
				await this.$copyText(`${window.location.protocol}//${window.location.host}${this.link}`);
				this.$toast.info('You can paste it anywhere', 'Link copied');
			},

			async facebookShare() {
				const url = `${window.location.protocol}//${window.location.host}${this.link}`;
				if (navigator.share) {
					try {
						await navigator.share({
							title: '',
							text: '',
							url: url,
						});
					} catch (error) {

					}
					return;
				}

				window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`,);
			}
		},
	}
</script>

<style lang="scss" scoped>
	@import "~$scss/variables";

	.content {
		& > p {
			white-space: pre-wrap;
			word-wrap: break-word;
		}
	}

	.button {
		margin-bottom: 0.5em;

		@media #{$above-tablet}{
			border-radius: 0;
			&:first-child {
				border-bottom-left-radius: 4px;
				border-top-left-radius: 4px;
			}

			&:last-child {
				border-bottom-right-radius: 4px;
				border-top-right-radius: 4px;
			}
		}
	}

</style>
