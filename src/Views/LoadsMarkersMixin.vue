<script>
	export default {
		name: "LoadsMarkersMixin",

		created() {
			this.$_envSetup();
			this.envSetup();
			this.loadMarkers();
		},

		methods: {
			$_envSetup(){
				this.$modal.hide('404');
				this.$store.commit('Markers/setBorders', false);
			},

			async loadMarkers() {
				const response = await this.$store.dispatch('Markers/load', this.payload || false);
				if (response.status === 'cached') {
					this.$toast.info('Markers loaded from cache', '');
				}

				if (response.status === 404) {
					return this.$modal.show('404');
				}

				this.markersLoaded(response);
			}
		}
	}
</script>
