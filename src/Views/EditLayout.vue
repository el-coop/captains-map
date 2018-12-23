<template>
	<div class="layout">
		<dashboard :edit-mode="true"/>
	</div>
</template>

<script>
	import Dashboard from '@/Components/Dashboard/Dashboard';
	import auth from '@/Services/authentication.service';
	import map from '@/Services/LeafletMapService';

	export default {
		name: "edit-layout",

		metaInfo: {
			title: 'Edit'
		},

		components: {
			Dashboard
		},

		created() {
			this.loadMarkers();
		},

		methods: {
			envSetup() {
				this.$modal.hide('404');
				this.$store.commit('Markers/setBorders', false);
				this.$store.commit('Markers/setUser', auth.getUserDetails().username);
				this.$store.dispatch('Profile/load', auth.getUserDetails().username);
			},

			async loadMarkers() {
				this.envSetup();

				const response = await this.$store.dispatch('Markers/load');
				if (response.status === 'cached') {
					this.$toast.info('Markers loaded from cache', '');
				}
				map.goToCurrentLocation();

			},
		},

		watch: {
			$route() {
				this.loadMarkers();
			}
		}

	}
</script>