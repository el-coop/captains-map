<template>
	<div :class="{ 'view-marker__instagram' : ! embedCode}">
		<h4 class="title is-4" v-if="loading">Loading...</h4>
		<div class="is-loading" v-if="loading"></div>
		<div v-if="embedCode" v-html="embedCode"></div>
		<h4 class="title is-5" v-if="! loading && ! embedCode">There was an error getting data from Instagram.</h4>
		<h6 v-if="! loading && ! embedCode" class="subtitle is-6">Please try again later.</h6>
	</div>
</template>

<script>
	export default {
		name: "instagram",

		props: {
			id: {
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
			const response = await this.$http.get(`marker/instagram/${this.id}`);
			this.loading = false;
			if (response.data) {
				this.embedCode = response.data.html;
				await this.$nextTick;
				try {
					window.__igEmbedLoaded = this.setHeight;
					instgrm.Embeds.process();
				} catch (e) {
					delete window.__igEmbedLoaded;
				}
			}
		},


		methods: {
			setHeight() {
				const iframe = document.querySelector('iframe.instagram-media.instagram-media-rendered');
				iframe.style.height = `${iframe.height}px`;
				delete window.__igEmbedLoaded;
			}
		}
	}
</script>
