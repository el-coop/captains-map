<template>
	<div id="app">
		<map-view/>
		<router-view/>
	</div>
</template>

<script>
	import MapView from '@/Components/Map/Map';

	export default {
		components: {
			MapView
		},
		name: 'App',
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
