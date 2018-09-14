<template>
	<div id="app">
		<map-view/>
		<router-view/>
	</div>
</template>

<script>
	import globe from '@/assets/images/globe-icon.png';

	export default {
		name: 'App',
		metaInfo: {

			title: 'Home',
			// all titles will be injected into this template
			titleTemplate: '%s | Captains Map',
			meta: [{
				'property': 'og:image',
				'content': globe,
				'vmid': 'og:image'
			}]
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
