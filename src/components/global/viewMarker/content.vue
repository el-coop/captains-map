<template>
	<div class="media ">
		<div class="media-content">
			<div class="content">
				<p v-text="marker.description"></p>
			</div>
		</div>
		<div class="media-right">
			<button class="button is-dark is-rounded" @click="copyLink">
                            <span class="icon">
                                <font-awesome-icon icon="copy"/>
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
				await this.$copyText(`${window.location.protocol}/${window.location.host}/${this.link}`);
				this.$toast.info('You can paste it anywhere', 'Link copied', {
					position: 'bottomCenter',
					timeout: 2000
				});
			}
		}
	}
</script>

<style scoped>

</style>