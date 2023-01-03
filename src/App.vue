<template>
	<div id="app">
		<TheMap @marker-click="selectedMarker = $event" @map-create-marker="createMarkerData = $event"/>
		<RouterView @404="notFound = true"
                    @env-setup="notFound = false"
                    v-model:selectedMarker="selectedMarker"
                    v-model:createMarkerData="createMarkerData"
        />
		<NotFound v-model:active="notFound"/>
	</div>
</template>

<script>
	import NotFound from '@/Components/Modals/404';
	import TheMap from '@/Components/Map/TheMap';

	export default {
		name: 'App',
        
        data(){
		    return {
                notFound: false,
                selectedMarker: null,
                createMarkerData: null
            }
        },

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

		beforeUnmount() {
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
