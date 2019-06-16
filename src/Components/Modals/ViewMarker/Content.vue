<template>
	<div class="media">
		<div class="media-content">
			<div class="content view-marker__content">
				<p v-if="marker.location" v-text="marker.location"
				   class="is-size-6 has-text-grey-light has-text-weight-light "/>
				<p v-text="marker.description"/>
			</div>
		</div>
		<div class="media-right">
			<button class="button is-dark is-medium view-marker__content-button" @click="copyLink" v-if="! hasShare">
				<span class="icon">
					<FontAwesomeIcon icon="copy"/>
				</span>
			</button>
			<br class="is-hidden-desktop">
			<button class="button is-dark is-medium view-marker__content-button" @click="facebookShare">
				<span class="icon">
					<FontAwesomeIcon :icon="hasShare ? 'share-alt' : ['fab','facebook']"/>
				</span>
			</button>
		</div>
	</div>
</template>

<script>
	export default {
		name: "ViewMarkerContent",
		props: {
			marker: {
				type: Object
			},
		},

		data() {
			return {
				link: this.$router.resolve(`/${this.marker.user.username}/${this.marker.id}`).href,
				hasShare: navigator.share,
			}
		},

		methods: {
			async copyLink() {
				await navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}${this.link}`);
				this.$toast.info('You can paste it anywhere', 'Link copied');
			},

			async facebookShare() {
				const url = `${window.location.protocol}//${window.location.host}${this.link}`;
				if (this.hasShare) {
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
