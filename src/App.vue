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
	import { provider } from '@/Services/LeafletMapService';

	export default {
		components: {
			MapView,
			NotFound
		},
		name: 'App',
		metaInfo() {
			const link = [];
			if (provider == 'mapbox') {
				link.push({
					rel: 'prefect',
					href: 'https://api.mapbox.com'
				})
			} else {
				link.push({
					rel: 'prefect',
					href: 'https://a.tile.openstreetmap.org'
				});
				link.push({
					rel: 'prefect',
					href: 'https://b.tile.openstreetmap.org'
				});

				link.push({
					rel: 'prefect',
					href: 'https://c.tile.openstreetmap.org'
				});
			}


			return {
				title: 'Home',
				titleTemplate: '%s | Captains Map',
				link
			}
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
