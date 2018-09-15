<template>
	<div :class="{ 'centered-text-wrapper' : ! embedCode}">
		<h4 class="title is-4" v-if="loading">Loading...</h4>
		<span class="loader" v-if="loading"></span>
		<div v-if="embedCode" v-html="embedCode"></div>
		<h4 class="title is-5" v-if="! loading && ! embedCode">There was an error getting data from Instagram.</h4>
		<h6 v-if="! loading && ! embedCode" class="subtitle is-6">Please try again later.</h6>
	</div>
</template>

<script>
	export default {
		name: "instagram",

		props: {
			markerId: {
				required: true,
				type: Number
			}
		},

		data() {
			return {
				embedCode: null,
				loading: true
			}
		},

		async created() {
			let response = await this.$http.get(`marker/instagram/${this.markerId}`);
			this.loading = false;
			if (response.data) {
				this.embedCode = response.data.html;
				this.$nextTick(() => {
					instgrm.Embeds.process();
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.centered-text-wrapper {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>