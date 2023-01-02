<template>
	<div id="app">
		<TheMap/>
		<RouterView/>
		<NotFound/>
	</div>
</template>

<script>
	import NotFound from '@/Components/Modals/404';
	import TheMap from '@/Components/Map/TheMap';

	export default {
		name: 'App',

		components: {
			TheMap,
			NotFound
		},
        beforeCreate() {
            this.$store.dispatch('Uploads/init');
            this.$store.dispatch('initSettings');
        },
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
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
</style>
