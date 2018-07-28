<template>
    <div v-html="embedCode" :class="{ 'loader-wrapper' : loading}"></div>
</template>

<script>
	export default {
		name: "instagram",

		props: {
			path: {
				required: true,
				type: String
			}
		},

		data() {
			return {
				embedCode: '<h4 class="title is-4">Loading...</h4><span class="loader"></span>',
				loading: true
			}
		},

		async created() {
			let response = await this.$http.get(`marker/instagram/${this.path}`);
			this.loading = false;
			this.embedCode = response.data.data.html;
			this.$nextTick(() => {
				instgrm.Embeds.process();
			});
		}
	}
</script>

<style lang="scss" scoped>
    .loader-wrapper {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
</style>