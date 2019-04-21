<template>
	<div id="app">
		<map-view/>
		<router-view/>
		<not-found/>
	</div>
</template>

<script>
	import NotFound from '@/Components/Modals/404';
	import MapView from '@/Components/Map/Map';

	export default {
		components: {
			MapView,
			NotFound
		},
		name: 'App',
		created() {
			window.addEventListener('online', this.onlineEvent);
		},
		beforeDestroy() {
			window.removeEventListener('online', this.onlineEvent);

		},
		methods: {
			onlineEvent() {
				this.$store.dispatch('Uploads/uploadOfflineError');
			},
		},
		metaInfo: {

			title: 'Home',
			titleTemplate: '%s | Captains Map',
		}
	}
</script>

<style lang="scss">
	@import "assets/styles/style";

	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
</style>
